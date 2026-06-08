export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-slate-900 rounded flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h6M2 7h8M2 10.5h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-semibold text-gray-900 text-sm">Syntactics Skills</span>
          <span className="text-xs text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded">Internal</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-gray-500">
          <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
          <a href="#skills" className="hover:text-gray-900 transition-colors">Skills</a>
          <a href="#install" className="hover:text-gray-900 transition-colors">Install</a>
          <a
            href="https://github.com/pbdevrepo/syntactics-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
