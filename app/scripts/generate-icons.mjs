import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1F4D3F"/>
  <circle cx="256" cy="245" r="184" fill="#F6EFE3" opacity=".06"/>
  <g transform="translate(0 -70)">
    <g fill="none" stroke="#F6EFE3" stroke-width="20" stroke-linecap="round" stroke-linejoin="round">
      <path d="M256 330V252c0-32 20-52 48-52 27 0 47 20 47 46 0 28-21 44-48 52"/>
      <path d="M256 330 156 390c-13 8-7 26 9 26h182c16 0 22-18 9-26L256 330Z"/>
    </g>
    <g fill="#E39A63">
      <rect x="186" y="466" width="38" height="24" rx="10"/>
      <rect x="246" y="446" width="38" height="44" rx="10"/>
      <rect x="306" y="426" width="38" height="64" rx="10"/>
    </g>
  </g>
</svg>
`

const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1F4D3F"/>
  <g transform="translate(51.2 51.2) scale(0.8)">
    <circle cx="256" cy="245" r="184" fill="#F6EFE3" opacity=".06"/>
    <g transform="translate(0 -70)">
      <g fill="none" stroke="#F6EFE3" stroke-width="20" stroke-linecap="round" stroke-linejoin="round">
        <path d="M256 330V252c0-32 20-52 48-52 27 0 47 20 47 46 0 28-21 44-48 52"/>
        <path d="M256 330 156 390c-13 8-7 26 9 26h182c16 0 22-18 9-26L256 330Z"/>
      </g>
      <g fill="#E39A63">
        <rect x="186" y="466" width="38" height="24" rx="10"/>
        <rect x="246" y="446" width="38" height="44" rx="10"/>
        <rect x="306" y="426" width="38" height="64" rx="10"/>
      </g>
    </g>
  </g>
</svg>
`

await mkdir('public/icons', { recursive: true })

await sharp(Buffer.from(svg)).resize(192, 192).png().toFile('public/icons/icon-192.png')
await sharp(Buffer.from(svg)).resize(512, 512).png().toFile('public/icons/icon-512.png')
await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile('public/icons/maskable-512.png')
await sharp(Buffer.from(svg)).resize(180, 180).flatten({ background: '#1F4D3F' }).png().toFile('public/apple-touch-icon.png')

console.log('icons generated')
