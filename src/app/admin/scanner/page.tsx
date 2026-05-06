'use client';
import { useState, useRef, useEffect } from 'react';
import { ScanLine, Camera, Plus, Minus, Check, X, Box } from 'lucide-react';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/types';

interface ScanLogEntry {
  barcode: string;
  productName: string;
  action: string;
  quantity: number;
  timestamp: string;
}

export default function ScannerPage() {
  const [barcode, setBarcode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState<'RECEIVE' | 'ADJUST' | 'AUDIT'>('RECEIVE');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [log, setLog] = useState<ScanLogEntry[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Lookup by barcode
  const lookup = (code: string) => {
    setError('');
    const p = mockProducts.find((x) => x.barcode === code);
    if (p) {
      setScannedProduct(p);
    } else {
      setError(`Barcode ${code} not found in catalog. Add it to inventory?`);
      setScannedProduct(null);
    }
  };

  // Submit form (manual barcode entry or after scan)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    lookup(barcode);
  };

  const confirmScan = async () => {
    if (!scannedProduct) return;
    // Send to backend
    try {
      await fetch('/api/inventory/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode: scannedProduct.barcode,
          productId: scannedProduct.id,
          action,
          quantity: action === 'AUDIT' ? quantity : (action === 'RECEIVE' ? quantity : -quantity),
        }),
      });
    } catch (e) {
      console.error(e);
    }

    setLog((prev) => [
      {
        barcode: scannedProduct.barcode,
        productName: scannedProduct.name,
        action,
        quantity,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev,
    ].slice(0, 20));

    // Reset for next scan
    setBarcode('');
    setScannedProduct(null);
    setQuantity(1);
    inputRef.current?.focus();
  };

  // Camera-based scanning using html5-qrcode
  const startCamera = async () => {
    setError('');
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const id = 'qr-reader';
      const scanner = new Html5Qrcode(id);
      scannerRef.current = scanner;
      setCameraActive(true);
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText: string) => {
          setBarcode(decodedText);
          lookup(decodedText);
          stopCamera();
        },
        () => {} // ignore scan failures
      );
    } catch (e) {
      setError('Camera not available. Use a USB barcode scanner or type the code.');
      setCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setCameraActive(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Barcode Scanner</h1>
        <p className="text-gray-600 mt-1">
          Scan boxes & items to update inventory in real time. Works with USB scanners, phone cameras, or manual entry.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Action picker */}
          <div className="card p-4">
            <h3 className="font-bold mb-3">Action Type</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['RECEIVE', 'ADJUST', 'AUDIT'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAction(a)}
                  className={`border-2 rounded p-2 text-sm font-semibold ${
                    action === a ? 'border-brand bg-orange-50 text-brand' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {a === 'RECEIVE' && <><Plus className="w-4 h-4 inline mr-1" />Receive</>}
                  {a === 'ADJUST' && <><Minus className="w-4 h-4 inline mr-1" />Sell/Adjust</>}
                  {a === 'AUDIT' && <><Box className="w-4 h-4 inline mr-1" />Audit</>}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {action === 'RECEIVE' && 'Add stock from incoming boxes/shipments.'}
              {action === 'ADJUST' && 'Remove stock (damaged, sold offline, etc).'}
              {action === 'AUDIT' && 'Set stock to a counted value.'}
            </p>
          </div>

          {/* Camera scanner */}
          <div className="card p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4" /> Camera scan
            </h3>
            <div id="qr-reader" className="rounded overflow-hidden bg-gray-100 min-h-[250px] flex items-center justify-center">
              {!cameraActive && <span className="text-sm text-gray-500">Camera off</span>}
            </div>
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className={`mt-3 w-full ${cameraActive ? 'btn-outline' : 'btn-primary'}`}
            >
              {cameraActive ? 'Stop camera' : 'Start camera'}
            </button>
          </div>

          {/* Manual / USB entry */}
          <form onSubmit={handleSubmit} className="card p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <ScanLine className="w-4 h-4" /> Manual / USB scanner
            </h3>
            <input
              ref={inputRef}
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Scan or type barcode (UPC/EAN)"
              className="input-field text-lg font-mono"
              autoComplete="off"
            />
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="input-field mt-2"
              placeholder="Quantity"
            />
            <button type="submit" className="btn-primary w-full mt-2">
              Look up
            </button>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </form>
        </div>

        {/* Result + log */}
        <div className="space-y-4">
          {scannedProduct && (
            <div className="card p-4 border-2 border-green-500">
              <div className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={scannedProduct.imageUrl} alt={scannedProduct.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">{scannedProduct.brand} · {scannedProduct.sku}</div>
                  <div className="font-bold">{scannedProduct.name}</div>
                  <div className="text-sm mt-1">
                    Current stock: <strong>{scannedProduct.stock}</strong> ·
                    {action === 'RECEIVE' && <span className="text-green-700"> → {scannedProduct.stock + quantity}</span>}
                    {action === 'ADJUST' && <span className="text-red-700"> → {Math.max(0, scannedProduct.stock - quantity)}</span>}
                    {action === 'AUDIT' && <span className="text-blue-700"> → {quantity} (overwrite)</span>}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button onClick={confirmScan} className="btn-primary flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Confirm
                </button>
                <button onClick={() => setScannedProduct(null)} className="btn-outline flex items-center justify-center gap-1">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          )}

          <div className="card p-4">
            <h3 className="font-bold mb-3">Recent scans (this session)</h3>
            {log.length === 0 ? (
              <p className="text-sm text-gray-500">No scans yet. Scan or type a barcode to get started.</p>
            ) : (
              <ul className="divide-y text-sm max-h-96 overflow-y-auto">
                {log.map((entry, i) => (
                  <li key={i} className="py-2 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{entry.productName}</div>
                      <div className="text-xs text-gray-500">{entry.barcode} · {entry.timestamp}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      entry.action === 'RECEIVE' ? 'bg-green-100 text-green-700' :
                      entry.action === 'ADJUST' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {entry.action} ×{entry.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
