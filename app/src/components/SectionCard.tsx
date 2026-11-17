import type { ReactNode } from 'react'

interface SectionCardProps {
  title: string
  subtitle?: string
  tag?: string
  children: ReactNode
}

export function SectionCard({
  title,
  subtitle,
  tag,
  children,
}: SectionCardProps) {
  return (
    <section className="section-card">
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {tag ? <span className="section-tag">{tag}</span> : null}
      </div>
      {children}
    </section>
  )
}
