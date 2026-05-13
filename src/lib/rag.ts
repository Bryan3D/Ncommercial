/**
 * Lightweight RAG (Retrieval-Augmented Generation) for the Naguabo Commercial chatbot.
 * Loads 400 bilingual Q&A pairs from the mcp-server training file once, caches in memory,
 * and returns the top-K most relevant pairs for any user query.
 *
 * No vector DB required — uses token-overlap scoring (TF-style).
 * Language is auto-detected from the query so Spanish queries get Spanish answers.
 */

import fs from 'fs';
import path from 'path';

export interface QAPair {
  id: string;
  language: 'en' | 'es';
  question: string;
  answer: string;
  category_en: string;
  category_es: string;
  tags: string;
}

// Module-level cache — loaded once on first call
let kb: QAPair[] | null = null;

function load(): QAPair[] {
  if (kb) return kb;
  try {
    const file = path.join(
      process.cwd(),
      'mcp-server',
      'naguabo_commercial_rag_400_qa_en_es_expanded.jsonl',
    );
    kb = fs
      .readFileSync(file, 'utf-8')
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as QAPair);
    console.log(`[RAG] Loaded ${kb.length} Q&A pairs`);
  } catch (e) {
    console.warn('[RAG] Could not load knowledge base:', e);
    kb = [];
  }
  return kb;
}

// Very simple language detector based on Spanish diacritics / common words
function detectLang(query: string): 'en' | 'es' {
  return /[áéíóúñü¿¡]|(\b(qué|cómo|dónde|cuándo|cuánto|está|tiene|hay|para|costo|precio|envío|tienda|horario|tengo|necesito|puedo|gracias)\b)/i.test(
    query,
  )
    ? 'es'
    : 'en';
}

// Score a Q&A pair against the query by counting matching tokens
function score(queryTokens: string[], qa: QAPair): number {
  const corpus = `${qa.question} ${qa.tags} ${qa.answer}`.toLowerCase();
  let s = 0;
  for (const t of queryTokens) {
    if (corpus.includes(t)) s += 1;
    // Bonus for exact match in question (higher signal)
    if (qa.question.toLowerCase().includes(t)) s += 0.5;
  }
  return s;
}

/**
 * Retrieve the top-K most relevant Q&A pairs for a given query.
 * Prefers pairs in the detected language; falls back to the other language
 * to fill remaining slots.
 */
export function retrieve(query: string, topK = 5): QAPair[] {
  const pairs = load();
  if (!pairs.length) return [];

  const lang = detectLang(query);
  const tokens = query
    .toLowerCase()
    .split(/[\s,;.!?¿¡]+/)
    .filter((t) => t.length > 2);

  if (!tokens.length) return [];

  const rank = (list: QAPair[]) =>
    list
      .map((qa) => ({ qa, s: score(tokens, qa) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s);

  const primary = rank(pairs.filter((qa) => qa.language === lang));
  const secondary = rank(pairs.filter((qa) => qa.language !== lang));

  const results: QAPair[] = [];
  const seen = new Set<string>();

  for (const { qa } of [...primary, ...secondary]) {
    if (results.length >= topK) break;
    // Deduplicate by base id (strip _en / _es suffix)
    const base = qa.id.replace(/_en$|_es$/, '');
    if (!seen.has(base)) {
      seen.add(base);
      results.push(qa);
    }
  }

  return results;
}

/** Format retrieved pairs as a compact context block for the system prompt */
export function formatContext(pairs: QAPair[]): string {
  if (!pairs.length) return '';
  return (
    '\n\n--- RELEVANT KNOWLEDGE BASE FACTS ---\n' +
    pairs.map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n') +
    '\n--- END FACTS ---'
  );
}
