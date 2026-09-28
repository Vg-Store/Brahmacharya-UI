import React, { useState, useEffect } from 'react';
import { Download, Check, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  // Only show if browser provides install prompt or if on iOS
  if (!deferredPrompt && !isIOS) {
    return null;
  }

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-amber-950/80 via-stone-900 to-stone-900 border border-amber-600/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-lg text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-amber-200 block font-semibold">
              Install App on Phone / Desktop
            </strong>
            <span className="text-stone-400 text-[11px]">
              Full-screen app with 100% offline access &amp; instant loading.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-stone-500 hover:text-stone-300 transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showIOSGuide && (
        <div className="mt-2 p-3 bg-stone-950 border border-stone-800 rounded-xl text-xs space-y-1.5 text-stone-300">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-amber-300">How to Install on iPhone / iPad:</span>
            <button onClick={() => setShowIOSGuide(false)} className="text-stone-500 hover:text-white">✕</button>
          </div>
          <ol className="list-decimal list-inside text-[11px] text-stone-400 space-y-1">
            <li>Tap the <strong>Share</strong> button (box with upward arrow) in Safari.</li>
            <li>Scroll down and tap <strong>'Add to Home Screen'</strong>.</li>
            <li>Tap <strong>'Add'</strong> in the top-right corner.</li>
          </ol>
        </div>
      )}
    </div>
  );
};
