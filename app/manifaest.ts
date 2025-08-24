import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  const name  = process.env.NEXT_PUBLIC_BRAND_NAME  || 'Victorious EV Installs'
  const short = process.env.NEXT_PUBLIC_BRAND_SHORT || 'Victorious EV'
  return {
    name,
    short_name: short,
    description: 'EV charger installation estimates and scheduling.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#208ff7',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
  }
}
