import { useCallback, useEffect, useRef, useState } from 'react'
import type { FieldKey, FormValues, SavedScenario } from './types'
import { EMPTY_FORM, SAMPLE_FORM, cloneEmptyForm } from './types'
import { inputsToForm } from './lib/calc'
import {
  loadDraft,
  loadScenarios,
  requestPersistentStorage,
  saveDraft,
  saveScenarios,
} from './lib/storage'
import { useHashRoute } from './hooks/useHashRoute'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import { BrandMark } from './components/BrandMark'
import { BottomNav } from './components/BottomNav'
import { BackIcon } from './components/Icons'
import { Toast } from './components/Toast'
import { CalculatorPage } from './pages/CalculatorPage'
import { SavedPage } from './pages/SavedPage'
import { ScenarioDetailPage } from './pages/ScenarioDetailPage'

function App() {
  const [form, setForm] = useState<FormValues>(() => ({
    ...EMPTY_FORM,
    ...(loadDraft() ?? {}),
  }))
  const [scenarios, setScenarios] = useState<SavedScenario[]>(loadScenarios)
  const [route, navigate] = useHashRoute()
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | null>(null)
  const { canInstall, install } = useInstallPrompt()

  useEffect(() => {
    saveDraft(form)
  }, [form])

  useEffect(() => {
    void requestPersistentStorage()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  useEffect(() => {
    return () => {
      if (toastTimer.current !== null) {
        window.clearTimeout(toastTimer.current)
      }
    }
  }, [])

  const notify = useCallback((message: string) => {
    setToast(message)
    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current)
    }
    toastTimer.current = window.setTimeout(() => {
      setToast(null)
      toastTimer.current = null
    }, 2800)
  }, [])

  const handleFieldChange = useCallback((key: FieldKey, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }, [])

  const handleFillExample = useCallback(() => {
    setForm({ ...SAMPLE_FORM })
    notify('已填入示例数据，可以直接修改')
  }, [notify])

  const handleReset = useCallback(() => {
    setForm(cloneEmptyForm())
    notify('已重置全部输入')
  }, [notify])

  const handleSaveScenario = useCallback(
    (scenario: SavedScenario) => {
      setScenarios((current) => {
        const next = [scenario, ...current]
        saveScenarios(next)
        return next
      })
      notify('方案已保存，可在“方案记录”中查看')
    },
    [notify],
  )

  const handleLoadScenario = useCallback(
    (scenario: SavedScenario) => {
      setForm(inputsToForm(scenario.inputs))
      navigate('#/calc')
      notify(`已载入「${scenario.name}」，可修改后重新保存`)
    },
    [navigate, notify],
  )

  const handleDeleteScenario = useCallback(
    (scenario: SavedScenario) => {
      setScenarios((current) => {
        const next = current.filter((item) => item.id !== scenario.id)
        saveScenarios(next)
        return next
      })
      navigate('#/saved')
      notify('方案已删除')
    },
    [navigate, notify],
  )

  const openScenario = useCallback(
    (id: string) => {
      navigate(`#/saved/${encodeURIComponent(id)}`)
    },
    [navigate],
  )

  const detailScenario =
    route.page === 'detail'
      ? (scenarios.find((scenario) => scenario.id === route.id) ?? null)
      : null

  return (
    <div className="app-shell">
      <header
        className={`app-header${route.page === 'detail' ? ' detail-header' : ''}`}
      >
        {route.page === 'detail' ? (
          <>
            <button
              type="button"
              className="icon-button"
              onClick={() => navigate('#/saved')}
              aria-label="返回方案记录"
            >
              <BackIcon className="icon-button-svg" />
            </button>
            <div className="detail-header-text">
              <h1>方案详情</h1>
              <p>保存时的参数与结果</p>
            </div>
            <span className="header-spacer" aria-hidden="true" />
          </>
        ) : (
          <>
            <div className="brand">
              <BrandMark className="brand-mark" />
              <div>
                <h1>服装创业助手</h1>
                <p>开店保本 · 方案存档</p>
              </div>
            </div>
            {route.page === 'saved' ? (
              <span className="header-count">{scenarios.length} 套</span>
            ) : (
              <span className="header-local">仅存本机</span>
            )}
          </>
        )}
      </header>

      <main className="app-main">
        {route.page === 'calc' ? (
          <CalculatorPage
            form={form}
            onFieldChange={handleFieldChange}
            onFillExample={handleFillExample}
            onReset={handleReset}
            onSaveScenario={handleSaveScenario}
            canInstall={canInstall}
            onInstall={install}
          />
        ) : null}

        {route.page === 'saved' ? (
          <SavedPage
            scenarios={scenarios}
            onOpen={openScenario}
            onGoCalc={() => navigate('#/calc')}
          />
        ) : null}

        {route.page === 'detail' ? (
          <ScenarioDetailPage
            scenario={detailScenario}
            onBack={() => navigate('#/saved')}
            onLoad={handleLoadScenario}
            onDelete={handleDeleteScenario}
          />
        ) : null}
      </main>

      {route.page !== 'detail' ? (
        <BottomNav
          active={route.page === 'saved' ? 'saved' : 'calc'}
          onNavigate={navigate}
        />
      ) : null}

      <Toast message={toast} />
    </div>
  )
}

export default App
