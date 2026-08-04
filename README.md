# Fábrica de Postres — sitio web (menú digital)

Menú digital y generador de pedidos por WhatsApp para Fábrica de Postres
(Tampico). React + Vite + TypeScript + Tailwind CSS v4.

El catálogo (categorías, productos, precios, promociones) **ya no vive en
este repo**: se administra desde el panel admin del repo hermano
`AdminPanel_FabricaPostres` y este sitio lo consulta en cada visita. Ver
`CONTEXTO.md` para el porqué del rediseño.

## Correr el proyecto

Necesita el backend corriendo aparte (repo hermano `AdminPanel_FabricaPostres`)
para tener datos reales; sin él, el sitio sigue funcionando con el catálogo
de respaldo empacado en el build (`src/data/catalog-fallback.json`).

```bash
npm install
npm run dev       # servidor local — usa VITE_API_URL de .env.development
npm run build     # build de producción en /dist (actualiza el catálogo de respaldo primero)
npm run preview   # revisar el build de producción
```

Para desarrollo con datos en vivo, levanta primero el backend
(`AdminPanel_FabricaPostres/README.md`, sección "Desarrollo local") y luego
este proyecto — `.env.development` ya apunta a `http://localhost:8788`.

## Estructura

```
src/
  components/
    Catalog.tsx        catálogo completo (antes MenuOverlay), sección principal de la portada
    ProductModal.tsx   modal de producto: sabores, opciones, extras, comentario, cantidad
    CartDrawer.tsx     carrito + datos de entrega + envío por WhatsApp
    PromotionsStrip.tsx  promociones y productos destacados (datos reales de la API)
    Hero.tsx           hero compacto
    AboutSection.tsx   "Sobre nosotros" breve, al final
    Contact.tsx        dirección, teléfono, horario, mapa
    Header.tsx / Footer.tsx
  hooks/
    useCatalog.ts      catálogo en vivo con 3 capas de respaldo (ver abajo)
  context/
    CartContext.tsx    carrito global, persistido en localStorage
  data/
    types.ts             tipos del catálogo (MenuItem, MenuCategory, Promotion)
    catalog-fallback.json  respaldo generado antes de cada build (no editar a mano)
    business.ts           dirección, teléfono, horario, redes — esto sí se edita aquí
  lib/
    config.ts          URL base de la API
    orders.ts           registra el pedido en la API (fire-and-forget) antes de abrir WhatsApp
  utils/
    whatsapp.ts         arma el mensaje y el link de WhatsApp
    format.ts            formato de moneda
scripts/
  fetch-catalog.mjs    corre antes de `vite build`, actualiza catalog-fallback.json
public/
  images/{logo,hero}/  únicas fotos que siguen siendo archivos estáticos de este repo
```

## De dónde sale el catálogo: `useCatalog`

Tres capas, para que el sitio nunca se quede en blanco ni se sienta lento:

1. **`localStorage`** — si ya visitaste el sitio, se pinta al instante
   mientras se revalida en segundo plano.
2. **Fetch a la API en vivo** (`VITE_API_URL`, timeout ~3s) — actualiza
   estado y caché.
3. **`src/data/catalog-fallback.json`** — generado por
   `scripts/fetch-catalog.mjs` antes de cada build. Último recurso si es la
   primera visita (sin caché) y la API no responde a tiempo.

Para actualizar productos, precios, sabores, categorías o promociones: eso
se hace desde el panel admin, **no editando este repo**. Este repo solo
cambia si se rediseña la portada o el flujo del carrito.

## Cómo agregar las fotos reales

- **Logo y hero** (`public/images/logo/`, `public/images/hero/`): siguen el
  patrón de siempre — mientras no exista el archivo, se muestra un
  placeholder con el nombre esperado; en cuanto guardas la foto con ese
  nombre exacto, aparece sola.
  - `logo/logo.png`
  - `hero/hero-principal.jpg` — foto ancha de una mesa de postres.
- **Fotos de productos y promociones**: se suben desde el panel admin
  (botón "Subir foto" en cada producto/promoción), no en este repo. Ver
  `AdminPanel_FabricaPostres/README.md`.

## El carrito y el pedido por WhatsApp

- El pedido se arma en el carrito (`CartDrawer`) y se envía como un mensaje
  de WhatsApp redactado automáticamente al número del negocio
  (`src/data/business.ts`, campo `whatsapp`). No hay checkout de e-commerce
  ni cobro en línea.
- Antes de enviar se piden: nombre, **teléfono (obligatorio)**, forma de
  entrega, dirección si es a domicilio, y opcionalmente fecha/hora deseada.
- Al enviar, el pedido también se registra en la API (`POST /api/orders`,
  fire-and-forget) para que aparezca en el panel admin — si eso falla, el
  mensaje de WhatsApp se abre de todos modos.
- Los productos marcados como cotización personalizada (`customQuote`) no
  tienen precio fijo: se agregan al carrito como "a cotizar" y el mensaje de
  WhatsApp lo aclara.

## Datos del negocio

Dirección, teléfono, horario, número de WhatsApp y enlaces (Facebook,
Instagram, Google Maps) están centralizados en `src/data/business.ts` — eso
sí sigue viviendo en este repo, no en la base de datos.

## Despliegue

Sin cambios respecto a como ya operaba: GitHub Pages + Cloudflare Pages en
paralelo, vía GitHub Actions en cada push a `main` (ver
`.github/workflows/`). La única adición es la variable `VITE_API_URL` en el
paso de build de esos workflows, apuntando al dominio del panel admin en
producción.
