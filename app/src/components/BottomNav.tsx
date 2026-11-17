import { BookmarkIcon, CalculatorIcon } from './Icons'

interface BottomNavProps {
  active: 'calc' | 'saved'
  onNavigate: (hash: string) => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      <button
        type="button"
        className={`nav-button${active === 'calc' ? ' active' : ''}`}
        onClick={() => onNavigate('#/calc')}
        aria-current={active === 'calc' ? 'page' : undefined}
      >
        <CalculatorIcon className="nav-icon" />
        <span>保本测算</span>
      </button>
      <button
        type="button"
        className={`nav-button${active === 'saved' ? ' active' : ''}`}
        onClick={() => onNavigate('#/saved')}
        aria-current={active === 'saved' ? 'page' : undefined}
      >
        <BookmarkIcon className="nav-icon" />
        <span>方案记录</span>
      </button>
    </nav>
  )
}
