import { useState } from 'react'
import { skills, workflows } from '../data/skills.ts'
import type { WorkflowColor } from '../data/skills.ts'

type ColorStyles = {
  tab: string
  badge: string
  dot: string
}

const colorMap: Record<WorkflowColor, ColorStyles> = {
  blue: { tab: 'bg-blue-50 text-blue-700 border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  violet: { tab: 'bg-violet-50 text-violet-700 border-violet-200', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  amber: { tab: 'bg-amber-50 text-amber-700 border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  emerald: { tab: 'bg-emerald-50 text-emerald-700 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  rose: { tab: 'bg-rose-50 text-rose-700 border-rose-200', badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
  slate: { tab: 'bg-slate-50 text-slate-700 border-slate-200', badge: 'bg-slate-100 text-slate-700', dot: 'bg-slate-500' },
  orange: { tab: 'bg-orange-50 text-orange-700 border-orange-200', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
}

export default function SkillsGrid() {
  const [active, setActive] = useState('sales')

  const activeWorkflow = workflows.find((w) => w.id === active)!
  const c = colorMap[activeWorkflow.color]
  const filtered = skills.filter((s) => s.workflow === active)

  return (
    <section id="skills" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Skills by workflow</h2>
          <p className="mt-2 text-gray-500 text-sm">
            Browse all {skills.length} skills grouped by role. Each skill name is the slash command you type in Claude Code.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {workflows.map((w) => {
            const count = skills.filter((s) => s.workflow === w.id).length
            const wc = colorMap[w.color]
            const isActive = active === w.id
            return (
              <button
                key={w.id}
                onClick={() => setActive(w.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  isActive
                    ? `${wc.tab} shadow-sm`
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? wc.dot : 'bg-gray-300'}`}></span>
                {w.label}
                <span className={`text-xs rounded px-1 ${isActive ? wc.badge : 'bg-gray-100 text-gray-400'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <div
              key={skill.name}
              className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <code className="font-mono text-sm text-gray-900 font-medium leading-snug">
                  /{skill.name}
                </code>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {skill.type === 'agent' && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
                      agent
                    </span>
                  )}
                  <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${c.badge}`}>
                    v{skill.version}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {skill.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
