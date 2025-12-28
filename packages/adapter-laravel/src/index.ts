/**
 * Laravel SSR server for Nadi
 */

import express from 'express';
import { renderToString, renderToHtml } from '@nadi/core';

const app = express();
app.use(express.json());

const PORT = process.env.NADI_SSR_PORT || 13714;

// Import components dynamically
const components = new Map<string, any>();

app.post('/render', async (req, res) => {
  try {
    const { component, props } = req.body;

    if (!component) {
      return res.status(400).json({ error: 'Component name required' });
    }

    // Load component (in production, this would be pre-built)
    const Component = components.get(component);

    if (!Component) {
      return res.status(404).json({ error: `Component ${component} not found` });
    }

    const html = renderToString(() => <Component {...props} />);

    res.json({
      html,
      head: '', // Meta tags would be collected here
    });
  } catch (error: any) {
    console.error('SSR Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Nadi SSR server listening on http://localhost:${PORT}`);
});
