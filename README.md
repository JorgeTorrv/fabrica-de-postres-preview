# Fábrica de Postres — sitio web

Sitio de una sola página para Fábrica de Postres (Tampico). React + Vite + TypeScript + Tailwind CSS v4.

## Correr el proyecto

```bash
npm install
npm run dev       # servidor local
npm run build     # build de producción en /dist
npm run preview   # revisar el build de producción
```

## Estructura

```
src/
  components/   secciones y piezas de UI (Header, Hero, Gallery, ProductModal, CartDrawer...)
  context/      CartContext (carrito global, persistido en localStorage)
  data/         menu.ts (todo el menú), business.ts (datos del negocio), types.ts
  utils/        formato de moneda y armado del mensaje de WhatsApp
public/
  images/       todas las fotos reales del negocio van aquí (ver guía abajo)
```

## Cómo agregar las fotos reales

Todo el sitio ya está listo para las fotos: mientras no exista el archivo, se muestra un
recuadro con el nombre esperado, así siempre es obvio dónde va cada imagen. En cuanto
guardes la foto **con ese nombre exacto** en la carpeta indicada, aparece sola — no hay que
tocar código.

Formatos aceptados: `.jpg` (o cambia la extensión en el archivo de datos correspondiente si
usas `.png`/`.webp`). Recomendado: fotos horizontales de buena luz, sin marcas de agua.

### `public/images/logo/`
- `logo.png` — logotipo circular o cuadrado, fondo transparente. Mientras no exista, se
  muestra un monograma "FP" en el header y el footer.

### `public/images/hero/`
- `hero-principal.jpg` — foto ancha de una mesa de postres, la imagen grande de portada.
- `hero-detalle.jpg` — foto cuadrada de detalle (un postre solo), la que se sobrepone.

### `public/images/story/`
- `story-taller.jpg` — foto vertical del taller/equipo trabajando.
- `story-detalle.jpg` — foto cuadrada de detalle artesanal.

### `public/images/featured/` (sección "Nuestros postres más amados")
- `featured-biscoff.jpg`
- `featured-pistache.jpg`
- `featured-galletas.jpg`

### `public/images/gallery/carousel/` (carrusel de momentos, en la home)
- `momento-1.jpg` … `momento-6.jpg` — fotos de eventos, entregas, celebraciones.

### `public/images/gallery/grid/` (galería completa con lightbox)
- `galeria-1.jpg` … `galeria-10.jpg` — tantas fotos de trabajos como quieras mostrar. Si
  necesitas más, agrega otro número y sube el conteo en
  `src/components/Gallery.tsx` (`GRID_IMAGES`).

### `public/images/menu/` (una foto por producto del menú)

El nombre de archivo de cada producto ya está definido en `src/data/menu.ts` (campo
`image`). Lista completa esperada:

```
affogato.jpg              matcha-mango.jpg
americano.jpg              mini-tarta.jpg
brownie.jpg                 mostachon.jpg
capuchino.jpg               panque-clasico.jpg
cheesecake-biscoff.jpg      panque-higos.jpg
cheesecake-clasico.jpg      panque-personalizado.jpg
cortado.jpg                 pastel-clasico.jpg
espresso.jpg                pastel-especial.jpg
flat-white.jpg              pastel-personalizado.jpg
frappe-arroz-leche.jpg      smoothie-fresa.jpg
frappe-brownie.jpg          smoothie-frutos-rojos.jpg
frappe-chocoavellana.jpg    smoothie-limon-chamoy.jpg
frappe-cookies-cream.jpg    smoothie-limon.jpg
frappe-lotus.jpg            smoothie-mango-chamoy.jpg
frappe-red-velvet.jpg       smoothie-mango.jpg
frappuccino.jpg             smoothie-pay-limon.jpg
galleta-nueva-york.jpg      smoothie-pina-colada.jpg
granel.jpg                  te.jpg
latte.jpg                   tiramisu.jpg
matcha-banana.jpg           tres-leches-domo.jpg
matcha-fresa.jpg            tres-leches-vaso.jpg
matcha.jpg
```

Si agregas un producto nuevo en `src/data/menu.ts`, dale un `image` con el nombre que
quieras y guarda la foto con ese mismo nombre en esta carpeta.

## El menú y el carrito

- Todo el contenido del menú (sabores, tamaños, precios, extras) vive en
  `src/data/menu.ts` — para cambiar un precio o agregar un sabor, se edita ahí.
- El pedido se arma en el carrito (`CartDrawer`) y se envía como un mensaje de WhatsApp
  redactado automáticamente al número del negocio (`src/data/business.ts`, campo
  `whatsapp`). No hay checkout de e-commerce ni cobro en línea.
- Los productos de "Pasteles personalizados" no tienen precio fijo: se agregan al
  carrito marcados como cotización y el mensaje de WhatsApp lo aclara.

## Datos del negocio

Dirección, teléfono, horario, número de WhatsApp y enlaces (Facebook, Google Maps) están
centralizados en `src/data/business.ts`.
