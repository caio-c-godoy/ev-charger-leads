export function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-14">
      <div className="mb-5">
        <h2 className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50/70 px-3 py-1 text-sm font-semibold text-brand-800">
          {title}
          <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-accent-500/15 px-2 py-[2px] text-[11px] font-medium text-accent-600">
            ★ Victorious
          </span>
        </h2>
        {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
      </div>
      <div className="card-glass p-6 md:p-7">{children}</div>
    </section>
  )
}
