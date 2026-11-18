import { useMemo, useState } from 'react'
import type {
  FieldKey,
  FormValues,
  SavedScenario,
} from '../types'
import { MONTHLY_COST_FIELDS } from '../types'
import {
  calcAmortization,
  calculate,
  formToInputs,
  hasAnyCostInput,
  sumMonthlyCosts,
  validateInputs,
} from '../lib/calc'
import { createScenarioId } from '../lib/storage'
import {
  defaultScenarioName,
  formatMoney,
} from '../lib/format'
import { BottomSheet } from '../components/BottomSheet'
import { InstallIcon } from '../components/Icons'
import { MarginField } from '../components/MarginField'
import { NumberField } from '../components/NumberField'
import { SectionCard } from '../components/SectionCard'
import { SummaryBar } from '../components/SummaryBar'

interface CalculatorPageProps {
  form: FormValues
  onFieldChange: (key: FieldKey, value: string) => void
  onFillExample: () => void
  onReset: () => void
  onSaveScenario: (scenario: SavedScenario) => void
  canInstall: boolean
  onInstall: () => void
}

const COST_LABELS: Record<(typeof MONTHLY_COST_FIELDS)[number], string> = {
  rent: '房租',
  property: '物业费',
  utilities: '水电费',
  labor: '人工',
  pos: '收银系统',
  other: '其他',
}

