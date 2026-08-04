/**
 * URL base de la API (vive en el mismo proyecto Cloudflare Pages que el
 * panel admin, ver AdminPanel_FabricaPostres). Se puede sobreescribir con
 * VITE_API_URL para desarrollo local contra `wrangler pages dev`.
 */
export const API_URL: string = import.meta.env.VITE_API_URL || 'https://fabrica-postres-admin.pages.dev'
