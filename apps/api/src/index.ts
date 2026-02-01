import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

app.get('/', (c) => {
  return c.json({ name: 'FlakyTest API', version: '0.1.0', status: 'ok' });
});

app.get('/api/v1/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Test results ingestion
app.post('/api/v1/results', async (c) => {
  // TODO: Implement test result ingestion
  return c.json({ message: 'Results received' }, 202);
});

// Quarantine list
app.get('/api/v1/quarantine', (c) => {
  // TODO: Return quarantine rules for project
  return c.json({ rules: [] });
});

const port = Number(process.env.PORT) || 3001;
console.log(`FlakyTest API running on port ${port}`);

serve({ fetch: app.fetch, port });
