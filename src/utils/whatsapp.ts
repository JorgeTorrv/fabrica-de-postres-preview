import { BUSINESS } from '../data/business'
import type { CartItem } from '../data/cart-types'

export type DeliveryMethod = 'pickup' | 'delivery'

export const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  pickup: 'Recoger en tienda',
  delivery: 'A domicilio (costo extra según ubicación)',
}

export type DeliveryAddress = {
  street: string
  neighborhood: string
  references: string
}

function lineForItem(item: CartItem, index: number): string {
  const parts: string[] = []
  const title = item.flavor ? `${item.name} (${item.flavor})` : item.name
  parts.push(`${index + 1}. *${title}*`)
  parts.push(`   ${item.optionLabel} · x${item.quantity}`)

  if (item.extras.length > 0) {
    parts.push(`   Extras: ${item.extras.map((extra) => extra.label).join(', ')}`)
  }
  if (item.customQuote) {
    parts.push('   Personalizado (a cotizar)')
  }
  if (item.comment?.trim()) {
    parts.push(`   Nota: ${item.comment.trim()}`)
  }

  return parts.join('\n')
}

export function buildOrderMessage(
  items: CartItem[],
  customerName: string,
  generalNote: string,
  deliveryMethod: DeliveryMethod,
  address: DeliveryAddress,
): string {
  const greeting = customerName.trim()
    ? `Hola, quisiera hacer un pedido a nombre de ${customerName.trim()}:`
    : 'Hola, quisiera hacer un pedido:'

  const lines = items.map((item, index) => lineForItem(item, index))

  const tail = [`Entrega: ${DELIVERY_LABELS[deliveryMethod]}`]

  if (deliveryMethod === 'delivery') {
    if (address.street.trim()) tail.push(`Dirección: ${address.street.trim()}`)
    if (address.neighborhood.trim()) tail.push(`Colonia: ${address.neighborhood.trim()}`)
    if (address.references.trim()) tail.push(`Referencias: ${address.references.trim()}`)
  }

  if (generalNote.trim()) tail.push(`Nota: ${generalNote.trim()}`)

  return [greeting, '', lines.join('\n\n'), '', tail.join('\n')].join('\n')
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`
}
