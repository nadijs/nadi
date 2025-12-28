/**
 * Main panel logic for Nadi DevTools
 */

let selectedComponent = null;

// Connect to background script
const port = chrome.runtime.connect({ name: 'devtools-panel' });

port.onMessage.addListener((message) => {
  switch (message.type) {
    case 'componentTree':
      renderComponentTree(message.data);
      break;
    case 'componentState':
      renderComponentState(message.data);
      break;
    case 'signalUpdate':
      handleSignalUpdate(message.data);
      break;
  }
});

// Request initial data
port.postMessage({ type: 'getComponentTree' });

// Render component tree
function renderComponentTree(tree) {
  const container = document.getElementById('componentTree');

  if (!tree || tree.length === 0) {
    container.innerHTML = '<div class="empty-state">No components found</div>';
    return;
  }

  container.innerHTML = tree.map(renderNode).join('');
  attachTreeListeners();
}

function renderNode(node, depth = 0) {
  const indent = depth * 15;
  const hasChildren = node.children && node.children.length > 0;

  return `
    <div class="component-node" data-id="${node.id}" style="padding-left: ${indent}px">
      <span class="component-name">&lt;${node.name}&gt;</span>
      ${node.props ? `<span class="component-props">${Object.keys(node.props).join(', ')}</span>` : ''}
    </div>
    ${hasChildren ? node.children.map((child) => renderNode(child, depth + 1)).join('') : ''}
  `;
}

function attachTreeListeners() {
  document.querySelectorAll('.component-node').forEach((node) => {
    node.addEventListener('click', () => {
      document.querySelectorAll('.component-node').forEach((n) => n.classList.remove('selected'));
      node.classList.add('selected');
      const componentId = node.dataset.id;
      selectedComponent = componentId;
      port.postMessage({ type: 'inspectComponent', componentId });
    });
  });
}

// Render component state
function renderComponentState(data) {
  const container = document.getElementById('stateInspector');

  if (!data || (!data.signals && !data.computed && !data.effects)) {
    container.innerHTML = '<div class="empty-state">No state to display</div>';
    return;
  }

  let html = '';

  if (data.signals && data.signals.length > 0) {
    html += `
      <div class="state-section">
        <div class="state-title">Signals (${data.signals.length})</div>
        ${data.signals
          .map(
            (signal) => `
          <div class="state-item">
            <div>
              <span class="state-key">${signal.name || 'anonymous'}</span>
              <span class="state-value">${JSON.stringify(signal.value)}</span>
            </div>
            <button class="state-edit-btn" data-signal-id="${signal.id}">Edit</button>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  if (data.computed && data.computed.length > 0) {
    html += `
      <div class="state-section">
        <div class="state-title">Computed (${data.computed.length})</div>
        ${data.computed
          .map(
            (comp) => `
          <div class="state-item">
            <div>
              <span class="state-key">${comp.name || 'anonymous'}</span>
              <span class="state-value">${JSON.stringify(comp.value)}</span>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  if (data.effects && data.effects.length > 0) {
    html += `
      <div class="state-section">
        <div class="state-title">Effects (${data.effects.length})</div>
        ${data.effects
          .map(
            (effect) => `
          <div class="state-item">
            <span class="state-key">${effect.name || 'anonymous'}</span>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  container.innerHTML = html;
  attachStateListeners();
}

function attachStateListeners() {
  document.querySelectorAll('.state-edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const signalId = btn.dataset.signalId;
      const newValue = prompt('Enter new value (JSON):');
      if (newValue !== null) {
        try {
          const parsed = JSON.parse(newValue);
          port.postMessage({
            type: 'updateSignal',
            signalId,
            value: parsed,
          });
        } catch (e) {
          alert('Invalid JSON: ' + e.message);
        }
      }
    });
  });
}

function handleSignalUpdate() {
  // Refresh state if the up_dated signal belongs to selected component
  if (selectedComponent) {
    port.postMessage({ type: 'inspectComponent', componentId: selectedComponent });
  }
}

// Toolbar actions
document.getElementById('refreshBtn').addEventListener('click', () => {
  port.postMessage({ type: 'getComponentTree' });
});

document.getElementById('clearBtn').addEventListener('click', () => {
  console.clear();
});
