/**
 * Background service worker for Nadi DevTools
 */

const connections = new Map();

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'devtools-panel') {
    const tabId = port.sender.tab?.id;
    if (tabId) {
      connections.set(tabId, port);

      port.onDisconnect.addListener(() => {
        connections.delete(tabId);
      });

      port.onMessage.addListener((message) => {
        handleDevToolsMessage(tabId, message);
      });
    }
  }
});

function handleDevToolsMessage(tabId, message) {
  switch (message.type) {
    case 'getComponentTree':
      // Request component tree from content script
      chrome.tabs.sendMessage(tabId, { type: 'GET_COMPONENT_TREE' });
      break;
    case 'inspectComponent':
      chrome.tabs.sendMessage(tabId, {
        type: 'INSPECT_COMPONENT',
        componentId: message.componentId,
      });
      break;
    case 'updateSignal':
      chrome.tabs.sendMessage(tabId, {
        type: 'UPDATE_SIGNAL',
        signalId: message.signalId,
        value: message.value,
      });
      break;
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'NADI_DETECTED') {
    console.log('Nadi application detected, version:', message.version);
  }
});
