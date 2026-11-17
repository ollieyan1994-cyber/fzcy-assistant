import { EMPTY_FORM, type FieldKey, type FormValues, type SavedScenario } from '../types'

const SCENARIOS_KEY = 'fzcy.scenarios.v1'
const DRAFT_KEY = 'fzcy.draft.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isSavedScenario(value: unknown): value is SavedScenario {
  if (!isRecord(value)) return false
  if (
    typeof value.id !== 'string' ||
    typeof value.name !== 'string' ||
    typeof value.createdAt !== 'number'
  ) {
    return false
  }

  const inputs = value.inputs
  const results = value.results
  if (!isRecord(inputs) || !isRecord(results)) return false

  return (
    typeof inputs.marginPct === 'number' &&
    typeof inputs.rent === 'number' &&
    typeof inputs.leaseMonths === 'number' &&
    typeof results.monthlyBreakEven === 'number' &&
    typeof results.dailyBreakEven === 'number' &&
    typeof results.monthlyFixedCost === 'number'
  )
}

export function loadScenarios(): SavedScenario[] {
  try {
    const raw = localStorage.getItem(SCENARIOS_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter(isSavedScenario)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 200)
  } catch {
    return []
  }
}

export function saveScenarios(scenarios: SavedScenario[]): void {
  try {
    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios))
  } catch {
    // 隐私模式或存储空间不足时静默失败，界面仍可继续计算。
  }
}

export function loadDraft(): Partial<FormValues> | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return null

    const draft: Partial<FormValues> = {}
    for (const key of Object.keys(EMPTY_FORM) as FieldKey[]) {
      const value = parsed[key]
      if (typeof value === 'string') draft[key] = value
    }
    return draft
  } catch {
    return null
  }
}

export function saveDraft(form: FormValues): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
  } catch {
    // 忽略存储失败。
  }
}

export function createScenarioId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export async function requestPersistentStorage(): Promise<void> {
  try {
    if (navigator.storage?.persist) {
      await navigator.storage.persist()
    }
  } catch {
    // 浏览器不支持时忽略。
  }
}
