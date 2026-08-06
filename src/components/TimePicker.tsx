import { useEffect, useRef, useState } from 'react'
import { Clock, X } from 'lucide-react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

// Debe coincidir con BUSINESS.hoursDaily (10:00 – 20:00).
const OPEN_HOUR = 10
const CLOSE_HOUR = 20
const MINUTES = [0, 15, 30, 45]
const HOURS = Array.from({ length: CLOSE_HOUR - OPEN_HOUR + 1 }, (_, i) => OPEN_HOUR + i)

const ROW_HEIGHT = 44
const VISIBLE_ROWS = 5
const WHEEL_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS
const WHEEL_PAD = (WHEEL_HEIGHT - ROW_HEIGHT) / 2

const FADE_MASK =
  'linear-gradient(to bottom, transparent, black 28%, black 72%, transparent)'

type WheelColumnProps = {
  items: number[]
  value: number
  onChange: (value: number) => void
}

/**
 * Una columna de rueda estilo iOS: el valor "seleccionado" es lo que queda
 * centrado tras el scroll (con snap), no algo que se tapea en una lista. La
 * franja de selección y el resaltado quedan fijos en el centro; lo que se
 * mueve es el contenido detrás.
 */
function WheelColumn({ items, value, onChange }: WheelColumnProps) {
  const ref = useRef<HTMLDivElement>(null)
  const programmatic = useRef(false)

  // Deps vacío a propósito: solo debe sincronizar el scroll al valor inicial
  // cuando el componente monta (se abre el picker). Después de eso el
  // usuario controla el scroll — reaccionar a cambios de `value` aquí haría
  // que la rueda saltara de vuelta mientras el usuario la está moviendo.
  useEffect(() => {
    const el = ref.current
    const index = items.indexOf(value)
    if (!el || index === -1) return
    programmatic.current = true
    el.scrollTo({ top: index * ROW_HEIGHT, behavior: 'instant' })
    const id = setTimeout(() => {
      programmatic.current = false
    }, 50)
    return () => clearTimeout(id)
  }, [])

  const handleScroll = () => {
    if (programmatic.current) return
    const el = ref.current
    if (!el) return
    const index = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ROW_HEIGHT)))
    const next = items[index]
    if (next !== value) onChange(next)
  }

  return (
    <div
      ref={ref}
      onScroll={handleScroll}
      className="snap-y snap-mandatory overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ height: WHEEL_HEIGHT, paddingTop: WHEEL_PAD, paddingBottom: WHEEL_PAD, maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
    >
      {items.map((item) => (
        <div
          key={item}
          className="flex snap-center items-center justify-center text-lg tabular-nums text-(--color-ink)"
          style={{ height: ROW_HEIGHT }}
        >
          {String(item).padStart(2, '0')}
        </div>
      ))}
    </div>
  )
}

type TimePickerProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
}

/**
 * Selector de hora propio (no input nativo — ver DatePicker para el motivo),
 * como una rueda de iOS: dos columnas hora/minuto con un solo separador ":"
 * fijo en el centro, limitado al horario del negocio (10:00–20:00), 24h.
 */
export function TimePicker({ value, onChange, placeholder, ariaLabel }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const [hour, setHour] = useState<number>(() => (value ? Number(value.split(':')[0]) : OPEN_HOUR))
  const [minute, setMinute] = useState<number>(() => (value ? Number(value.split(':')[1]) : 0))

  useBodyScrollLock(open)

  const openPicker = () => {
    if (value) {
      const [h, m] = value.split(':').map(Number)
      setHour(h)
      setMinute(m)
    }
    setOpen(true)
  }

  const confirm = () => {
    onChange(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        aria-label={ariaLabel}
        className="flex min-h-11 w-full min-w-0 items-center gap-1.5 rounded-lg border border-(--color-line) bg-(--color-paper) px-3.5 py-2.5 text-sm text-(--color-ink) focus:border-(--color-wine) focus:outline-none"
      >
        <Clock className="h-4 w-4 flex-none text-(--color-ink-soft)" strokeWidth={1.5} />
        <span className="truncate">{value || <span className="text-(--color-ink-soft)">{placeholder}</span>}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-(--color-ink)/50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-(--color-line) bg-(--color-paper) p-5 shadow-(--shadow-lift)"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-(--color-ink)">Selecciona una hora</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="flex h-8 w-8 items-center justify-center rounded-full text-(--color-ink-soft) hover:bg-(--color-cream-dim)"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative mt-3">
              <div
                className="pointer-events-none absolute inset-x-0 rounded-xl bg-(--color-cream-dim)"
                style={{ top: WHEEL_PAD, height: ROW_HEIGHT }}
              />
              <div className="flex items-center justify-center gap-2">
                <WheelColumn items={HOURS} value={hour} onChange={setHour} />
                <span className="pointer-events-none text-lg font-medium text-(--color-ink)">:</span>
                <WheelColumn items={MINUTES} value={minute} onChange={setMinute} />
              </div>
            </div>

            <button
              type="button"
              onClick={confirm}
              className="mt-4 w-full rounded-full bg-(--color-wine) px-4 py-2.5 text-sm font-medium text-(--color-cream) hover:bg-(--color-wine-deep)"
            >
              Confirmar {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
