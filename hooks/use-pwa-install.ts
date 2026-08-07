'use client';

import { useEffect, useState, useCallback } from 'react';

const DISMISSED_KEY = 'cw_pwa_install_dismissed_until';
const COOLDOWN_DAYS = 7;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

interface UsePwaInstallReturn {
  /** True when the browser has emitted beforeinstallprompt and the app is not yet installed */
  canInstall: boolean;
  /** True when running as an installed PWA (standalone display mode) */
  isInstalled: boolean;
  /** Whether the user dismissed the prompt within the cooldown window */
  isDismissed: boolean;
  /** Triggers the native browser install dialog */
  install: () => Promise<'accepted' | 'dismissed' | null>;
  /** Suppresses the prompt for COOLDOWN_DAYS days */
  dismiss: () => void;
}

export function usePwaInstall(): UsePwaInstallReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed)
    const mql = window.matchMedia('(display-mode: standalone)');
    setIsInstalled(mql.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);

    const handleChange = (e: MediaQueryListEvent) => setIsInstalled(e.matches);
    mql.addEventListener('change', handleChange);

    // Check localStorage cooldown
    const dismissedUntil = localStorage.getItem(DISMISSED_KEY);
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      setIsDismissed(true);
    }

    // Capture the deferred prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If the user completes installation, clear the deferred prompt
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mql.removeEventListener('change', handleChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | null> => {
    if (!deferredPrompt) return null;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome;
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    const until = Date.now() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISSED_KEY, String(until));
    setIsDismissed(true);
  }, []);

  return {
    canInstall: !!deferredPrompt && !isInstalled,
    isInstalled,
    isDismissed,
    install,
    dismiss,
  };
}
