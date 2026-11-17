import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from './Icons'

interface BottomSheetProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({
  open,
  title,
  description,
  onClose,
  children,
}: BottomSheetProps) {
  const titleId = useId()
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-handle" aria-hidden="true" />
        <div className="modal-head">
          <div>
            <h2 id={titleId} className="modal-title">
              {title}
            </h2>
            {description ? <p className="modal-desc">{description}</p> : null}
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="关闭"
          >
            <CloseIcon className="modal-close-icon" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
