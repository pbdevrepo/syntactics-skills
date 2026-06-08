export default function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h6M2 7h8M2 10.5h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-medium text-gray-500">Syntactics Skills</span>
          <span>- Internal reference</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/pbdevrepo/syntactics-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            GitHub
          </a>
          <span>Syntactics Inc.</span>
        </div>
      </div>
    </footer>
  )
}
