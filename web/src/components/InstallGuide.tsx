import { useState } from 'react'
import { roleMapping } from '../data/skills.ts'

const winCommand = `irm https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.ps1 | iex`
const macCommand = `curl -fsSL https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.sh | bash`

const winSpecific = `$url = "https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.ps1"
& ([scriptblock]::Create((irm $url))) -Workflow sales,ba`

const macSpecific = `curl -fsSL https://raw.githubusercontent.com/pbdevrepo/syntactics-skills/main/scripts/install.sh | bash -s -- --workflow sales --workflow ba`

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="flex-shrink-0 text-xs text-gray-400 hover:text-gray-200 transition-colors px-2 py-1 rounded hover:bg-white/10"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="rounded-lg bg-slate-900 overflow-hidden">
      {label && (
        <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-700 flex items-center justify-between">
          <span>{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      <div className="flex items-start justify-between gap-2 p-4">
        <pre className="font-mono text-sm text-slate-200 whitespace-pre-wrap break-all flex-1">{code}</pre>
        {!label && <CopyButton text={code} />}
      </div>
    </div>
  )
}

export default function InstallGuide() {
  const [platform, setPlatform] = useState<'windows' | 'mac'>('windows')

  return (
    <section id="install" className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Install guide</h2>
          <p className="mt-2 text-gray-500 text-sm">
            Zero dependencies. Run one command, select your workflows, and skills are ready in Claude Code.
          </p>
        </div>

        {/* Step 1 */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 bg-slate-900 text-white text-xs rounded-full flex items-center justify-center font-bold">1</span>
            Find your role
          </h3>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600">Your role</th>
                  <th className="text-left px-4 py-2.5 font-medium text-gray-600">Select these workflows</th>
                </tr>
              </thead>
              <tbody>
                {roleMapping.map((row, i) => (
                  <tr key={row.role} className={i < roleMapping.length - 1 ? 'border-b border-gray-50' : ''}>
                    <td className="px-4 py-3 text-gray-700 font-medium">{row.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {row.workflows.map((w) => (
                          <code key={w} className="text-xs font-mono bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                            {w}
                          </code>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 2 */}
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 bg-slate-900 text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
            Run the install script
          </h3>

          {/* Platform toggle */}
          <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg w-fit">
            {(['windows', 'mac'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                  platform === p
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p === 'windows' ? 'Windows (PowerShell)' : 'Mac / Linux'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-xs text-gray-500">Interactive install - prompts you to select workflows:</p>
            <CodeBlock code={platform === 'windows' ? winCommand : macCommand} />

            <p className="text-xs text-gray-500 mt-4">Or install specific workflows directly (e.g. sales + ba):</p>
            <CodeBlock
              code={platform === 'windows' ? winSpecific : macSpecific}
              label={platform === 'windows' ? 'PowerShell' : 'Bash'}
            />
          </div>
        </div>

        {/* Step 3 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-5 h-5 bg-slate-900 text-white text-xs rounded-full flex items-center justify-center font-bold">3</span>
            Verify the install
          </h3>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-500 mb-4">
              Open any Claude Code session and type:
            </p>
            <CodeBlock code="/sync-caveman" />
            <p className="text-xs text-gray-400 mt-3">
              If the caveman communication mode activates, all must-have skills are installed and working correctly.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
