'use client'

// --- Header — logo, nav links, hero name block ---

const NAV_LINKS = [
  { label: 'NETWORKS',    href: '#networks'    },
  { label: 'CODE',        href: '#code'        },
  { label: 'SECURITY',    href: '#security'    },
  { label: 'EXPERIMENTS', href: '#experiments' },
]

export default function Header() {
  return (
    <header
      className="flex items-center justify-between px-6 py-3 shrink-0"
      style={{
        borderBottom: '1px solid rgba(188,19,254,0.3)',
        background: 'rgba(15,5,29,0.7)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
        position: 'relative',
      }}
    >
      {/* --- Logo --- */}
      <div className="flex items-center gap-3">
        <span
          className="font-display font-black text-lg tracking-widest logo-pulse select-none"
          style={{ color: '#BC13FE', letterSpacing: '0.25em' }}
        >
          CYBER<span style={{ color: '#FF00FF' }}>PHREAK</span>
        </span>
        <span
          className="font-mono text-xs"
          style={{ color: 'rgba(188,19,254,0.5)', letterSpacing: '0.1em' }}
        >
          v0.9.4-ALPHA
        </span>
      </div>

      {/* --- Nav --- */}
      <nav className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="font-mono text-xs tracking-widest transition-all duration-150 relative group select-none"
            style={{ color: '#C8A8E9', textDecoration: 'none', letterSpacing: '0.18em' }}
          >
            {label}
            {/* Cyan underline on hover */}
            <span
              className="absolute left-0 -bottom-0.5 h-px w-0 group-hover:w-full transition-all duration-200"
              style={{ background: '#00FFE7', boxShadow: '0 0 6px #00FFE7' }}
            />
          </a>
        ))}
      </nav>

      {/* --- Hero name block --- */}
      <div className="flex flex-col items-end">
        <span
          className="font-display font-bold text-xs tracking-widest"
          style={{ color: '#00FFE7', letterSpacing: '0.3em' }}
        >
          CHAOTIC CREATIVE
        </span>
        <span
          className="font-mono text-xs"
          style={{ color: 'rgba(200,168,233,0.5)', letterSpacing: '0.12em' }}
        >
          NETWORK_ENGINEER · SEC_RESEARCHER
        </span>
      </div>
    </header>
  )
}