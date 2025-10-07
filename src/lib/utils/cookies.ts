export function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const raw = parts.pop()!.split(';').shift()!;
    const doc = new DOMParser().parseFromString(raw, 'text/html');
    return doc.documentElement.textContent || '';
  }
  return '';
}
