import { sanitizeDecimal } from '../lib/input'

const QUICK_MARGINS = [40, 42.5, 45]

interface MarginFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function MarginField({ value, onChange, error }: MarginFieldProps) {
  const numeric = value === '' ? Number.NaN : Number(value)
  const sliderValue = Number.isFinite(numeric)
    ? Math.min(90, Math.max(5, numeric))
    : 42.5

  return (
    <>
      <div className="margin-line">
        <label className="field-label" htmlFor="marginPct">
          综合毛利率
          <small>扣除折扣、损耗后的实际值</small>
        </label>
        <span className={`field-control margin-control${error ? ' has-error' : ''}`}>
          <input
            id="marginPct"
            name="marginPct"
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(event) => onChange(sanitizeDecimal(event.target.value, 1))}
            onBlur={() => {
              if (value !== '' && Number.isFinite(numeric)) {
                const normalized = String(Number(numeric.toFixed(1)))
                if (normalized !== value) onChange(normalized)
              }
            }}
            placeholder="42.5"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'marginPct-error' : undefined}
          />
          <span className="affix suffix">%</span>
        </span>
      </div>

      <input
        className="slider"
        type="range"
        min={5}
        max={90}
        step={0.5}
        value={sliderValue}
        onChange={(event) => onChange(sanitizeDecimal(event.target.value, 1))}
        aria-label="拖动调整综合毛利率"
      />

      <div className="chips" role="group" aria-label="快捷毛利率">
        {QUICK_MARGINS.map((margin) => {
          const active =
            Number.isFinite(numeric) && Math.abs(numeric - margin) < 0.01
          return (
            <button
              key={margin}
              type="button"
              className={`chip${active ? ' active' : ''}`}
              onClick={() => onChange(String(margin))}
            >
              {margin}%
            </button>
          )
        })}
      </div>

      {error ? (
        <p className="field-error" id="marginPct-error">
          {error}
        </p>
      ) : null}

      <p className="help-text">
        请填写扣除打折促销、卖不完的库存损耗后的实际综合毛利率，通常为
        40%–45%。
      </p>
    </>
  )
}
