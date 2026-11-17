import type { SavedScenario } from '../types'
import {
  formatDateTime,
  formatMoney,
  formatPercent,
} from '../lib/format'
import { BookmarkIcon, ChevronRightIcon } from '../components/Icons'

interface SavedPageProps {
  scenarios: SavedScenario[]
  onOpen: (id: string) => void
  onGoCalc: () => void
}

export function SavedPage({ scenarios, onOpen, onGoCalc }: SavedPageProps) {
  return (
    <div className="page saved-page">
      <div className="page-intro">
        <div>
          <h2>方案记录</h2>
          <p>
            {scenarios.length > 0
              ? `共 ${scenarios.length} 套 · 只保存在本机`
              : '把不同房租、毛利率的假设存下来对比'}
          </p>
        </div>
      </div>

      {scenarios.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            <BookmarkIcon className="empty-icon-svg" />
          </span>
          <h3>还没有保存的方案</h3>
          <p>
            填好固定成本和毛利率，点“保存本次方案”，之后就能在这里查看和对比。
          </p>
          <button type="button" className="primary-button" onClick={onGoCalc}>
            去测算
          </button>
        </div>
      ) : (
        <>
          <div className="saved-list">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className="saved-card"
                onClick={() => onOpen(scenario.id)}
              >
                <div className="saved-card-top">
                  <div className="saved-card-title">
                    <span className="saved-name">{scenario.name}</span>
                    <span className="saved-date">
                      {formatDateTime(scenario.createdAt)}
                    </span>
                  </div>
                  <ChevronRightIcon className="saved-chevron" />
                </div>

                <div className="saved-figures">
                  <div className="saved-monthly">
                    <span>月保本销售额</span>
                    <strong>{formatMoney(scenario.results.monthlyBreakEven)}</strong>
                  </div>
                  <div className="saved-daily">
                    <span>日保本</span>
                    <strong>{formatMoney(scenario.results.dailyBreakEven)}</strong>
                  </div>
                </div>

                <div className="saved-meta">
                  <span className="tag">
                    毛利率 {formatPercent(scenario.inputs.marginPct)}
                  </span>
                  <span className="tag">
                    月固定 {formatMoney(scenario.results.monthlyFixedCost)}
                  </span>
                  <span className="tag">
                    {scenario.results.dailyOrders} 单 / {scenario.results.dailyTraffic} 人
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="list-footnote">
            方案只保存在当前手机浏览器。卸载应用或清除网站数据会一并删除。
          </p>
        </>
      )}
    </div>
  )
}
