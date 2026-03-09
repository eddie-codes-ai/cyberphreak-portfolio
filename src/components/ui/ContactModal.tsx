'use client'

// --- ContactModal — cyberphreak palette, terminal contact form ---

import { useState, useEffect, useRef } from 'react'

type Status = 'idle' | 'encrypting' | 'sending' | 'sent' | 'error'

interface Props { onClose: () => void }

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'rgba(188,19,254,0.04)',
  border: '1px solid rgba(188,19,254,0.25)',
  borderRadius: 0,
  color: '#C8A8E9',
  padding: '9px 12px',
  fontSize: 11,
  fontFamily: 'var(--font-mono)',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

export default function ContactModal({ onClose }: Props) {
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [message,   setMessage]   = useState('')
  const [status,    setStatus]    = useState<Status>('idle')
  const [bootLines, setBootLines] = useState<string[]>([])
  const nameRef = useRef<HTMLInputElement>(null)

  // Boot sequence
  useEffect(() => {
    const lines = [
      '$ Initializing secure channel........... OK',
      '$ Generating 4096-bit encryption keys... OK',
      '$ Tunnel established. Transmit below.',
    ]
    let i = 0
    const iv = setInterval(() => {
      if (i < lines.length) { setBootLines(p => [...p, lines[i]]); i++ }
      else { clearInterval(iv); nameRef.current?.focus() }
    }, 380)
    return () => clearInterval(iv)
  }, [])

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !message.trim()) return
    setStatus('encrypting')
    await new Promise(r => setTimeout(r, 900))
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, message }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch { setStatus('error') }
  }

  const canSubmit = name.trim() && email.trim() && message.trim() && status === 'idle'

  const focusIn  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = '#BC13FE'
    e.target.style.boxShadow   = '0 0 10px rgba(188,19,254,0.25)'
  }
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(188,19,254,0.25)'
    e.target.style.boxShadow   = 'none'
  }

  return (
    <>
      <style>{`
        @keyframes scanH {
          0%   { transform: translateY(-100%); opacity: 0.06; }
          100% { transform: translateY(100vh); opacity: 0.06; }
        }
        ::placeholder { color: rgba(200,168,233,0.25) !important; }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(15,5,29,0.82)', backdropFilter:'blur(6px)', zIndex:200 }} />

      {/* Horizontal scan line */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:201, overflow:'hidden' }}>
        <div style={{ position:'absolute', left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(188,19,254,0.3),transparent)', animation:'scanH 4s linear infinite' }} />
      </div>

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(540px, 94vw)',
        background: 'rgba(15,5,29,0.99)',
        border: '1px solid rgba(188,19,254,0.5)',
        boxShadow: '0 0 0 1px rgba(188,19,254,0.15), 0 0 40px rgba(188,19,254,0.2), 0 0 80px rgba(0,255,231,0.08)',
        zIndex: 202,
        fontFamily: 'var(--font-mono)',
      }}>

        {/* Title bar */}
        <div style={{
          padding: '9px 14px',
          borderBottom: '1px solid rgba(188,19,254,0.2)',
          background: 'rgba(188,19,254,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {['#FF5F57','#FFBD2E','#28CA41'].map((c,i) => (
              <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c, boxShadow:`0 0 4px ${c}80` }} />
            ))}
            <span style={{ fontSize:9, color:'rgba(188,19,254,0.6)', letterSpacing:'0.2em', marginLeft:4 }}>
              secure_channel.sh
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'#00FF88', boxShadow:'0 0 5px #00FF88' }} />
            <span style={{ fontSize:8, color:'#00FF88', letterSpacing:'0.2em' }}>ENCRYPTED</span>
          </div>
        </div>

        {/* Header line */}
        <div style={{ padding:'14px 16px 4px', borderBottom:'1px solid rgba(188,19,254,0.08)' }}>
          <div style={{ marginBottom:10 }}>
            <span style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:900, color:'#00FFE7', letterSpacing:'0.05em', textShadow:'0 0 12px rgba(0,255,231,0.5)' }}>$ connect</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:14, color:'#BC13FE' }}>.</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:900, color:'#00FFE7' }}>secure</span>
            <span style={{ fontFamily:'var(--font-display)', fontSize:14, color:'rgba(200,168,233,0.5)' }}>()</span>
          </div>

          {/* Boot lines */}
          <div style={{ minHeight:58, marginBottom:10 }}>
            {bootLines.map((line, i) => (
              <div key={i} style={{
                fontSize: 10,
                letterSpacing: '0.05em',
                lineHeight: 1.9,
                color: i === bootLines.length - 1 ? '#00FFE7' : 'rgba(0,255,231,0.4)',
              }}>
                <span style={{ color: i === bootLines.length - 1 ? '#BC13FE' : 'rgba(188,19,254,0.4)' }}>▸ </span>
                {line}
              </div>
            ))}
          </div>
        </div>

        {/* Form / success */}
        {status !== 'sent' ? (
          <div style={{ padding:'14px 16px 16px' }}>

            {/* Name + Email */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
              <div>
                <label style={{ display:'block', fontSize:9, color:'rgba(188,19,254,0.6)', letterSpacing:'0.18em', marginBottom:5 }}>◈ IDENTIFIER</label>
                <input ref={nameRef} value={name} onChange={e=>setName(e.target.value)}
                  placeholder="your name" disabled={status!=='idle'}
                  style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
              <div>
                <label style={{ display:'block', fontSize:9, color:'rgba(188,19,254,0.6)', letterSpacing:'0.18em', marginBottom:5 }}>✉ RETURN_ADDR</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="your@email.com" disabled={status!=='idle'}
                  style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:9, color:'rgba(188,19,254,0.6)', letterSpacing:'0.18em', marginBottom:5 }}>▸ PAYLOAD</label>
              <textarea value={message} onChange={e=>setMessage(e.target.value)}
                placeholder="your message..." maxLength={1000} rows={5}
                disabled={status!=='idle'}
                style={{ ...inputStyle, resize:'none', lineHeight:1.65 }}
                onFocus={focusIn} onBlur={focusOut}
              />
              <div style={{ textAlign:'right', fontSize:8, color:'rgba(200,168,233,0.25)', marginTop:3, letterSpacing:'0.1em' }}>
                {message.length}/1000
              </div>
            </div>

            {/* Divider */}
            <div style={{ height:1, background:'linear-gradient(90deg,rgba(188,19,254,0.3),rgba(0,255,231,0.15),transparent)', marginBottom:14 }} />

            {/* Buttons */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
              <button onClick={handleSubmit} disabled={!canSubmit} style={{
                flex: 1,
                background: canSubmit ? 'linear-gradient(90deg,#BC13FE,#00FFE7)' : 'rgba(188,19,254,0.08)',
                border: `1px solid ${canSubmit ? 'transparent' : 'rgba(188,19,254,0.2)'}`,
                color: canSubmit ? '#0F051D' : 'rgba(200,168,233,0.3)',
                padding: '10px 0',
                fontFamily: 'var(--font-mono)',
                fontSize: 11, fontWeight: 700,
                letterSpacing: '0.12em',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                boxShadow: canSubmit ? '0 0 20px rgba(188,19,254,0.4)' : 'none',
                transition: 'all 0.15s',
              }}>
                {status === 'encrypting' && '⟳  ENCRYPTING...'}
                {status === 'sending'    && '⟳  TRANSMITTING...'}
                {status === 'idle'       && '▶  transmit()'}
                {status === 'error'      && '✕  RETRY'}
              </button>

              <button onClick={onClose} style={{
                background: 'transparent',
                border: '1px solid rgba(188,19,254,0.25)',
                color: 'rgba(200,168,233,0.4)',
                padding: '10px 20px',
                fontFamily: 'var(--font-mono)',
                fontSize: 10, letterSpacing: '0.12em',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(188,19,254,0.7)'; (e.currentTarget as HTMLElement).style.color='#C8A8E9' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(188,19,254,0.25)'; (e.currentTarget as HTMLElement).style.color='rgba(200,168,233,0.4)' }}
              >
                ABORT
              </button>
            </div>

            {status === 'error' && (
              <div style={{ marginTop:10, fontSize:9, color:'#FF4444', letterSpacing:'0.1em', textAlign:'center' }}>
                ✕ TRANSMISSION FAILED — CHECK CONNECTION AND RETRY
              </div>
            )}
          </div>

        ) : (
          /* Success */
          <div style={{ padding:'20px 16px 24px', textAlign:'center' }}>
            {[
              '▸ Encrypting payload................. DONE',
              '▸ Routing through secure tunnel...... DONE',
              '▸ Handshake confirmed................ DONE',
              '▸ Message delivered to eddie-codes-ai',
            ].map((line, i) => (
              <div key={i} style={{
                fontSize: 10, lineHeight: 2.1, letterSpacing: '0.05em',
                color: i === 3 ? '#00FFE7' : 'rgba(0,255,231,0.45)',
              }}>
                <span style={{ color: i === 3 ? '#BC13FE' : 'rgba(188,19,254,0.35)' }}>▸ </span>
                {line}
              </div>
            ))}
            <div style={{
              fontFamily: 'var(--font-retro)',
              fontSize: 36, letterSpacing: '0.25em',
              color: '#00FF88', textShadow: '0 0 20px #00FF88, 0 0 40px rgba(0,255,136,0.4)',
              margin: '18px 0',
            }}>
              TRANSMITTED
            </div>
            <button onClick={onClose} style={{
              background: 'transparent',
              border: '1px solid rgba(0,255,231,0.4)',
              color: '#00FFE7', padding: '9px 28px',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.15em',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(0,255,231,0.15)',
            }}>
              CLOSE CHANNEL
            </button>
          </div>
        )}
      </div>
    </>
  )
}