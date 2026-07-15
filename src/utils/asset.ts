/**
 * Prefixes a root-absolute public path (e.g. "/images/x.jpg") with Vite's
 * BASE_URL so it resolves correctly when the site is served from a subpath
 * (GitHub Pages project sites). Leaves external URLs and empty strings alone.
 */
export function asset(path: string): string {
  if (!path || !path.startsWith('/')) return path
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path
}
