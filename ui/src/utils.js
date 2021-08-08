
export function getRandomString(len) {
  const bytes = new Uint8Array(len);
  window.crypto.getRandomValues(bytes);
  let base64str = window.btoa(String.fromCharCode(...bytes));
  return base64str;
}

export async function generateCodeChallenge(codeVerifier) {
  var digest = await window.crypto.subtle.digest("SHA-256",
    new TextEncoder().encode(codeVerifier));
  return window.btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export function buildUrl(path, params) {
  const query = Object.entries(params)
    .map(([k, v]) => (k + '=' + v))
    .join('&');
  const url = path + '?' + query;
  return url
}

export function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => ('%' + c.charCodeAt(0).toString(16))
  );
}
