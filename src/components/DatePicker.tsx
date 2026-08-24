import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

const WEEKDAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTH_LABELS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

function parseISODate(value: string): Date | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDisplay(value: string): string {
  const date = parseISODate(value)
  if (!date) return ''
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** Lunes=0..Domingo=6, para que la cuadrícula empiece la semana en lunes. */
function mondayIndex(jsDay: number): number {
  return (jsDay + 6) % 7
}

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  ariaLabel: string
}

/**
 * Selector de fecha propio — el input nativo type="date" renderiza distinto
 * en cada navegador/dispositivo (en un iPhone real el widget de iOS no
 * respeta bien el ancho del contenedor), así que este reemplaza el control
 * nativo por completo con un calendario del mismo estilo del sitio.
 */
export function DatePicker({ value, onChange, placeholder, ariaLabel }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = parseISODate(value)
  const [viewDate, setViewDate] = useState(() => selected ?? new Date())

  useBodyScrollLock(open)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = mondayIndex(firstOfMonth.getDay())
  const today = new Date()

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const pick = (day: number) => {
    onChange(toISODate(new Date(year, month, day)))
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setViewDate(selected ?? new Date())
          setOpen(true)
        }}
        aria-label={ariaLabel}
        className="flex min-h-11 w-full min-w-0 items-center gap-1.5 rounded-lg border border-(--color-line) bg-(--color-paper) px-3.5 py-2.5 text-sm text-(--color-ink) focus:border-(--color-wine) focus:outline-none"
      >
        <Calendar className="h-4 w-4 flex-none text-(--color-ink-soft)" strokeWidth={1.5} />
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
            className="w-full max-w-sm rounded-2xl border border-(--color-line) bg-(--color-paper) p-5 shadow-(--shadow-lift)"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-(--color-ink)">Selecciona una fecha</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="flex h-8 w-8 items-center justify-center rounded-full text-(--color-ink-soft) hover:bg-(--color-cream-dim)"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                aria-label="Mes anterior"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-(--color-ink-soft) hover:bg-(--color-cream-dim)"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <p className="text-sm font-medium text-(--color-ink)">
                {MONTH_LABELS[month]} {year}
              </p>
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                aria-label="Mes siguiente"
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-(--color-ink-soft) hover:bg-(--color-cream-dim)"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-7 text-center text-xs text-(--color-ink-soft)">
              {WEEKDAY_LABELS.map((w, i) => (
                <span key={i} className="py-1">
                  {w}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={i} />
                const cellDate = new Date(year, month, day)
                const selectedHere = selected !== null && isSameDay(cellDate, selected)
                const isToday = isSameDay(cellDate, today)
                return (
                  <div key={i} className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => pick(day)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                        selectedHere
                          ? 'bg-(--color-wine) text-(--color-ink)'
                          : isToday
                            ? 'border border-(--color-wine) text-(--color-ink)'
                            : 'text-(--color-ink) hover:bg-(--color-cream-dim)'
                      }`}
                    >
                      {day}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
