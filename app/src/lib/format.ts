const pad2 = (value: number): string => String(value).padStart(2, '0')

export function formatMoney(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '—'
  return `¥${value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

export function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return '—'
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatPercent(value: number, decimals = 1): string {
  if (!Number.isFinite(value)) return '—'
  const fixed = Number(value.toFixed(decimals))
  return `${fixed}%`
}

export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  return `${date.getFullYear()}/${pad2(date.getMonth() + 1)}/${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

export function formatShortDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

export function defaultScenarioName(timestamp = Date.now()): string {
  return `保本方案 · ${formatShortDateTime(timestamp)}`
}
