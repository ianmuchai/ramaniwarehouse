const backendOrigin = import.meta.env.VITE_API_ORIGIN || '';

export function assetUrl(value) {
  if (!value) return '';
  const url = String(value).trim();
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  if (url.startsWith('/images/')) return `${backendOrigin}${url}`;
  return url;
}
