import { useEffect } from 'react'
import { X } from 'lucide-react'
import { BUSINESS } from '../data/business'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

type HorariosModalProps = {
  onClose: () => void
}

export function HorariosModal({ onClose }: HorariosModalProps) {
  useBodyScrollLock()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-(--color-ink)/60 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[1.75rem] bg-(--color-paper) px-7 py-7 sm:px-9"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl uppercase tracking-wide text-(--color-sage)">Horarios</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-(--color-line) text-(--color-ink) transition-colors hover:border-(--color-wine) hover:text-(--color-wine-deep)"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-6 flex flex-col">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex items-center justify-between border-b border-(--color-line) py-3.5 last:border-b-0"
            >
              <span className="font-display text-sm uppercase tracking-wide text-(--color-ink)">{day}</span>
              <span className="text-sm text-(--color-ink-soft)">{BUSINESS.hoursDaily}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
