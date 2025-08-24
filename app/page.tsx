'use client'

import LeadForm from '@/components/LeadForm'
import { Section } from '@/components/Section'
import { Testimonials } from '@/components/Testimonials' // named export
import { VideoGallery } from '@/components/VideoGallery'
import { useI18n } from '@/components/I18nProvider'
import OurStructure from '@/components/OurStructure'     // default export
import InstallPhotos from '@/components/InstallPhotos'
import Image from 'next/image'
import SeoJsonLd from '@/components/SeoJsonLd'

export default function Page() {
  const { t } = useI18n()

  return (
    <main>
      {/* JSON-LD para SEO */}
      <SeoJsonLd />

      {/* HERO */}
      <header className="heroPattern mb-10 rounded-3xl bg-gradient-to-br from-brand-900 to-brand-700 p-8 shadow-soft ring-1 ring-brand-800/40 text-white">
        <div className="grid items-center gap-6 md:grid-cols-[1.2fr_.8fr]">
          {/* Texto */}
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight [font-family:var(--font-poppins)] text-white">
              {t('title_main')}
            </h1>
            <p className="mt-4 text-lg text-white/90">{t('subtitle_main')}</p>
            <ul className="mt-4 list-disc pl-5 text-white/85 space-y-1">
              <li>{t('feature1')}</li>
              <li>{t('feature2')}</li>
              <li>{t('feature3')}</li>
            </ul>
          </div>

          {/* Logo */}
          <div className="order-1 md:order-2 relative flex items-center justify-center md:block md:relative mb-4 md:mb-0">
            <Image
              src="/logo-victorius.webp"
              alt="Victorious logo"
              width={512}
              height={512}
              priority
              sizes="(max-width: 768px) 40vw, (max-width: 1024px) 28vw, 22vw"
              className="
                pointer-events-none select-none
                h-16 sm:h-20 md:h-40 lg:h-48 w-auto drop-shadow-2xl
                md:absolute md:top-1/2 md:-translate-y-1/2
                md:right-20 lg:right-36
              "
            />
          </div>
        </div>
      </header>

      {/* Estimativa */}
      <Section title={t('section_estimate_title')} subtitle={t('section_estimate_sub')}>
        <LeadForm />
      </Section>

      {/* Fotos de instalações */}
      <Section title="Installation photos">
        <InstallPhotos />
      </Section>

      {/* Vídeos de instalações */}
      <Section title={t('section_videos')}>
        <VideoGallery />
      </Section>

      {/* Nossa estrutura (4 vídeos em 1 linha) */}
      <Section title={t('section_structure_title')} subtitle={t('section_structure_sub')}>
        <OurStructure />
      </Section>

      {/* Depoimentos */}
      <Section title={t('section_testimonials')}>
        <Testimonials />
      </Section>

      <footer className="mt-16 border-t pt-6 text-sm text-slate-200 md:text-slate-500">
        © {new Date().getFullYear()} EV Installs. {t('footer_rights')}
      </footer>
    </main>
  )
}
