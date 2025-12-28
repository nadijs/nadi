/**
 * Content script to detect Nadi applications
 */

// Inject detection script into page
const script = document.createElement('script');
script.textContent = `
  (function() {
    if (window.__NADI_DEVTOOLS__) {
      window.postMessage({
        type: 'NADI_DETECTED',
        version: window.__NADI_DEVTOOLS__.version || 'unknown'
      }, '*');
    }
  })();
`;
(document.head || document.documentElement).appendChild(script);
script.remove();

// Listen for Nadi detection
window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data.type === 'NADI_DETECTED') {
    chrome.runtime.sendMessage({
      type: 'NADI_DETECTED',
      version: event.data.version,
    });
  }
});
