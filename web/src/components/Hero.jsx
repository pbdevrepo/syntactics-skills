export default function Hero() {
  return (
    <section className="pt-20 pb-16 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Claude Code skills for every role
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
          AI-powered workflow skills{' '}
          <span className="text-slate-500">for every role on the team</span>
        </h1>
        <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
          Syntactics Skills are Claude Code agents that guide each team member through their phase of the project delivery pipeline -
          from Sales discovery through QA sign-off. Each skill reads the previous artifact and produces the next one.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <a
            href="#skills"
            className="inline-flex items-center px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
          >
            Browse Skills
          </a>
          <a
            href="#install"
            className="inline-flex items-center px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Install Guide
          </a>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">25</div>
            <div className="text-xs text-gray-500 mt-0.5">Total skills</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">7</div>
            <div className="text-xs text-gray-500 mt-0.5">Workflows</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">6</div>
            <div className="text-xs text-gray-500 mt-0.5">Team roles</div>
          </div>
        </div>
      </div>
    </section>
  )
}