export function CalculatorPage({
  form,
  onFieldChange,
  onFillExample,
  onReset,
  onSaveScenario,
  canInstall,
  onInstall,
}: CalculatorPageProps) {
  const [saveOpen, setSaveOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [scenarioName, setScenarioName] = useState('')

  const inputs = useMemo(() => formToInputs(form), [form])
  const errors = useMemo(() => validateInputs(inputs), [inputs])
  const isValid = Object.keys(errors).length === 0
  const results = useMemo(
    () => (isValid ? calculate(inputs) : null),
    [inputs, isValid],
  )

  const monthlyCostSubtotal = useMemo(() => sumMonthlyCosts(inputs), [inputs])
  const amortization = useMemo(() => calcAmortization(inputs), [inputs])
  const monthlyFixedCost = Number.isFinite(amortization)
    ? monthlyCostSubtotal + amortization
    : Number.NaN

  const hasCosts = hasAnyCostInput(inputs)
  const canSave = Boolean(results) && hasCosts

  const openSave = () => {
    if (!canSave) return
    setScenarioName(defaultScenarioName())
    setSaveOpen(true)
  }

  const handleSave = () => {
    const name = scenarioName.trim()
    if (!name || !results) return

    onSaveScenario({
      id: createScenarioId(),
      name,
      createdAt: Date.now(),
      inputs,
      results,
    })
    setSaveOpen(false)
  }

  const saveLabel = !hasCosts
    ? '请先填写固定成本'
    : !isValid
      ? '请修正标红参数'
      : '保存本次方案'

  return (
    <div className="page calculator-page">
      <h1 className="sr-only">保本测算</h1>
      <div className="summary-spacer" aria-hidden="true" />
      <SummaryBar
        results={results}
        inputsMarginPct={inputs.marginPct}
        hasCosts={hasCosts}
        marginError={errors.marginPct}
        onFillExample={onFillExample}
      />

      <SectionCard
        title="每月固定成本"
        subtitle="房租、人工等每月固定支出"
        tag="不含摊销"
      >
        {MONTHLY_COST_FIELDS.map((key) => (
          <NumberField
            key={key}
            id={key}
            label={COST_LABELS[key]}
            value={form[key]}
            onChange={(value) => onFieldChange(key, value)}
            prefix="¥"
            error={errors[key]}
          />
        ))}
        <div className="subtotal-row">
          <span>固定支出小计</span>
          <strong>{formatMoney(monthlyCostSubtotal)}</strong>
        </div>
      </SectionCard>

      <SectionCard
        title="装修与设备摊销"
        subtitle="一次性投入，按月分摊"
        tag="按租期"
      >
        <NumberField
          id="decoration"
          label="装修投入"
          value={form.decoration}
          onChange={(value) => onFieldChange('decoration', value)}
          prefix="¥"
          error={errors.decoration}
        />
        <NumberField
          id="equipment"
          label="设备投入"
          value={form.equipment}
          onChange={(value) => onFieldChange('equipment', value)}
          prefix="¥"
          error={errors.equipment}
        />
        <NumberField
          id="leaseMonths"
          label="租期"
          hint="装修和设备按这个月数分摊"
          value={form.leaseMonths}
          onChange={(value) => onFieldChange('leaseMonths', value)}
          suffix="个月"
          mode="integer"
          decimals={0}
          error={errors.leaseMonths}
        />

        <div className="calc-divider" />

        <div className="calc-row">
          <span>每月摊销</span>
          <strong>
            {Number.isFinite(amortization)
              ? formatMoney(amortization)
              : '—'}
          </strong>
        </div>
        <div className="calc-row calc-row-total">
          <span>合计月固定成本</span>
          <strong>
            {Number.isFinite(monthlyFixedCost)
              ? formatMoney(monthlyFixedCost)
              : '—'}
          </strong>
        </div>
        <p className="section-help">（装修 + 设备）÷ 租期（月）</p>
      </SectionCard>

      <SectionCard
        title="经营参数"
        subtitle="毛利率与客流假设"
        tag="实时计算"
      >
        <MarginField
          value={form.marginPct}
          onChange={(value) => onFieldChange('marginPct', value)}
          error={errors.marginPct}
        />

        <div className="param-divider" />

        <NumberField
          id="businessDays"
          label="月营业天数"
          value={form.businessDays}
          onChange={(value) => onFieldChange('businessDays', value)}
          suffix="天"
          mode="integer"
          decimals={0}
          error={errors.businessDays}
        />
        <NumberField
          id="avgTicket"
          label="平均客单价"
          value={form.avgTicket}
          onChange={(value) => onFieldChange('avgTicket', value)}
          prefix="¥"
          error={errors.avgTicket}
        />
        <NumberField
          id="conversionPct"
          label="购买转化率"
          hint="进店后实际购买的比例"
          value={form.conversionPct}
          onChange={(value) => onFieldChange('conversionPct', value)}
          suffix="%"
          decimals={1}
          error={errors.conversionPct}
        />
      </SectionCard>

      <details className="formula-card">
        <summary>
          <span>计算说明</span>
          <small>查看公式</small>
        </summary>
        <ul className="formula-list">
          <li>装修设备月摊销 =（装修投入 + 设备投入）÷ 租期月数</li>
          <li>
            月固定总成本 = 房租 + 物业 + 水电 + 人工 + 收银系统 + 其他 +
            月摊销
          </li>
          <li>月保本销售额 = 月固定总成本 ÷ 实际综合毛利率</li>
          <li>日保本销售额 = 月保本销售额 ÷ 月营业天数</li>
          <li>日均成交单数 = 日保本销售额 ÷ 平均客单价</li>
          <li>所需日有效客流 = 日均成交单数 ÷ 购买转化率</li>
          <li>金额四舍五入到元；单量、客流向上取整，表示“至少需要”。</li>
          <li>
            实际综合毛利率应扣除打折促销、库存损耗，通常按 40%–45% 估算。
          </li>
        </ul>
      </details>

      <div className="save-panel">
        <button
          type="button"
          className="primary-button"
          onClick={openSave}
          disabled={!canSave}
        >
          {saveLabel}
        </button>
        <button
          type="button"
          className="text-button"
          onClick={() => setResetOpen(true)}
        >
          重置全部输入
        </button>
        <p className="save-note">
          方案和输入只保存在本机浏览器，不会上传服务器。
        </p>
      </div>

      {canInstall ? (
        <div className="install-card">
          <span className="install-icon-wrap" aria-hidden="true">
            <InstallIcon className="install-icon" />
          </span>
          <div>
            <strong>安装到手机桌面</strong>
            <p>离线也能打开，数据仍保存在本机</p>
          </div>
          <button type="button" className="install-button" onClick={onInstall}>
            安装
          </button>
        </div>
      ) : null}

      <BottomSheet
        open={saveOpen}
        title="保存本次方案"
        description="会同时保存当前参数和计算结果，方便以后查看或调出来修改。"
        onClose={() => setSaveOpen(false)}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSave()
          }}
        >
          <label className="modal-field-label" htmlFor="scenario-name">
            方案名称
          </label>
          <input
            id="scenario-name"
            className="text-input"
            value={scenarioName}
            onChange={(event) => setScenarioName(event.target.value)}
            maxLength={30}
            autoFocus
            placeholder="例如：步行街店 · 保守估算"
          />

          {results ? (
            <div className="modal-preview">
              <div>
                月保本销售额
                <strong>{formatMoney(results.monthlyBreakEven)}</strong>
              </div>
              <div>
                日保本销售额
                <strong>{formatMoney(results.dailyBreakEven)}</strong>
              </div>
            </div>
          ) : null}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setSaveOpen(false)}
            >
              取消
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={!scenarioName.trim()}
            >
              保存方案
            </button>
          </div>
        </form>
      </BottomSheet>

      <BottomSheet
        open={resetOpen}
        title="重置全部输入？"
        description="未保存的当前输入会被清空，已经保存的方案不受影响。"
        onClose={() => setResetOpen(false)}
      >
        <div className="modal-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setResetOpen(false)}
          >
            取消
          </button>
          <button
            type="button"
            className="danger-solid-button"
            onClick={() => {
              onReset()
              setResetOpen(false)
            }}
          >
            确认重置
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
