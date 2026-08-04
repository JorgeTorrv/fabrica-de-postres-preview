import { API_URL } from './config'
import type { OrderDetails } from '../utils/whatsapp'

/**
 * Registra el pedido en el panel admin, en paralelo a abrir WhatsApp.
 * Fire-and-forget a propósito: si la API falla o tarda, el pedido de todos
 * modos se envía por WhatsApp — este registro es solo para que la clienta
 * lo vea en el panel, nunca debe bloquear ni retrasar el flujo principal.
 */
export function registerOrder(order: OrderDetails, whatsappMessage: string, subtotal: number): void {
  const hasQuoteItems = order.items.some((item) => item.customQuote)

  const payload = {
    customerName: order.customerName.trim() || 'Sin nombre',
    customerPhone: order.customerPhone.trim(),
    deliveryMethod: order.deliveryMethod,
    addressStreet: order.deliveryMethod === 'delivery' ? order.address.street.trim() || undefined : undefined,
    addressNeighborhood: order.deliveryMethod === 'delivery' ? order.address.neighborhood.trim() || undefined : undefined,
    addressReferences: order.deliveryMethod === 'delivery' ? order.address.references.trim() || undefined : undefined,
    requestedDate: order.requestedDate || undefined,
    requestedTime: order.requestedTime || undefined,
    generalNote: order.generalNote.trim() || undefined,
    subtotal,
    hasQuoteItems,
    whatsappMessage,
    items: order.items.map((item) => ({
      productName: item.name,
      flavor: item.flavor,
      optionLabel: item.optionLabel,
      optionPrice: item.optionPrice,
      extras: item.extras,
      quantity: item.quantity,
      comment: item.comment,
      customQuote: item.customQuote,
    })),
  }

  fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {
    // Silencioso a propósito — ver comentario arriba.
  })
}
