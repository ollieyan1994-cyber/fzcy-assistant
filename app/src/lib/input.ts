export function sanitizeDecimal(raw: string, maxDecimals = 2): string {
  let value = raw.replace(/[^\d.]/g, '')
  if (!value) return ''

  if (value.startsWith('.')) value = `0${value}`

  const firstDot = value.indexOf('.')
  if (firstDot !== -1) {
    const integerPart = value.slice(0, firstDot).slice(0, 9)
    const decimalPart = value
      .slice(firstDot + 1)
      .replace(/\./g, '')
      .slice(0, maxDecimals)
    return `${integerPart}.${decimalPart}`
  }

  return value.slice(0, 9)
}

export function sanitizeInteger(raw: string, maxDigits = 6): string {
  return raw.replace(/\D/g, '').slice(0, maxDigits)
}
