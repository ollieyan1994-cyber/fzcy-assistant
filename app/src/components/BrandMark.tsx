export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      role="img"
      aria-label="服装创业助手"
    >
      <rect width="512" height="512" fill="#1F4D3F" />
      <circle cx="256" cy="245" r="184" fill="#F6EFE3" opacity="0.06" />
      <g transform="translate(0 -70)">
        <g
          fill="none"
          stroke="#F6EFE3"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M256 250c0-31 16-48 42-48 25 0 42 18 42 40 0 26-21 40-45 46-23 6-39 18-39 42" />
          <path d="M256 330 156 390c-13 8-7 26 9 26h182c16 0 22-18 9-26L256 330Z" />
        </g>
        <g fill="#E39A63">
          <rect x="186" y="466" width="38" height="24" rx="10" />
          <rect x="246" y="446" width="38" height="44" rx="10" />
          <rect x="306" y="426" width="38" height="64" rx="10" />
        </g>
      </g>
    </svg>
  )
}
