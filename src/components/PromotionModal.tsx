import { useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import type { Promotion, RatingSummary } from '../data/types'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { ImageSlot } from './ImageSlot'
import { StarRating } from './StarRating'
import { RatingInput } from './RatingInput'

type PromotionModalProps = {
  promo: Promotion
  onClose: () => void
}

/**
 * Versión simplificada de ProductModal para promociones: solo cantidad y
 * comentario, sin opciones/tamaños/sabores/extras — la promoción ya trae su
 * propio precio fijo.
 */
export function PromotionModal({ promo, onClose }: PromotionModalProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [comment, setComment] = useState('')
  const [justAdded, setJustAdded] = useState(false)
  const [liveRating, setLiveRating] = useState<RatingSummary | undefined>(promo.rating)

  useBodyScrollLock()

  const handleAdd = () => {
    addItem({
      categoryName: 'Promociones',
      name: promo.title,
      optionLabel: 'Promoción',
      optionPrice: promo.price ?? 0,
      extras: [],
      quantity,
      comment: comment.trim() || undefined,
      image: promo.image,
    })
    setJustAdded(true)
    setTimeout(onClose, 550)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-(--color-ink)/60 sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-[2rem] bg-(--color-paper) sm:rounded-[1.75rem]">
        <div className="relative">
          <ImageSlot src={promo.image ?? ''} alt={promo.title} placeholderLabel={promo.title} className="h-48 w-full" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-(--color-paper)/90 text-(--color-ink) shadow-(--shadow-soft)"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-7">
          <p className="text-sm text-(--color-ink-soft)">Promoción</p>
          <h3 className="mt-1 font-display text-3xl text-(--color-ink)">{promo.title}</h3>
          <div className="mt-1.5">
            <StarRating avg={liveRating?.avg ?? 0} count={liveRating?.count ?? 0} size="md" />
          </div>
          {promo.description && <p className="mt-2 text-sm text-(--color-ink-soft)">{promo.description}</p>}
          {promo.soldOut && <p className="mt-3 text-sm font-medium text-(--color-wine)">Agotado por ahora</p>}

          <div className="mt-7">
            <RatingInput itemType="promotion" itemId={promo.id} onRated={setLiveRating} />
          </div>

          <div className={promo.soldOut ? 'pointer-events-none opacity-50' : undefined}>
            <div className="mt-7">
              <label htmlFor="promo-comment" className="text-sm font-medium text-(--color-ink)">
                Comentario
              </label>
              <textarea
                id="promo-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="mt-2 w-full resize-none rounded-xl border border-(--color-line) bg-(--color-paper) px-4 py-3 text-sm text-(--color-ink) placeholder:text-(--color-ink-soft)/70 focus:border-(--color-wine) focus:outline-none"
              />
            </div>

            <div className="mt-7 flex items-center justify-between">
              <p className="text-sm font-medium text-(--color-ink)">Cantidad</p>
              <div className="flex items-center gap-4 rounded-full border border-(--color-line) px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Reducir cantidad"
                  className="flex h-7 w-7 items-center justify-center text-(--color-ink)"
                >
                  <Minus className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <span className="w-4 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Aumentar cantidad"
                  className="flex h-7 w-7 items-center justify-center text-(--color-ink)"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-(--color-line) px-7 py-5">
          <button
            type="button"
            onClick={promo.soldOut ? undefined : handleAdd}
            disabled={promo.soldOut}
            className={`flex w-full items-center justify-between rounded-full px-7 py-4 text-sm font-medium transition-colors ${
              promo.soldOut
                ? 'cursor-not-allowed bg-(--color-cream-dim) text-(--color-ink-soft)'
                : 'bg-(--color-wine) text-(--color-cream) hover:bg-(--color-wine-deep)'
            }`}
          >
            <span>{promo.soldOut ? 'Agotado' : justAdded ? 'Agregado al carrito' : 'Agregar al carrito'}</span>
            {!promo.soldOut && <span>{promo.price != null ? formatCurrency(promo.price * quantity) : ''}</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
