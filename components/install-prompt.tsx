'use client';

import { useEffect, useState } from 'react';
import { usePwaInstall } from '@/hooks/use-pwa-install';

/* ─── Browser / platform detection ─────────────────────────────────────────── */

type InstallScenario =
  | 'native'          // beforeinstallprompt fired — one-tap install
  | 'ios-safari'      // iOS Safari — manual share-sheet instructions
  | 'ios-other'       // iOS non-Safari — redirect to Safari
  | 'android-menu'    // Android Firefox — use browser menu
  | 'none';           // Desktop Firefox/Safari or already installed

function useInstallScenario(canInstall: boolean, isInstalled: boolean): InstallScenario {
  const [scenario, setScenario] = useState<InstallScenario>('none');

  useEffect(() => {
    if (isInstalled) {
      setScenario('none');
      return;
    }

    // If beforeinstallprompt already fired, use native flow
    if (canInstall) {
      setScenario('native');
      return;
    }

    const ua = navigator.userAgent;
    const isIos = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);

    if (isIos) {
      // On iOS, only Safari (and browsers using the native WKWebView *in-app*)
      // supports "Add to Home Screen". Chrome, Firefox, etc. on iOS do NOT.
      // Safari's UA contains "Safari/" but NOT "CriOS" (Chrome) or "FxiOS" (Firefox)
      // or "EdgiOS" (Edge) or "OPiOS" (Opera).
      const isIosSafari =
        /safari/i.test(ua) &&
        !/crios|fxios|edgios|opios|duckduckgo|gsa/i.test(ua);

      setScenario(isIosSafari ? 'ios-safari' : 'ios-other');
      return;
    }

    if (isAndroid) {
      // Android Firefox doesn't fire beforeinstallprompt but does support
      // installing PWAs via the browser menu (three-dot → "Install")
      const isFirefox = /firefox/i.test(ua);
      if (isFirefox) {
        setScenario('android-menu');
        return;
      }
    }

    // Desktop Firefox, Safari, or other non-supporting browsers — don't show
    setScenario('none');
  }, [canInstall, isInstalled]);

  return scenario;
}

/* ─── Cherrywood app icon ──────────────────────────────────────────────────── */
function AppIcon() {
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 12,
        background: 'linear-gradient(135deg, #0d1b2e 0%, #1a3050 100%)',
        border: '1px solid rgba(201,168,76,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 12px rgba(13,27,46,0.18)',
      }}
      aria-hidden="true"
    >
      {/* Stylised "C" monogram */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path
          d="M20 8.5C18.3 7 16.3 6 14 6C9.6 6 6 9.6 6 14C6 18.4 9.6 22 14 22C16.3 22 18.3 21 20 19.5"
          stroke="#c9a84c"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

/* ─── Inline SVG icons ─────────────────────────────────────────────────────── */

/** iOS Safari share icon (square with arrow) */
function ShareIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }}
      aria-hidden="true"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

/** Three-dot vertical menu icon (Android Firefox, etc.) */
function MenuDotsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }}
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

/** Safari compass icon */
function SafariIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#007AFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="#007AFF" stroke="none" />
    </svg>
  );
}

/* ─── Per-scenario instruction text ────────────────────────────────────────── */

