import { useState } from 'react'
import { Clock, X } from 'lucide-react'

// Debe coincidir con BUSINESS.hoursDaily (10:00 – 20:00).
const OPEN_HOUR = 10
const CLOSE_HOUR = 20
const MINUTES = [0, 15, 30, 45]

const HOURS = Array.from({ length: CLOSE_HOUR - OPEN_HOUR + 1 }, (_, i) => OPEN_HOUR + i)

function hourLabel(h: number): string {
  return String(h).padStart(2, '0')
}

function formatDisplay(value: string): string {
  return value
}

type TimePickerProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
}

/**
 * Selector de hora propio (no input nativo — ver DatePicker para el motivo).
 * Dos columnas, hora y minuto, como un picker clásico, en vez de una lista
 * plana de 21 horarios — limitado al horario del negocio (10am–8pm).
 */
export function TimePicker({ value, onChange, placeholder, ariaLabel }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const [hour, setHour] = useState<number>(() => (value ? Number(value.split(':')[0]) : OPEN_HOUR))
  const [minute, setMinute] = useState<number>(() => (value ? Number(value.split(':')[1]) : 0))

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
        <span className="truncate">
          {value ? formatDisplay(value) : <span className="text-(--color-ink-soft)">{placeholder}</span>}
        </span>
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

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex max-h-56 flex-col gap-1 overflow-y-auto rounded-lg border border-(--color-line) p-1.5">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHour(h)}
                    className={`rounded-md px-2 py-2 text-sm transition-colors ${
                      hour === h ? 'bg-(--color-wine) text-(--color-cream)' : 'text-(--color-ink) hover:bg-(--color-cream-dim)'
                    }`}
                  >
                    {hourLabel(h)}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-1 rounded-lg border border-(--color-line) p-1.5">
                {MINUTES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMinute(m)}
                    className={`rounded-md px-2 py-2 text-sm transition-colors ${
                      minute === m ? 'bg-(--color-wine) text-(--color-cream)' : 'text-(--color-ink) hover:bg-(--color-cream-dim)'
                    }`}
                  >
                    :{String(m).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={confirm}
              className="mt-4 w-full rounded-full bg-(--color-wine) px-4 py-2.5 text-sm font-medium text-(--color-cream) hover:bg-(--color-wine-deep)"
            >
              Confirmar {formatDisplay(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
