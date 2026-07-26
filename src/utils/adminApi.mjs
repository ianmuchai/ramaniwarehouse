export async function parseAdminResponse(response, fallbackMessage = 'Request failed.') {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || fallbackMessage);
    return data;
  }

  const text = await response.text();
  const returnedHtml = /^\s*<!doctype html|^\s*<html/i.test(text);
  const statusText = [response.status, response.statusText].filter(Boolean).join(' ');

  if (returnedHtml) {
    throw new Error(`${fallbackMessage} Server returned HTML instead of JSON. Check the API route and server logs for the underlying error.`);
  }

  throw new Error(`${fallbackMessage} Server returned ${statusText || 'a non-JSON response'}.`);
}