function InstructionText({ scenario }: { scenario: InstallScenario }) {
  const textStyle = {
    margin: '0 0 20px',
    fontSize: '0.875rem' as const,
    color: '#4a5568',
    lineHeight: 1.6,
    fontWeight: 400 as const,
  };

  switch (scenario) {
    case 'native':
      return (
        <p id="cw-install-desc" style={textStyle}>
          Install the Cherrywood app for a faster, full-screen experience —
          browse luxury residences anytime, even offline.
        </p>
      );

    case 'ios-safari':
      return (
        <p id="cw-install-desc" style={textStyle}>
          To install: tap <ShareIcon /> in the toolbar below, then choose{' '}
          <strong style={{ color: '#0d1b2e', fontWeight: 600 }}>
            &ldquo;Add to Home Screen&rdquo;
          </strong>
          .
        </p>
      );

    case 'ios-other':
      return (
        <p id="cw-install-desc" style={textStyle}>
          To install, open this page in{' '}
          <strong style={{ color: '#007AFF', fontWeight: 600 }}>
            <SafariIcon /> Safari
          </strong>{' '}
          and tap <ShareIcon /> → {' '}
          <strong style={{ color: '#0d1b2e', fontWeight: 600 }}>
            &ldquo;Add to Home Screen&rdquo;
          </strong>
          .
        </p>
      );

    case 'android-menu':
      return (
        <p id="cw-install-desc" style={textStyle}>
          To install: tap <MenuDotsIcon /> in the top-right corner, then choose{' '}
          <strong style={{ color: '#0d1b2e', fontWeight: 600 }}>
            &ldquo;Install&rdquo;
          </strong>{' '}
          or{' '}
          <strong style={{ color: '#0d1b2e', fontWeight: 600 }}>
            &ldquo;Add to Home Screen&rdquo;
          </strong>
          .
        </p>
      );

    default:
      return null;
  }
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export function InstallPrompt() {
  const { canInstall, isInstalled, isDismissed, install, dismiss } = usePwaInstall();
  const scenario = useInstallScenario(canInstall, isInstalled);

  // Delayed appearance so it doesn't flash immediately on page load
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  const shouldShow = mounted && visible && !closing && !isDismissed && scenario !== 'none';

  const handleDismiss = () => {
    setClosing(true);
    setTimeout(dismiss, 420); // wait for exit animation
  };

  const handleInstall = async () => {
    const outcome = await install();
    if (outcome === 'accepted' || outcome === null) {
      setClosing(true);
    }
  };

  if (!shouldShow) return null;

  return (
    <>
      {/* Styles injected inline to keep the component self-contained */}
      <style>{`
        @keyframes cw-slide-up {
          from { transform: translateY(110%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes cw-slide-down {
          from { transform: translateY(0);    opacity: 1; }
          to   { transform: translateY(110%); opacity: 0; }
        }
        .cw-install-prompt {
          animation: cw-slide-up 0.42s cubic-bezier(0.22, 0.61, 0.36, 1) both;
        }
        .cw-install-prompt.closing {
          animation: cw-slide-down 0.38s cubic-bezier(0.55, 0, 1, 0.45) both;
        }
      `}</style>

      {/* Backdrop for mobile */}
      <div
        onClick={handleDismiss}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(13,27,46,0.25)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 9998,
        }}
        className="md:hidden"
        aria-hidden="true"
      />

      {/* The prompt card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cw-install-title"
        aria-describedby="cw-install-desc"
        className={`cw-install-prompt${closing ? ' closing' : ''}`}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'linear-gradient(160deg, #fcfbf8 0%, #f7f5f0 100%)',
          borderTop: '1px solid rgba(201,168,76,0.25)',
          borderRadius: '20px 20px 0 0',
          boxShadow:
            '0 -8px 40px rgba(13,27,46,0.14), 0 -2px 8px rgba(13,27,46,0.06)',
          padding: '24px 20px 32px',
          maxWidth: '100%',
        }}
      >
        {/* Drag handle */}
        <div
          aria-hidden="true"
          style={{
            width: 40,
            height: 4,
            borderRadius: 99,
            background: 'rgba(13,27,46,0.15)',
            margin: '0 auto 20px',
          }}
        />

        {/* Header row */}
        <div
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
            marginBottom: 18,
          }}
        >
          <AppIcon />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              id="cw-install-title"
              style={{
                margin: 0,
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#0d1b2e',
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
              }}
            >
              Cherrywood
            </p>
            <p
              style={{
                margin: '3px 0 0',
                fontSize: '0.78rem',
                color: '#c9a84c',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Luxury Real Estate
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss install prompt"
            style={{
              background: 'rgba(13,27,46,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              color: '#0d1b2e',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(13,27,46,0.12)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'rgba(13,27,46,0.06)')
            }
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Per-browser instruction text */}
        <InstructionText scenario={scenario} />

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {scenario === 'native' && (
            <button
              id="cw-install-btn"
              onClick={handleInstall}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: 10,
                border: 'none',
                background:
                  'linear-gradient(135deg, #c9a84c 0%, #b8973d 100%)',
                color: '#0d1b2e',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'opacity 0.2s, transform 0.15s',
                boxShadow: '0 2px 12px rgba(201,168,76,0.35)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Add to Home Screen
            </button>
          )}
          <button
            id="cw-install-dismiss-btn"
            onClick={handleDismiss}
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: 10,
              border: '1px solid rgba(13,27,46,0.12)',
              background: 'transparent',
              color: '#6b7280',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(13,27,46,0.04)';
              e.currentTarget.style.color = '#0d1b2e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            {scenario === 'native' ? 'Not now' : 'Got it'}
          </button>
        </div>
      </div>
    </>
  );
}
