// ════════════════════════════════════════════════════
// PULSE — Rescan Button
// ════════════════════════════════════════════════════

import React, { useState } from 'react';
import { useArticlesStore } from '../../store';
import { RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '../../utils';
import toast from 'react-hot-toast';

export function RescanButton() {
  const { refresh, isLoading } = useArticlesStore();
  const [scanning, setScanning] = useState(false);

  const handleRescan = async () => {
    setScanning(true);
    try {
      await refresh();
      toast.success('📡 Rescan complete');
    } catch {
      toast.error('Rescan failed');
    } finally {
      setScanning(false);
    }
  };

  return (
    <button
      onClick={handleRescan}
      disabled={isLoading || scanning}
      className="btn-secondary btn-sm flex items-center gap-2 transition-all"
      aria-label="Rescan for new articles"
    >
      {scanning ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Scanning…</span>
        </>
      ) : (
        <>
          <RefreshCw className={cn('h-4 w-4', scanning && 'animate-spin')} />
          <span>Rescan</span>
        </>
      )}
    </button>
  );
}