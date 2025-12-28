/**
 * Nadi Playground Entry Point
 */

import { signal, computed, effect } from '@nadi/core';

// Counter component logic
const [count, setCount] = signal(0);
const doubled = computed(() => count() * 2);

// Mount component
const root = document.getElementById('counter-root');

if (root) {
  // Create counter UI
  const container = document.createElement('div');
  container.className = 'counter';

  const title = document.createElement('h1');
  title.textContent = 'Counter Example';

  const countDisplay = document.createElement('p');
  const incrementBtn = document.createElement('button');
  incrementBtn.textContent = 'Increment';
  incrementBtn.onclick = () => setCount(count() + 1);

  const decrementBtn = document.createElement('button');
  decrementBtn.textContent = 'Decrement';
  decrementBtn.onclick = () => setCount(count() - 1);

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.onclick = () => setCount(0);

  const doubledDisplay = document.createElement('p');
  doubledDisplay.className = 'doubled';

  // Append elements
  container.appendChild(title);
  container.appendChild(countDisplay);
  container.appendChild(incrementBtn);
  container.appendChild(decrementBtn);
  container.appendChild(resetBtn);
  container.appendChild(doubledDisplay);
  root.appendChild(container);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .counter {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .counter h1 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .counter p {
      font-size: 1.5rem;
      margin: 1rem 0;
      text-align: center;
    }

    .counter .doubled {
      color: #42b883;
      font-weight: bold;
    }

    .counter button {
      background: #42b883;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      margin: 0.5rem 0.25rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-block;
    }

    .counter button:hover {
      background: #359268;
      transform: translateY(-2px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .counter button:active {
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(style);

  // Reactive updates
  effect(() => {
    countDisplay.textContent = `Count: ${count()}`;
  });

  effect(() => {
    doubledDisplay.textContent = `Doubled: ${doubled()}`;
  });
}

// Log to console
console.log('🚀 Nadi Playground Started!');
console.log('📦 Bundle size: ~3.5KB');
console.log('⚡ Fine-grained reactivity enabled');
