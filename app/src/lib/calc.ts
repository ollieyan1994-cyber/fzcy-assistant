import type {
  CalculationResults,
  CalculatorInputs,
  FieldKey,
  FormValues,
  MarginScenario,
  ValidationErrors,
} from '../types'
import { MONTHLY_COST_FIELDS } from '../types'

const round2 = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100

/** 允许多余空格、保留小数点输入过程；空值按 0 处理。 */
export function parseFormNumber(value: string): number {
  const trimmed = value.trim()
  if (!trimmed) return 0
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formToInputs(form: FormValues): CalculatorInputs {
  const read = (key: FieldKey) => parseFormNumber(form[key])

  return {
    rent: read('rent'),
    property: read('property'),
    utilities: read('utilities'),
    labor: read('labor'),
    pos: read('pos'),
    other: read('other'),
    decoration: read('decoration'),
    equipment: read('equipment'),
    leaseMonths: read('leaseMonths'),
    marginPct: read('marginPct'),
    businessDays: read('businessDays'),
    avgTicket: read('avgTicket'),
    conversionPct: read('conversionPct'),
  }
}

function toInputString(value: number): string {
  if (!Number.isFinite(value)) return ''
  const normalized = Number(value.toFixed(4))
  return String(normalized)
}

export function inputsToForm(inputs: CalculatorInputs): FormValues {
  return {
    rent: toInputString(inputs.rent),
    property: toInputString(inputs.property),
    utilities: toInputString(inputs.utilities),
    labor: toInputString(inputs.labor),
    pos: toInputString(inputs.pos),
    other: toInputString(inputs.other),
    decoration: toInputString(inputs.decoration),
    equipment: toInputString(inputs.equipment),
    leaseMonths: toInputString(inputs.leaseMonths),
    marginPct: toInputString(inputs.marginPct),
    businessDays: toInputString(inputs.businessDays),
    avgTicket: toInputString(inputs.avgTicket),
    conversionPct: toInputString(inputs.conversionPct),
  }
}

export function sumMonthlyCosts(inputs: CalculatorInputs): number {
  return MONTHLY_COST_FIELDS.reduce((sum, key) => sum + inputs[key], 0)
}

export function calcAmortization(inputs: CalculatorInputs): number {
  if (!(inputs.leaseMonths > 0)) return Number.NaN
  return (inputs.decoration + inputs.equipment) / inputs.leaseMonths
}

export function validateInputs(inputs: CalculatorInputs): ValidationErrors {
  const errors: ValidationErrors = {}

  for (const key of [...MONTHLY_COST_FIELDS, 'decoration', 'equipment'] as const) {
    if (inputs[key] < 0) errors[key] = '不能为负数'
  }

  if (!(inputs.leaseMonths > 0)) {
    errors.leaseMonths = '租期需大于 0 个月'
  } else if (!Number.isInteger(inputs.leaseMonths)) {
    errors.leaseMonths = '租期请填整数月'
  } else if (inputs.leaseMonths > 120) {
    errors.leaseMonths = '租期请填 1–120 个月'
  }

  if (!(inputs.marginPct > 0)) {
    errors.marginPct = '毛利率需大于 0'
  } else if (inputs.marginPct >= 100) {
    errors.marginPct = '毛利率需小于 100%'
  }

  if (!(inputs.businessDays >= 1)) {
    errors.businessDays = '营业天数需大于 0'
  } else if (!Number.isInteger(inputs.businessDays)) {
    errors.businessDays = '营业天数请填整数'
  } else if (inputs.businessDays > 31) {
    errors.businessDays = '营业天数请填 1–31 天'
  }

  if (!(inputs.avgTicket > 0)) {
    errors.avgTicket = '客单价需大于 0'
  }

  if (!(inputs.conversionPct > 0)) {
    errors.conversionPct = '转化率需大于 0'
  } else if (inputs.conversionPct > 100) {
    errors.conversionPct = '转化率不能超过 100%'
  }

  return errors
}

function makeMarginScenario(
  monthlyFixedCost: number,
  inputs: CalculatorInputs,
  marginPct: number,
): MarginScenario {
  const monthlyBreakEven = round2(monthlyFixedCost / (marginPct / 100))
  const dailyBreakEven = round2(monthlyBreakEven / inputs.businessDays)
  const dailyOrdersRaw = monthlyBreakEven / inputs.businessDays / inputs.avgTicket
  const dailyTrafficRaw = dailyOrdersRaw / (inputs.conversionPct / 100)

  return {
    marginPct,
    monthlyBreakEven,
    dailyBreakEven,
    dailyOrders: Math.max(0, Math.ceil(dailyOrdersRaw - 1e-9)),
    dailyTraffic: Math.max(0, Math.ceil(dailyTrafficRaw - 1e-9)),
  }
}

/**
 * 前提：已通过 validateInputs。
 * 金额保留 2 位小数；单量、客流向上取整，表示“至少需要”。
 */
export function calculate(inputs: CalculatorInputs): CalculationResults {
  const monthlyCostSubtotal = round2(sumMonthlyCosts(inputs))
  const amortization = round2(calcAmortization(inputs))
  const monthlyFixedCost = round2(monthlyCostSubtotal + amortization)
  const primary = makeMarginScenario(monthlyFixedCost, inputs, inputs.marginPct)

  return {
    monthlyCostSubtotal,
    amortization,
    monthlyFixedCost,
    monthlyBreakEven: primary.monthlyBreakEven,
    dailyBreakEven: primary.dailyBreakEven,
    dailyOrders: primary.dailyOrders,
    dailyTraffic: primary.dailyTraffic,
    at40: makeMarginScenario(monthlyFixedCost, inputs, 40),
    at45: makeMarginScenario(monthlyFixedCost, inputs, 45),
  }
}

export function hasAnyCostInput(inputs: CalculatorInputs): boolean {
  return (
    sumMonthlyCosts(inputs) > 0 ||
    inputs.decoration > 0 ||
    inputs.equipment > 0
  )
}
