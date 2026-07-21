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
- **Fotos como placeholders con nombre de archivo esperado:** como no había
  fotografía profesional lista al momento de construir el sitio, cada slot de
  imagen muestra el nombre de archivo que espera (`hero-principal.jpg`,
  `story-taller.jpg`, etc.). En cuanto se coloca el archivo real con ese
  nombre exacto, aparece solo — no requiere tocar código. Mientras tanto, se
  usaron fotos de stock (Unsplash/Openverse) temporales solo para que el
  cliente vea el sitio con contenido visual real y no cajas vacías.
- **Galería como carrusel automático + grid con lightbox:** el negocio tiene
  muchas fotos de trabajos anteriores en Facebook. Se decidió combinar un
  carrusel destacado (loop infinito, gira solo, sin que el usuario tenga que
  interactuar) para momentos destacados, y una cuadrícula ampliable con
  lightbox para navegar más fotos a detalle — cubre tanto "vitrina rápida"
  como "explorar a fondo".
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

## Stack

- **React 19 + Vite + TypeScript** — sitio estático de una sola página, sin
  necesidad de backend ni SSR; Vite da un build rápido y ligero para un sitio
  de este tamaño.
- **Tailwind CSS v4** — estilos utilitarios, config basada en CSS.
- **lucide-react** — iconografía.
- Sin base de datos, sin backend, sin autenticación: el "estado" del pedido
  vive en el navegador (carrito en memoria/localStorage) y el único destino
  final del pedido es un enlace `wa.me` con el mensaje ya armado.

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
