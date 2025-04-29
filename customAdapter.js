import fetch from 'node-fetch'; // Import node-fetch (v2) for compatibility
import AbortController from 'abort-controller'; // For AbortController in Node.js

export const nodeAdapter = {
  fetch: fetch,
  AbortController: AbortController,
  runtimeString: 'Node.js',
};