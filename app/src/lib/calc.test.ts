import { describe, expect, it } from 'vitest'
import { EMPTY_FORM, SAMPLE_FORM, type FormValues } from '../types'
import {
  calcAmortization,
  calculate,
  formToInputs,
  hasAnyCostInput,
  inputsToForm,
  parseFormNumber,
  sumMonthlyCosts,
  validateInputs,
} from './calc'

function formWith(overrides: Partial<FormValues>): FormValues {
  return { ...SAMPLE_FORM, ...overrides }
}

describe('表单与输入转换', () => {
  it('空字符串按 0 处理，保留小数', () => {
    expect(parseFormNumber('')).toBe(0)
    expect(parseFormNumber('  ')).toBe(0)
    expect(parseFormNumber('42.5')).toBe(42.5)
    expect(parseFormNumber('abc')).toBe(0)
  })

  it('数字与表单可以互相转换', () => {
    const inputs = formToInputs(SAMPLE_FORM)
    const form = inputsToForm(inputs)

    expect(form.rent).toBe('5000')
    expect(form.marginPct).toBe('42.5')
    expect(formToInputs(form)).toEqual(inputs)
  })
})

describe('保本计算', () => {
  const inputs = formToInputs(SAMPLE_FORM)

  it('每月固定成本 = 六项支出 + 装修设备摊销', () => {
    expect(sumMonthlyCosts(inputs)).toBe(13000)
    expect(calcAmortization(inputs)).toBe(3000)

    const results = calculate(inputs)
    expect(results.monthlyCostSubtotal).toBe(13000)
    expect(results.amortization).toBe(3000)
    expect(results.monthlyFixedCost).toBe(16000)
  })

  it('示例毛利率 42.5% 的结果正确', () => {
    const results = calculate(inputs)

    expect(results.monthlyBreakEven).toBe(37647.06)
    expect(results.dailyBreakEven).toBe(1254.9)
    expect(results.dailyOrders).toBe(7)
    expect(results.dailyTraffic).toBe(63)
  })

  it('毛利率 40% 时：月保本 40000，日保本 1333.33', () => {
    const results = calculate(inputs)

    expect(results.at40.monthlyBreakEven).toBe(40000)
    expect(results.at40.dailyBreakEven).toBe(1333.33)
    expect(results.at40.dailyOrders).toBe(7)
    expect(results.at40.dailyTraffic).toBe(67)
  })

  it('毛利率 45% 时：月保本 35555.56，日保本 1185.19', () => {
    const results = calculate(inputs)

    expect(results.at45.monthlyBreakEven).toBe(35555.56)
    expect(results.at45.dailyBreakEven).toBe(1185.19)
    expect(results.at45.dailyOrders).toBe(6)
    expect(results.at45.dailyTraffic).toBe(60)
  })

  it('成交单数与客流向上取整，不因浮点误差多加一人', () => {
    const noCostInputs = {
      ...inputs,
      rent: 0,
      property: 0,
      utilities: 0,
      labor: 0,
      pos: 0,
      other: 0,
      decoration: 0,
      equipment: 0,
    }
    const results = calculate(noCostInputs)

    expect(results.monthlyFixedCost).toBe(0)
    expect(results.dailyOrders).toBe(0)
    expect(results.dailyTraffic).toBe(0)
  })

  it('没有任何成本输入时能识别出来', () => {
    expect(hasAnyCostInput(formToInputs(EMPTY_FORM))).toBe(false)
    expect(hasAnyCostInput(inputs)).toBe(true)
  })
})

describe('参数校验', () => {
  it('示例参数合法', () => {
    expect(validateInputs(formToInputs(SAMPLE_FORM))).toEqual({})
  })

  it('毛利率必须在 0 到 100 之间', () => {
    expect(validateInputs(formToInputs(formWith({ marginPct: '0' })))).toHaveProperty(
      'marginPct',
    )
    expect(
      validateInputs(formToInputs(formWith({ marginPct: '100' }))),
    ).toHaveProperty('marginPct')
    expect(
      validateInputs(formToInputs(formWith({ marginPct: '99.9' }))),
    ).not.toHaveProperty('marginPct')
  })

  it('租期、营业天数必须是有效整数', () => {
    expect(
      validateInputs(formToInputs(formWith({ leaseMonths: '0' }))),
    ).toHaveProperty('leaseMonths')
    expect(
      validateInputs(formToInputs(formWith({ leaseMonths: '36.5' }))),
    ).toHaveProperty('leaseMonths')
    expect(
      validateInputs(formToInputs(formWith({ businessDays: '0' }))),
    ).toHaveProperty('businessDays')
    expect(
      validateInputs(formToInputs(formWith({ businessDays: '32' }))),
    ).toHaveProperty('businessDays')
    expect(
      validateInputs(formToInputs(formWith({ businessDays: '30.5' }))),
    ).toHaveProperty('businessDays')
  })

  it('客单价、转化率必须大于 0，转化率不超过 100%', () => {
    expect(
      validateInputs(formToInputs(formWith({ avgTicket: '0' }))),
    ).toHaveProperty('avgTicket')
    expect(
      validateInputs(formToInputs(formWith({ conversionPct: '0' }))),
    ).toHaveProperty('conversionPct')
    expect(
      validateInputs(formToInputs(formWith({ conversionPct: '101' }))),
    ).toHaveProperty('conversionPct')
    expect(
      validateInputs(formToInputs(formWith({ conversionPct: '100' }))),
    ).not.toHaveProperty('conversionPct')
  })
})
