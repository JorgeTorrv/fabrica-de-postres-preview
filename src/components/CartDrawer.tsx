import { useState } from 'react'
import { Minus, Plus, ShoppingBag, Store, Trash2, Truck, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'
import { buildOrderMessage, buildWhatsAppUrl, type DeliveryMethod } from '../utils/whatsapp'
import { registerOrder } from '../lib/orders'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { ImageSlot } from './ImageSlot'
import { DatePicker } from './DatePicker'
import { TimePicker } from './TimePicker'

const EMPTY_ADDRESS = { street: '', neighborhood: '', references: '' }
const PHONE_DIGITS_MIN = 10

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string; hint: string; icon: typeof Store }[] = [
  { value: 'pickup', label: 'Recoger en tienda', hint: 'Lomas de Rosales, Tampico', icon: Store },
  { value: 'delivery', label: 'A domicilio', hint: 'Costo extra según ubicación', icon: Truck },
]

export function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, updateComment, subtotal, hasQuoteItems, clearCart } =
    useCart()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [generalNote, setGeneralNote] = useState('')
  const [delivery, setDelivery] = useState<DeliveryMethod | null>(null)
  const [address, setAddress] = useState(EMPTY_ADDRESS)
  const [requestedDate, setRequestedDate] = useState('')
  const [requestedTime, setRequestedTime] = useState('')
  const [showValidation, setShowValidation] = useState(false)

  useBodyScrollLock(isCartOpen)

  if (!isCartOpen) return null

  const needsAddress = delivery === 'delivery'
  const addressComplete = address.street.trim() !== '' && address.neighborhood.trim() !== ''
  const phoneDigits = phone.replace(/\D/g, '')
  const phoneComplete = phoneDigits.length >= PHONE_DIGITS_MIN
  const canSend = delivery !== null && phoneComplete && (!needsAddress || addressComplete)

  const handleSend = () => {
    if (!delivery) return
    if (!canSend) {
      setShowValidation(true)
      return
    }

    const order = {
      items,
      customerName: name,
      customerPhone: phone,
      generalNote,
      deliveryMethod: delivery,
      address,
      requestedDate,
      requestedTime,
    }
    const message = buildOrderMessage(order)

    registerOrder(order, message, subtotal)
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener')
  }

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-(--color-ink)/60" onClick={closeCart}>
      <div
        className="flex h-full w-full max-w-md flex-col bg-(--color-paper) shadow-(--shadow-lift)"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-(--color-line) px-6 py-5">
          <h2 className="font-display text-2xl text-(--color-ink)">Tu pedido</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 items-center justify-center rounded-full text-(--color-ink) hover:bg-(--color-cream-dim)"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-(--color-ink-soft)" strokeWidth={1} />
            <p className="text-(--color-ink-soft)">Aún no agregas nada. Explora el menú y arma tu pedido.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="flex flex-col gap-5">
                {items.map((item) => (
                  <div key={item.cartId} className="flex gap-3 border-b border-(--color-line) pb-5 last:border-b-0">
                    <ImageSlot
                      src={item.image ?? ''}
                      alt={item.name}
                      placeholderLabel={item.name}
                      className="h-16 w-16 flex-none rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-base leading-tight text-(--color-ink)">
                            {item.name}
                            {item.flavor ? ` · ${item.flavor}` : ''}
                          </p>
                          <p className="mt-0.5 text-xs text-(--color-ink-soft)">{item.optionLabel}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.cartId)}
                          aria-label="Quitar del carrito"
                          className="flex-none text-(--color-ink-soft) hover:text-(--color-wine-deep)"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>

                      {item.extras.length > 0 && (
                        <p className="mt-1 text-xs text-(--color-ink-soft)">
                          {item.extras.map((e) => e.label).join(', ')}
                        </p>
                      )}

                      <textarea
                        value={item.comment ?? ''}
                        onChange={(e) => updateComment(item.cartId, e.target.value)}
                        placeholder="Añadir comentario..."
                        rows={1}
                        className="mt-2 w-full resize-none rounded-lg border border-(--color-line) bg-(--color-paper) px-3 py-1.5 text-xs text-(--color-ink) placeholder:text-(--color-ink-soft)/70 focus:border-(--color-wine) focus:outline-none"
                      />

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-full border border-(--color-line) px-2.5 py-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            aria-label="Reducir cantidad"
                            className="flex h-5 w-5 items-center justify-center text-(--color-ink)"
                          >
                            <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                          <span className="w-3 text-center text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            aria-label="Aumentar cantidad"
                            className="flex h-5 w-5 items-center justify-center text-(--color-ink)"
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-(--color-ink)">
                          {item.customQuote
                            ? 'A cotizar'
                            : formatCurrency((item.optionPrice + item.extras.reduce((s, e) => s + e.price, 0)) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="mt-2 text-xs text-(--color-ink-soft) underline decoration-(--color-line) underline-offset-4 hover:text-(--color-wine-deep)"
              >
                Vaciar carrito
              </button>
            </div>

            <div className="border-t border-(--color-line) px-6 py-5">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full rounded-lg border border-(--color-line) bg-(--color-paper) px-3.5 py-2.5 text-sm text-(--color-ink) placeholder:text-(--color-ink-soft)/70 focus:border-(--color-wine) focus:outline-none"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Tu teléfono *"
                  className="w-full rounded-lg border border-(--color-line) bg-(--color-paper) px-3.5 py-2.5 text-sm text-(--color-ink) placeholder:text-(--color-ink-soft)/70 focus:border-(--color-wine) focus:outline-none"
                />
              </div>
              {showValidation && !phoneComplete && (
                <p className="mt-1.5 text-xs text-(--color-wine-deep)">Escribe un teléfono válido (10 dígitos).</p>
              )}

              <div className="mt-3 grid grid-cols-2 gap-3">
                <DatePicker
                  value={requestedDate}
                  onChange={setRequestedDate}
                  placeholder="Fecha"
                  ariaLabel="Fecha deseada (opcional)"
                />
                <TimePicker
                  value={requestedTime}
                  onChange={setRequestedTime}
                  placeholder="Hora"
                  ariaLabel="Hora deseada (opcional)"
                />
              </div>

              <textarea
                value={generalNote}
                onChange={(e) => setGeneralNote(e.target.value)}
                placeholder="Nota general (evento, dedicatoria, etc.)"
                rows={2}
                className="mt-3 w-full resize-none rounded-lg border border-(--color-line) bg-(--color-paper) px-3.5 py-2.5 text-sm text-(--color-ink) placeholder:text-(--color-ink-soft)/70 focus:border-(--color-wine) focus:outline-none"
              />

              <fieldset className="mt-5">
                <legend className="text-sm font-medium text-(--color-ink)">Forma de entrega</legend>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                  {DELIVERY_OPTIONS.map(({ value, label, hint, icon: Icon }) => {
                    const active = delivery === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDelivery(value)}
                        aria-pressed={active}
                        className={`flex flex-col gap-1.5 rounded-xl border p-3 text-left transition-colors ${
                          active
                            ? 'border-(--color-wine) bg-(--color-cream-dim)'
                            : 'border-(--color-line) hover:border-(--color-wine)'
                        }`}
                      >
                        <Icon className="h-5 w-5 text-(--color-wine-deep)" strokeWidth={1.5} />
                        <span className="text-sm font-medium text-(--color-ink)">{label}</span>
                        <span className="text-xs leading-tight text-(--color-ink-soft)">{hint}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              {needsAddress && (
                <div className="mt-3 flex flex-col gap-2.5 rounded-xl border border-(--color-line) bg-(--color-cream-dim)/60 p-3.5">
                  <p className="text-sm font-medium text-(--color-ink)">Dirección de entrega</p>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                    placeholder="Calle y número *"
                    className="w-full rounded-lg border border-(--color-line) bg-(--color-paper) px-3.5 py-2.5 text-sm text-(--color-ink) placeholder:text-(--color-ink-soft)/70 focus:border-(--color-wine) focus:outline-none"
                  />
                  <input
                    type="text"
                    value={address.neighborhood}
                    onChange={(e) => setAddress((a) => ({ ...a, neighborhood: e.target.value }))}
                    placeholder="Colonia *"
                    className="w-full rounded-lg border border-(--color-line) bg-(--color-paper) px-3.5 py-2.5 text-sm text-(--color-ink) placeholder:text-(--color-ink-soft)/70 focus:border-(--color-wine) focus:outline-none"
                  />
                  <input
                    type="text"
                    value={address.references}
                    onChange={(e) => setAddress((a) => ({ ...a, references: e.target.value }))}
                    placeholder="Entre calles y referencias (opcional)"
                    className="w-full rounded-lg border border-(--color-line) bg-(--color-paper) px-3.5 py-2.5 text-sm text-(--color-ink) placeholder:text-(--color-ink-soft)/70 focus:border-(--color-wine) focus:outline-none"
                  />
                  <p className="text-xs text-(--color-ink-soft)">
                    El costo de envío se confirma por WhatsApp según tu ubicación.
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-(--color-ink-soft)">Total estimado</span>
                <span className="font-display text-xl text-(--color-sage)">{formatCurrency(subtotal)}</span>
              </div>
              {hasQuoteItems && (
                <p className="mt-1 text-xs text-(--color-ink-soft)">
                  Algunos productos son personalizados y se cotizan al confirmar por WhatsApp.
                </p>
              )}

              <button
                type="button"
                onClick={handleSend}
                className="mt-4 w-full rounded-full bg-(--color-wine) px-7 py-4 text-sm font-medium text-(--color-ink) transition-colors hover:bg-(--color-wine-deep) hover:text-(--color-cream)"
              >
                Enviar pedido por WhatsApp
              </button>
              {showValidation && !delivery && (
                <p className="mt-2 text-center text-xs text-(--color-ink-soft)">
                  Elige una forma de entrega para continuar.
                </p>
              )}
              {showValidation && needsAddress && !addressComplete && (
                <p className="mt-2 text-center text-xs text-(--color-ink-soft)">
                  Completa tu dirección (calle y colonia) para continuar.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
