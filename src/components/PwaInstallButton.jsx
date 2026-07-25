import React, { useEffect, useState } from 'react';

function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isAppleMobile() {
  if (typeof window === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function fallbackInstruction() {
  if (isAppleMobile()) {
    return 'On iPhone or iPad, tap Share in Safari, then choose Add to Home Screen.';
  }

  return 'If the prompt does not open, use the install icon in your browser address bar or menu.';
}

export default function PwaInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => isStandaloneDisplay());
  const [helperOpen, setHelperOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setDeferredPrompt(event);
      setInstalled(false);
      setMessage('');
    }

    function handleInstalled() {
      setDeferredPrompt(null);
      setHelperOpen(false);
      setInstalled(true);
      setMessage('Ramani Warehouse is installed.');
    }

    const displayModeQuery = window.matchMedia?.('(display-mode: standalone)');
    function handleDisplayModeChange(event) {
      if (event.matches) handleInstalled();
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    displayModeQuery?.addEventListener?.('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      displayModeQuery?.removeEventListener?.('change', handleDisplayModeChange);
    };
  }, []);

  async function installApp() {
    if (!deferredPrompt) {
      setHelperOpen((open) => !open);
      setMessage('Install Ramani from your browser using the guidance below.');
      return;
    }

    setHelperOpen(false);
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);

    if (choice?.outcome === 'accepted') {
      setInstalled(true);
      setMessage('Ramani Warehouse is installing.');
    } else {
      setMessage('You can download the app any time from the browser install option.');
    }
  }

  if (installed) return null;

  return (
    <div className="pwa-install-wrap">
      <button className={deferredPrompt ? 'pwa-install-button is-ready' : 'pwa-install-button'} type="button" onClick={installApp} aria-label="Download Ramani Warehouse app" aria-expanded={helperOpen}>
        <svg className="install-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 3v10.2" />
          <path d="m7.8 9.4 4.2 4.2 4.2-4.2" />
          <path d="M5.4 15.8v2.4c0 1 .8 1.8 1.8 1.8h9.6c1 0 1.8-.8 1.8-1.8v-2.4" />
        </svg>
        <span className="install-button-text">Download app</span>
      </button>

      {helperOpen ? (
        <div className="install-helper-card" role="status" aria-live="polite">
          <strong>Install Ramani</strong>
          <p>{fallbackInstruction()}</p>
        </div>
      ) : null}

      {message ? <span className="visually-hidden" role="status" aria-live="polite">{message}</span> : null}
    </div>
  );
}
