import { pipeline } from '../data/skills.js'

const colorMap = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-100', dot: 'bg-blue-500', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-100', dot: 'bg-violet-500', text: 'text-violet-700', badge: 'bg-violet-100 text-violet-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-100', dot: 'bg-rose-500', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-100', dot: 'bg-orange-500', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
          <p className="mt-2 text-gray-500 text-sm">
            Each stage hands off a structured artifact to the next. No context lost between roles.
          </p>
        </div>

        <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
          <div className="flex items-stretch gap-0 min-w-max pb-2">
            {pipeline.map((stage, i) => {
              const c = colorMap[stage.color]
              return (
                <div key={stage.id} className="flex items-center">
                  <div className={`w-48 rounded-xl border ${c.border} ${c.bg} p-4 flex flex-col gap-3`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${c.dot} flex-shrink-0`}></span>
                      <span className={`text-xs font-semibold uppercase tracking-wide ${c.text}`}>
                        {stage.role}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {stage.artifacts.map((artifact) => (
                        <span key={artifact} className={`text-xs px-1.5 py-0.5 rounded font-mono ${c.badge}`}>
                          {artifact}
                        </span>
                      ))}
                    </div>
                  </div>
                  {i < pipeline.length - 1 && (
                    <div className="flex items-center px-1">
                      <div className="w-6 h-px bg-gray-300"></div>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-gray-300">
                        <path d="M1 4h6M4 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Must-Have skills (sync-caveman, sync-grill-me, sync-grill-with-docs) install automatically for every role.
        </p>
      </div>
    </section>
  )
}
