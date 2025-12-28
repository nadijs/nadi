import { signal } from '@nadi/core';

function App() {
  const count = signal(0);

  return (
    <div class="app">
      <h1>Nadi App</h1>
      <div class="card">
        <button onclick={() => count.set(count() + 1)}>count is {count()}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">Click on the Nadi logo to learn more</p>
    </div>
  );
}

export default App;
