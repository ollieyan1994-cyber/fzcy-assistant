import { useState } from 'react'
import type { SavedScenario } from '../types'
import { FIELD_LABELS, MONTHLY_COST_FIELDS } from '../types'
import {
  formatDateTime,
  formatMoney,
  formatNumber,
  formatPercent,
} from '../lib/format'
import { BottomSheet } from '../components/BottomSheet'
import { BackIcon, TrashIcon } from '../components/Icons'
import { SectionCard } from '../components/SectionCard'

interface ScenarioDetailPageProps {
  scenario: SavedScenario | null
  onBack: () => void
  onLoad: (scenario: SavedScenario) => void
  onDelete: (scenario: SavedScenario) => void
}

export function ScenarioDetailPage({
  scenario,
  onBack,
  onLoad,
  onDelete,
}: ScenarioDetailPageProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!scenario) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            <TrashIcon className="empty-icon-svg" />
          </span>
          <h3>方案不存在</h3>
          <p>这个方案可能已经被删除，或者链接不完整。</p>
          <button type="button" className="primary-button" onClick={onBack}>
            返回方案记录
          </button>
        </div>
      </div>
    )
  }

  const { inputs, results } = scenario

  return (
    <div className="page detail-page">
      <section className="result-card detail-result-card">
        <div className="result-top">
          <span className="result-label">保存的方案</span>
          <span className="result-badge">
            毛利率 {formatPercent(inputs.marginPct)}
          </span>
        </div>
        <h2 className="detail-name">{scenario.name}</h2>
        <p className="detail-date">{formatDateTime(scenario.createdAt)}</p>

        <div className="result-main">
          <span className="currency">¥</span>
          {formatNumber(results.monthlyBreakEven)}
        </div>
        <p className="result-caption">每月保本销售额</p>

        <div className="result-stats">
          <div>
            <span>日保本销售额</span>
            <strong>{formatMoney(results.dailyBreakEven)}</strong>
          </div>
          <div>
            <span>月固定总成本</span>
            <strong>{formatMoney(results.monthlyFixedCost)}</strong>
          </div>
        </div>
      </section>

      <SectionCard title="经营推算" subtitle="按保存时的客单价与转化率">
        <div className="detail-stat-grid">
          <div className="detail-stat">
            <span>每天至少成交</span>
            <strong>
              {results.dailyOrders}
              <small>单</small>
            </strong>
          </div>
          <div className="detail-stat">
            <span>每天至少有效客流</span>
            <strong>
              {results.dailyTraffic}
              <small>人</small>
            </strong>
          </div>
        </div>
        <div className="detail-list">
          <div>
            <span>平均客单价</span>
            <strong>{formatMoney(inputs.avgTicket)}</strong>
          </div>
          <div>
            <span>购买转化率</span>
            <strong>{formatPercent(inputs.conversionPct)}</strong>
          </div>
          <div>
            <span>月营业天数</span>
            <strong>{formatNumber(inputs.businessDays)} 天</strong>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="固定成本明细" subtitle="保存时的每月固定支出">
        <div className="detail-list detail-list-tight">
          {MONTHLY_COST_FIELDS.map((key) => (
            <div key={key}>
              <span>{FIELD_LABELS[key]}</span>
              <strong>{formatMoney(inputs[key])}</strong>
            </div>
          ))}
          <div>
            <span>装修设备月摊销</span>
            <strong>{formatMoney(results.amortization)}</strong>
          </div>
          <div className="detail-list-total">
            <span>月固定总成本</span>
            <strong>{formatMoney(results.monthlyFixedCost)}</strong>
          </div>
        </div>
        <p className="section-help">
          摊销依据：装修 {formatMoney(inputs.decoration)} + 设备{' '}
          {formatMoney(inputs.equipment)}，租期 {formatNumber(inputs.leaseMonths)}{' '}
          个月。
        </p>
      </SectionCard>

      <SectionCard title="毛利率参考" subtitle="同一成本下，不同毛利率的保本额">
        <div className="reference-list">
          <div>
            <span>毛利率 40%</span>
            <strong>{formatMoney(results.at40.monthlyBreakEven)}/月</strong>
            <em>
              日保本 {formatMoney(results.at40.dailyBreakEven)} ·{' '}
              {results.at40.dailyOrders} 单 · {results.at40.dailyTraffic} 人
            </em>
          </div>
          <div>
            <span>毛利率 45%</span>
            <strong>{formatMoney(results.at45.monthlyBreakEven)}/月</strong>
            <em>
              日保本 {formatMoney(results.at45.dailyBreakEven)} ·{' '}
              {results.at45.dailyOrders} 单 · {results.at45.dailyTraffic} 人
            </em>
          </div>
        </div>
      </SectionCard>

      <div className="detail-actions">
        <button
          type="button"
          className="primary-button"
          onClick={() => onLoad(scenario)}
        >
          载入到测算页
        </button>
        <button
          type="button"
          className="danger-button"
          onClick={() => setDeleteOpen(true)}
        >
          <TrashIcon className="danger-icon" />
          删除这个方案
        </button>
        <button type="button" className="text-button" onClick={onBack}>
          <BackIcon className="inline-back-icon" />
          返回方案记录
        </button>
      </div>

      <p className="list-footnote">
        载入后可以修改参数重新计算。删除方案后无法恢复。
      </p>

      <BottomSheet
        open={deleteOpen}
        title="删除这个方案？"
        description={`“${scenario.name}”删除后无法恢复，但不影响其他方案。`}
        onClose={() => setDeleteOpen(false)}
      >
        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setDeleteOpen(false)}
          >
            取消
          </button>
          <button
            type="button"
            className="danger-solid-button"
            onClick={() => onDelete(scenario)}
          >
            确认删除
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
