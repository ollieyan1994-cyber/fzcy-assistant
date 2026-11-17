export type CostFieldKey =
  | 'rent'
  | 'property'
  | 'utilities'
  | 'labor'
  | 'pos'
  | 'other'

export type AmortizationFieldKey = 'decoration' | 'equipment' | 'leaseMonths'

export type BusinessFieldKey =
  | 'marginPct'
  | 'businessDays'
  | 'avgTicket'
  | 'conversionPct'

export type FieldKey = CostFieldKey | AmortizationFieldKey | BusinessFieldKey

/** 表单里统一存字符串，允许清空、保留小数点输入过程。 */
export type FormValues = Record<FieldKey, string>

export interface CalculatorInputs {
  rent: number
  property: number
  utilities: number
  labor: number
  pos: number
  other: number
  decoration: number
  equipment: number
  leaseMonths: number
  marginPct: number
  businessDays: number
  avgTicket: number
  conversionPct: number
}

export interface MarginScenario {
  marginPct: number
  monthlyBreakEven: number
  dailyBreakEven: number
  dailyOrders: number
  dailyTraffic: number
}

export interface CalculationResults {
  monthlyCostSubtotal: number
  amortization: number
  monthlyFixedCost: number
  monthlyBreakEven: number
  dailyBreakEven: number
  dailyOrders: number
  dailyTraffic: number
  at40: MarginScenario
  at45: MarginScenario
}

export interface SavedScenario {
  id: string
  name: string
  createdAt: number
  inputs: CalculatorInputs
  results: CalculationResults
}

export type ValidationErrors = Partial<Record<FieldKey, string>>

export const MONTHLY_COST_FIELDS: CostFieldKey[] = [
  'rent',
  'property',
  'utilities',
  'labor',
  'pos',
  'other',
]

export const AMORTIZATION_FIELDS: AmortizationFieldKey[] = [
  'decoration',
  'equipment',
  'leaseMonths',
]

export const BUSINESS_FIELDS: BusinessFieldKey[] = [
  'marginPct',
  'businessDays',
  'avgTicket',
  'conversionPct',
]

export const FIELD_LABELS: Record<FieldKey, string> = {
  rent: '房租',
  property: '物业费',
  utilities: '水电费',
  labor: '人工',
  pos: '收银系统',
  other: '其他',
  decoration: '装修投入',
  equipment: '设备投入',
  leaseMonths: '租期',
  marginPct: '综合毛利率',
  businessDays: '月营业天数',
  avgTicket: '平均客单价',
  conversionPct: '购买转化率',
}

export const EMPTY_FORM: FormValues = {
  rent: '',
  property: '',
  utilities: '',
  labor: '',
  pos: '',
  other: '',
  decoration: '',
  equipment: '',
  leaseMonths: '36',
  marginPct: '42.5',
  businessDays: '30',
  avgTicket: '200',
  conversionPct: '10',
}

export const SAMPLE_FORM: FormValues = {
  rent: '5000',
  property: '1000',
  utilities: '1000',
  labor: '6000',
  pos: '0',
  other: '0',
  decoration: '108000',
  equipment: '0',
  leaseMonths: '36',
  marginPct: '42.5',
  businessDays: '30',
  avgTicket: '200',
  conversionPct: '10',
}

export function cloneEmptyForm(): FormValues {
  return { ...EMPTY_FORM }
}
