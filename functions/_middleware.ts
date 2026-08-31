/**
 * Cloudflare no permite apagar el subdominio *.pages.dev de un proyecto
 * Pages — sigue existiendo aunque haya un dominio propio conectado. Esto
 * redirige cualquier visita por ahí al dominio real, para que el único
 * link "vivo" de cara al público sea fabricadepostres.com.
 */
const CANONICAL_HOST = 'fabricadepostres.com'

export const onRequest = async (context: { request: Request; next: () => Promise<Response> }) => {
  const url = new URL(context.request.url)

  if (url.hostname.endsWith('.pages.dev')) {
    url.hostname = CANONICAL_HOST
    url.protocol = 'https:'
    return Response.redirect(url.toString(), 301)
  }

  return context.next()
}
