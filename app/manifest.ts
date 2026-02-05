import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Smart E-Waste Bin System',
    short_name: 'EcoRecycle',
    description: 'AI-powered e-waste recycling with rewards and environmental impact tracking',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFDF5',
    theme_color: '#f9a406',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['productivity', 'utilities', 'lifestyle'],
    screenshots: [
      {
        src: '/screenshots/mobile-home.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Home screen showing nearby recycling bins'
      },
      {
        src: '/screenshots/mobile-scanner.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'AI scanner detecting electronic devices'
      },
      {
        src: '/screenshots/desktop-dashboard.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Admin dashboard with bin monitoring'
      }
    ],
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      }
    ],
    shortcuts: [
      {
        name: 'Scan Device',
        short_name: 'Scan',
        description: 'Quickly scan an electronic device for recycling',
        url: '/scanner',
        icons: [{ src: '/icons/scan-shortcut.png', sizes: '96x96' }]
      },
      {
        name: 'Find Bins',
        short_name: 'Find',
        description: 'Find nearby e-waste recycling bins',
        url: '/',
        icons: [{ src: '/icons/map-shortcut.png', sizes: '96x96' }]
      },
      {
        name: 'My Impact',
        short_name: 'Impact',
        description: 'View your environmental impact',
        url: '/impact',
        icons: [{ src: '/icons/impact-shortcut.png', sizes: '96x96' }]
      }
    ]
  }
}