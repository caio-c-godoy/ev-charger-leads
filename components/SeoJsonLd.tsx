'use client'
import Script from 'next/script'

export default function SeoJsonLd(){
  const base  = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/,'') // ex: https://victoriouscomp.com
  const name  = process.env.NEXT_PUBLIC_BRAND_NAME  || 'Victorious EV Installs'
  const phone = process.env.NEXT_PUBLIC_BRAND_PHONE || ''
  const logo  = `${base || ''}/static/img/logo/logo-victorius.webp` // ajuste se seu logo estiver em outro caminho

  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': base ? `${base}#org` : undefined,
    name,
    url: base || undefined,
    telephone: phone || undefined,
    logo: { '@type': 'ImageObject', url: logo }
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': base ? `${base}#website` : undefined,
    url: base || undefined,
    name,
    publisher: base ? { '@id': `${base}#org` } : undefined,
    potentialAction: base ? {
      '@type': 'SearchAction',
      target: `${base}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    } : undefined
  }

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': base ? `${base}#ev-service` : undefined,
    name: 'EV Charger Installation',
    serviceType: 'EV Charger Installation',
    provider: base ? { '@id': `${base}#org` } : { '@type': 'Organization', name },
    areaServed: 'Local',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      // Preço indicativo (opcional). Ajuste se quiser expor uma "partir de".
      price: 'From 580',
      availability: 'https://schema.org/InStock'
    }
  }

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Which photos should I send?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Send a straight-on photo of the open electrical panel and a photo of the installation spot.'
        }
      },
      {
        '@type': 'Question',
        name: 'How is the estimate calculated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Materials include wire at $12/ft, a $45 breaker and $7 per 8ft of tube. Labor starts at $580 up to 10ft and then increases according to distance and selected professional.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can the price change on site?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It may vary slightly if extra materials, route adjustments or local code requirements apply. Any difference is confirmed before proceeding.'
        }
      }
    ]
  }

  return (
    <>
      <Script id="ld-org"     type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <Script id="ld-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <Script id="ld-service" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <Script id="ld-faq"     type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}
