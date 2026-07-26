import app from '../api/index.js';

const server = app.listen(0);
const { port } = server.address();

try {
  const form = new FormData();
  form.append('image', new Blob(['not an image'], { type: 'text/plain' }), 'poster.txt');

  const response = await fetch(`http://127.0.0.1:${port}/api/admin/hero-slides/contractor-marketplace/image`, {
    method: 'POST',
    headers: { 'x-admin-key': 'ramani-admin' },
    body: form
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON upload errors, got: ${contentType}`);
  }

  const data = await response.json();
  if (!data.message) throw new Error('Expected upload error response to include a message.');

  console.log('Upload error JSON check passed.');
} finally {
  server.close();
}
