import { parseAdminResponse } from '../src/utils/adminApi.mjs';

async function expectHtmlErrorMessage() {
  const response = new Response('<!DOCTYPE html><title>Server Error</title>', {
    status: 500,
    statusText: 'Internal Server Error',
    headers: { 'content-type': 'text/html; charset=utf-8' }
  });

  try {
    await parseAdminResponse(response, 'Upload failed.');
  } catch (error) {
    if (!String(error.message).includes('Upload failed. Server returned HTML instead of JSON.')) {
      throw new Error(`Expected a useful HTML error message, got: ${error.message}`);
    }
    return;
  }

  throw new Error('Expected parseAdminResponse to reject HTML API responses.');
}

await expectHtmlErrorMessage();
console.log('Admin API response handling check passed.');

