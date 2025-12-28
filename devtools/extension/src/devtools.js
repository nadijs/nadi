/**
 * DevTools initialization
 */

chrome.devtools.panels.create('Nadi', 'icons/icon48.png', 'panel.html', (panel) => {
  console.log('Nadi DevTools panel created');
});
