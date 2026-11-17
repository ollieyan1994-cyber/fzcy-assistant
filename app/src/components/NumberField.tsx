import type { FieldKey } from '../types'
import { parseFormNumber } from '../lib/calc'
import { sanitizeDecimal, sanitizeInteger } from '../lib/input'

interface NumberFieldProps {
  id: FieldKey
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  prefix?: string
  suffix?: string
  mode?: 'decimal' | 'integer'
  decimals?: number
  error?: string
  placeholder?: string
}

export function NumberField({
  id,
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  mode = 'decimal',
  decimals = 2,
  error,
  placeholder = '0',
}: NumberFieldProps) {
  const handleChange = (raw: string) => {
    onChange(
      mode === 'integer'
        ? sanitizeInteger(raw)
        : sanitizeDecimal(raw, decimals),
    )
  }

  const handleBlur = () => {
    if (value === '') return
    const parsed = parseFormNumber(value)
    const normalized =
      mode === 'integer'
        ? String(Math.trunc(parsed))
        : String(Number(parsed.toFixed(decimals)))
    if (normalized !== value) onChange(normalized)
  }

  const errorId = `${id}-error`

  return (
    <>
      <label className="field-row" htmlFor={id}>
        <span className="field-label">
          {label}
          {hint ? <small>{hint}</small> : null}
        </span>
        <span className={`field-control${error ? ' has-error' : ''}`}>
          {prefix ? <span className="affix prefix">{prefix}</span> : null}
          <input
            id={id}
            name={id}
            type="text"
            inputMode={mode === 'integer' ? 'numeric' : 'decimal'}
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          {suffix ? <span className="affix suffix">{suffix}</span> : null}
        </span>
      </label>
      {error ? (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </>
  )
}
