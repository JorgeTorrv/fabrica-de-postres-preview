# Contexto — Fábrica de Postres

Este documento explica el **por qué** y el **qué** de este sitio, no el
cómo. No contiene código ni instrucciones técnicas de implementación — eso
vive en el `README.md` del repo. Aquí solo van propósito, decisiones y
razonamiento.

---

## Propósito

Sitio de una sola página para una pastelería/cafetería en Tampico (Lomas de
Rosales). El negocio ya operaba de forma informal por Facebook; el sitio
busca darle presencia formal y, sobre todo, **convertir visitas en pedidos
reales por WhatsApp** — no es una tienda en línea con pagos ni checkout.

Objetivos del negocio que definieron el sitio:
- Mostrar el menú completo (pasteles, cheesecakes, galletas, cafetería,
  panqués, etc.) de forma organizada y fácil de navegar en celular.
- Permitir armar un pedido tipo "carrito" con sabores, tamaños, extras y
  comentarios por producto, sin fricción de una cuenta o pago en línea.
- Enviar el pedido armado como un mensaje de WhatsApp ya redactado al negocio,
  imitando cómo el cliente ya pedía antes (por chat), pero sin que tenga que
  escribirlo a mano.
- Transmitir un tono "elegante" y artesanal, evitando la estética genérica de
  sitios armados con IA (sin iconitos flotando en esquinas de tarjetas, sin
  etiquetas tipo "kicker" sobre cada título, etc. — pedido explícito del
  cliente).

## Decisiones de diseño

- **Carrito sin e-commerce real:** se decidió simular un carrito (agregar,
  quitar, cambiar cantidad, comentarios por producto) pero el "checkout" es
  en realidad la construcción de un mensaje de WhatsApp. Esto respeta cómo el
  negocio ya opera (una persona lee el pedido y responde) sin la complejidad
  ni el costo de una pasarela de pagos.
- **Forma de entrega obligatoria antes de enviar:** se agregó un paso
  explícito de "Recoger en tienda" vs. "A domicilio" porque antes el mensaje
  dejaba esa decisión ambigua o se la preguntaba al cliente en el propio
  texto (raro, ya que es el cliente quien decide). Si elige domicilio, se
  piden calle, colonia y referencias — datos mínimos para que el negocio
  cotice el envío sin ida y vuelta.
- **Mensaje de WhatsApp minimalista:** iteramos varias veces el texto. Se quitó
  el precio (el negocio ya lo conoce, mostrarlo es ruido), se quitó mencionar
  el nombre del negocio (obvio si el pedido viene de su propia web) y se quitó
  el cierre tipo "¿me confirman disponibilidad?" — esas preguntas las hace el
  negocio en la conversación real, no hace falta simularlas en el mensaje
  inicial.
- **Fotos del hero/logo como placeholders con nombre de archivo esperado**
  (`hero-principal.jpg`, etc.) — siguen siendo archivos estáticos del sitio
  público, no editables desde el panel. **Las fotos de productos ya no
  siguen este patrón**: desde el rediseño a menú digital se suben desde el
  panel admin (`ImageUploader` → R2), no por nombre de archivo exacto. Las
  fotos de stock (Unsplash/Openverse) que se usaron temporalmente para
  productos (`public/images/menu/`) se retiraron del repo al hacer ese
  cambio — el placeholder actual para un producto sin foto es el mismo
  patrón visual (`ImageSlot`), solo que ahora se activa por `image` vacío
  en la respuesta de la API en vez de un archivo faltante.
- **Sin secciones "de relleno" tipo IA genérica:** por pedido explícito del
  cliente, se evitaron patrones visuales que delatan un sitio armado
  rápido/genérico (etiquetas pequeñas sobre títulos, iconos en esquinas de
  tarjetas sin propósito). El diseño prioriza tipografía editorial
  (Fraunces + Manrope) y espacio en blanco generoso.
- **Responsive mobile-first real:** el negocio recibe pedidos sobre todo desde
  celular, así que se auditó explícitamente que ninguna sección quedara
  cortada o requiriera scroll horizontal en celular/tablet.
- **Nunca simular datos falsos:** ni precios inventados, ni reseñas
  inventadas, ni calificaciones aproximadas — se dejaron espacios claramente
  vacíos/placeholder antes que rellenar con información no verificada.

## Rediseño: de landing page a menú digital (2026)

