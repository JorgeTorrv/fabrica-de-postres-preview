import { useMemo, useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import type { MenuItem } from '../data/types'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../utils/format'
import { asset } from '../utils/asset'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { ImageSlot } from './ImageSlot'

type ProductModalProps = {
  item: MenuItem
  categoryName: string
  onClose: () => void
}

export function ProductModal({ item, categoryName, onClose }: ProductModalProps) {
  const { addItem } = useCart()
  const [flavor, setFlavor] = useState<string | undefined>(item.flavors?.[0])
  const [optionIndex, setOptionIndex] = useState(0)
  const [selectedFillings, setSelectedFillings] = useState<string[]>([])
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [comment, setComment] = useState('')
  const [justAdded, setJustAdded] = useState(false)

  useBodyScrollLock()

  const option = item.options[optionIndex]

  const extrasTotal = useMemo(
    () => (item.extras ?? []).filter((e) => selectedExtras.includes(e.label)).reduce((sum, e) => sum + e.price, 0),
    [item.extras, selectedExtras],
  )

  const unitPrice = (option?.price ?? 0) + extrasTotal
  const total = unitPrice * quantity

  const toggleExtra = (label: string) => {
    setSelectedExtras((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  const toggleFilling = (label: string) => {
    setSelectedFillings((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]))
  }

  const handleAdd = () => {
    if (item.customQuote) {
      addItem({
        categoryName,
        name: item.name,
        flavor,
        optionLabel: selectedFillings.length > 0 ? selectedFillings.join(', ') : 'A definir con el negocio',
        optionPrice: 0,
        extras: [],
        quantity,
        comment: comment.trim() || undefined,
        customQuote: true,
        image: item.image,
      })
    } else {
      addItem({
        categoryName,
        name: item.name,
        flavor,
        optionLabel: option.label,
        optionPrice: option.price,
        extras: (item.extras ?? []).filter((e) => selectedExtras.includes(e.label)),
        quantity,
        comment: comment.trim() || undefined,
        image: item.image,
      })
    }
    setJustAdded(true)
    setTimeout(onClose, 550)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-(--color-ink)/60 sm:items-center sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] bg-(--color-paper) sm:rounded-[1.75rem]">
        <div className="relative">
          <ImageSlot src={item.image ?? ''} alt={item.name} placeholderLabel={item.name} className="h-56 w-full sm:h-64" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-(--color-paper)/90 text-(--color-ink) shadow-(--shadow-soft)"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-7 sm:px-9">
          <p className="text-sm text-(--color-ink-soft)">{categoryName}</p>
          <h3 className="mt-1 flex items-center gap-2 font-display text-3xl text-(--color-ink)">
            {item.name}
            {item.featured && <img src={asset('/images/Icons/CerezaIcon.png')} alt="Destacado" className="h-12 w-12" />}
          </h3>
          {item.description && <p className="mt-2 text-sm text-(--color-ink-soft)">{item.description}</p>}
          {item.note && <p className="mt-2 text-sm italic text-(--color-ink-soft)">{item.note}</p>}
          {item.soldOut && <p className="mt-3 text-sm font-medium text-(--color-wine)">Agotado por ahora</p>}

          <div className={item.soldOut ? 'pointer-events-none opacity-50' : undefined}>
          {item.flavors && item.flavors.length > 0 && (
            <div className="mt-7">
              <p className="text-sm font-medium text-(--color-ink)">{item.flavorsLabel ?? 'Sabor'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.flavors.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFlavor(f)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      flavor === f
                        ? 'border-(--color-wine) bg-(--color-wine) text-(--color-cream)'
                        : 'border-(--color-line) text-(--color-ink-soft) hover:border-(--color-wine)'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!item.customQuote && (
            <div className="mt-7">
              <p className="text-sm font-medium text-(--color-ink)">{item.optionsLabel ?? 'Presentación'}</p>
              <div className="mt-3 flex flex-col gap-2">
                {item.options.map((opt, index) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setOptionIndex(index)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      optionIndex === index
                        ? 'border-(--color-wine) bg-(--color-cream-dim)'
                        : 'border-(--color-line) hover:border-(--color-wine)'
                    }`}
                  >
                    <span className="text-(--color-ink)">{opt.label}</span>
                    <span className="font-medium text-(--color-ink)">{formatCurrency(opt.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.customQuote && item.options.length > 0 && (
            <div className="mt-7">
              <p className="text-sm font-medium text-(--color-ink)">
                {item.optionsLabel ?? 'Relleno'} <span className="text-(--color-ink-soft)">(elige los que quieras)</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.options.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => toggleFilling(opt.label)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      selectedFillings.includes(opt.label)
                        ? 'border-(--color-wine) bg-(--color-wine) text-(--color-cream)'
                        : 'border-(--color-line) text-(--color-ink-soft) hover:border-(--color-wine)'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.extras && item.extras.length > 0 && (
            <div className="mt-7">
              <p className="text-sm font-medium text-(--color-ink)">Extras</p>
              <div className="mt-3 flex flex-col gap-2">
                {item.extras.map((extra) => (
                  <label
                    key={extra.label}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-(--color-line) px-4 py-3 text-sm hover:border-(--color-wine)"
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra.label)}
                        onChange={() => toggleExtra(extra.label)}
                        className="h-4 w-4 accent-(--color-wine)"
                      />
                      {extra.label}
                    </span>
                    <span className="text-(--color-ink-soft)">+{formatCurrency(extra.price)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7">
            <label htmlFor="comment" className="text-sm font-medium text-(--color-ink)">
              Comentario para este producto
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ej. sin nuez, con dedicatoria 'Feliz cumpleaños Ana', para las 5pm..."
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

        <div className="border-t border-(--color-line) px-7 py-5 sm:px-9">
          <button
            type="button"
            onClick={item.soldOut ? undefined : handleAdd}
            disabled={item.soldOut}
            className={`flex w-full items-center justify-between rounded-full px-7 py-4 text-sm font-medium transition-colors ${
              item.soldOut
                ? 'cursor-not-allowed bg-(--color-cream-dim) text-(--color-ink-soft)'
                : 'bg-(--color-wine) text-(--color-cream) hover:bg-(--color-wine-deep)'
            }`}
          >
            <span>{item.soldOut ? 'Agotado' : justAdded ? 'Agregado al carrito' : 'Agregar al carrito'}</span>
            {!item.soldOut && <span>{item.customQuote ? 'A cotizar' : formatCurrency(total)}</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
