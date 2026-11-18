import { createPortal } from 'react-dom'
import type { CalculationResults } from '../types'
import { formatMoney, formatNumber, formatPercent } from '../lib/format'
import { BrandMark } from './BrandMark'

interface SummaryBarProps {
  results: CalculationResults | null
  inputsMarginPct: number
  hasCosts: boolean
  marginError?: string
  onFillExample: () => void
}

export function SummaryBar({
  results,
  inputsMarginPct,
  hasCosts,
  marginError,
  onFillExample,
}: SummaryBarProps) {
  const data = hasCosts ? results : null

  return createPortal(
    <>
      <div className="summary-mask" aria-hidden="true" />
      <aside className="summary-bar" aria-labelledby="summary-title">
        <div className="summary-head">
          <BrandMark className="summary-brand" />
          <span className="summary-title" id="summary-title">
            每月保本销售额
          </span>
          <span className="summary-badge">
            {marginError
              ? '毛利率待填写'
              : `毛利率 ${formatPercent(inputsMarginPct)}`}
          </span>
        </div>

        <div className="summary-main">
          <span className="summary-currency">¥</span>
          {data ? (
            formatNumber(data.monthlyBreakEven)
          ) : (
            <span className="summary-dash">—</span>
          )}
        </div>

        <div className="summary-stats">
          <div>
            <span>日保本</span>
            <strong>
              {data ? (
                formatMoney(data.dailyBreakEven)
              ) : (
                <em className="summary-empty-value">—</em>
              )}
            </strong>
          </div>
          <div>
            <span>月固定</span>
            <strong>
              {data ? (
                formatMoney(data.monthlyFixedCost)
              ) : (
                <em className="summary-empty-value">—</em>
              )}
            </strong>
          </div>
          <div>
            <span>至少成交</span>
            <strong>
              {data ? (
                <>
                  {data.dailyOrders}
                  <small>单</small>
                </>
              ) : (
                <em className="summary-empty-value">—</em>
              )}
            </strong>
          </div>
          <div>
            <span>至少客流</span>
            <strong>
              {data ? (
                <>
                  {data.dailyTraffic}
                  <small>人</small>
                </>
              ) : (
                <em className="summary-empty-value">—</em>
              )}
            </strong>
          </div>
        </div>

        {data ? (
          <p className="summary-ref">
            参考 40% {formatMoney(data.at40.monthlyBreakEven)} · 45%{' '}
            {formatMoney(data.at45.monthlyBreakEven)}
          </p>
        ) : hasCosts ? (
          <p className="summary-hint">请修正下方标红参数</p>
        ) : (
          <button
            type="button"
            className="summary-example"
            onClick={onFillExample}
          >
            填入示例数据
            <span aria-hidden="true">→</span>
          </button>
        )}
      </aside>
    </>,
    document.body,
  )
}