El sitio pasó de ser una landing page (historia de marca, galería, reseñas,
con el menú escondido detrás de un botón que abría un overlay) a un menú
digital donde el catálogo es la portada misma. Decisión del cliente: "quiero
transformar la página de una landing page informativa a una plataforma de
menú digital y generación de pedidos por WhatsApp".

- **`MenuOverlay` → `Catalog`, ya no un overlay.** El mismo componente que
  antes se abría sobre la página ahora es una sección normal de la portada,
  con filtro real de categoría (ya no solo scroll a ancla) y sticky bar de
  categorías + carrito.
- **Story/Gallery/Reviews eliminados, no solo ocultados.** El nuevo mapa de
  secciones (Header → Hero compacto → Promociones y destacados → Catálogo →
  Sobre nosotros breve → Contacto → Footer) no los incluye. Se borró el
  código y las fotos de stock asociadas (`public/images/{story,gallery,
  featured}/`), no se dejaron enterrados sin usar.
- **Hero recortado deliberadamente.** Antes ocupaba casi toda la primera
  pantalla con imagen doble superpuesta, redes sociales y horario. Ahora es
  un mensaje corto + una imagen, para no competir por atención con el
  catálogo que viene justo debajo.
- **"Sobre nosotros" en vez de "Historia".** 2-3 líneas al final de la
  página, sin la sección elaborada de antes (estadísticas, doble imagen). El
  catálogo es el protagonista; esto es solo contexto.
- **Backend real por primera vez**, ver `AdminPanel_FabricaPostres/CONTEXTO.md`
  (repo hermano) para el porqué completo de esa arquitectura. En resumen: el
  catálogo ya no vive en `menu.ts` estático, sino en D1, administrado desde
  un panel nuevo, y el sitio público lo consulta en cada visita.
- **Carrito extendido con teléfono y fecha/hora deseada**, campos que el
  cliente pidió explícitamente ("nombre, teléfono, tipo de entrega... fecha,
  hora"). El teléfono es obligatorio (el negocio necesita poder contactar de
  vuelta); fecha/hora son opcionales.
- **`POST /api/orders` es fire-and-forget.** El pedido real sigue siendo el
  mensaje de WhatsApp — este registro solo alimenta el panel para que la
  clienta tenga un historial. Si la API falla, el flujo de WhatsApp no se ve
  afectado.

## Stack

- **React 19 + Vite + TypeScript** — SPA, sin SSR.
- **Tailwind CSS v4** — estilos utilitarios, config basada en CSS.
- **lucide-react** — iconografía.
- **Backend propio** (repo hermano `AdminPanel_FabricaPostres`): Hono + D1 +
  R2 vía Cloudflare Pages Functions. El catálogo se consulta en runtime
  (`useCatalog`, tres capas de respaldo: localStorage → fetch en vivo →
  JSON empacado en el build) — no hay SSR ni build-time data fetching real,
  solo un fallback generado antes de cada build por si la API falla justo en
  ese momento.
- El "estado" del carrito sigue viviendo en el navegador
  (memoria/localStorage); el pedido final sigue siendo un enlace `wa.me`
  con el mensaje ya armado, más un registro paralelo en la API.

## Despliegue

- Sitio gratuito, sin dominio propio todavía. Se despliega en **dos hosts en
  paralelo**, ambos disparados automáticamente por GitHub Actions en cada
  push a `main`:
  - **GitHub Pages** — canal original.
  - **Cloudflare Pages** — agregado después como segunda opción, ya en la red
    edge de Cloudflare por defecto (no requiere configuración de DNS/proxy
    adicional).
- Se resolvió un problema real de GitHub Pages: cachea `index.html` 10
  minutos y no permite configurar ese comportamiento desde el repo. Si
  alguien cargaba una copia vieja justo después de un despliegue nuevo, podía
  terminar pidiendo archivos JS/CSS que ya no existían (nombres cambian por
  build) y ver una página en blanco hasta refrescar a mano. Se agregó una
  recuperación automática: si eso pasa, el sitio se recarga solo una vez, sin
  que el visitante tenga que notar nada.
- Se mantienen ambos hosts corriendo en paralelo (en vez de reemplazar uno
  por otro) para tener redundancia y una forma de trabajo ya lista y estable
  de cara a una eventual venta: cuando el cliente compre un dominio, solo
  hace falta agregarlo en el proyecto de Cloudflare Pages — el flujo de
  despliegue automático no cambia.
