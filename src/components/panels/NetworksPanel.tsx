'use client'

// --- NetworksPanel — eddie-codes-ai tool activity feed, aggressive tone ---

import { useEffect, useRef, useState } from 'react'

// -----------------------------------------------------------
// LOG TYPES
// -----------------------------------------------------------
type LogTool    = 'NMAP' | 'WIRESHARK' | 'METASPLOIT' | 'BURPSUITE' | 'SSH' | 'NMAP' | 'PYTHON'
type LogResult  = 'VULN_DETECTED' | 'EXPLOIT_OK' | 'PORT_OPEN' | 'HOSTS_FOUND' |
                  'INJECTING' | 'SNIFFING' | 'BYPASS_OK' | 'SHELL_GAINED' |
                  'SCAN_DONE' | 'TIMEOUT' | 'CONN_RESET' | 'FILTERED'

interface LogLine {
  id:        number
  tool:      string
  action:    string
  target:    string
  result:    LogResult
  extra:     string
  timestamp: string
  color:     string
}

// -----------------------------------------------------------
// DATA POOLS
// -----------------------------------------------------------
const IP_RANGES = ['192.168.1', '10.0.0', '172.16.0']
const randomIP  = () => `${IP_RANGES[Math.floor(Math.random() * IP_RANGES.length)]}.${Math.floor(Math.random() * 254) + 1}`
const randomPort = () => [21, 22, 23, 25, 53, 80, 443, 445, 3306, 3389, 8080, 8443][Math.floor(Math.random() * 12)]

function ts() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`
}

// Weighted pool — aggressive bias
const LOG_TEMPLATES: Array<() => Omit<LogLine, 'id' | 'timestamp'>> = [
  // NMAP — scan results
  () => ({ tool: 'NMAP', action: 'SCAN',     target: `${randomIP()}/24`,         result: 'HOSTS_FOUND',   extra: `HOSTS: ${Math.floor(Math.random()*20)+4}`,           color: '#00FFE7' }),
  () => ({ tool: 'NMAP', action: 'PROBE',    target: `${randomIP()}:${randomPort()}`, result: 'PORT_OPEN',     extra: `SYN_ACK`,                                       color: '#00FFE7' }),
  () => ({ tool: 'NMAP', action: 'VULN',     target: `${randomIP()}:445`,         result: 'VULN_DETECTED', extra: `CVE-2017-0144`,                                    color: '#FF4444' }),
  () => ({ tool: 'NMAP', action: 'OS_DETECT',target: `${randomIP()}`,             result: 'SCAN_DONE',     extra: `LINUX_KERNEL_5.x`,                                 color: '#00FFE7' }),
  () => ({ tool: 'NMAP', action: 'PROBE',    target: `${randomIP()}:3306`,        result: 'VULN_DETECTED', extra: `MYSQL_EXPOSED`,                                    color: '#FF4444' }),

  // WIRESHARK — packet capture
  () => ({ tool: 'WIRESHARK', action: 'SNIFF',   target: `eth0`,               result: 'SNIFFING',      extra: `PKT/S: ${Math.floor(Math.random()*800)+200}`,        color: '#BC13FE' }),
  () => ({ tool: 'WIRESHARK', action: 'CAPTURE', target: `${randomIP()}:80`,   result: 'VULN_DETECTED', extra: `PLAINTEXT_CREDS`,                                    color: '#FF4444' }),
  () => ({ tool: 'WIRESHARK', action: 'FILTER',  target: `wlan0`,              result: 'SNIFFING',      extra: `ARP_SPOOF_DETECTED`,                                 color: '#FF00FF' }),
  () => ({ tool: 'WIRESHARK', action: 'DECODE',  target: `${randomIP()}:53`,   result: 'VULN_DETECTED', extra: `DNS_TUNNEL_TRAFFIC`,                                 color: '#FF4444' }),
  () => ({ tool: 'WIRESHARK', action: 'CAPTURE', target: `${randomIP()}:443`,  result: 'SNIFFING',      extra: `TLS_HANDSHAKE_INTERCEPTED`,                          color: '#FF00FF' }),

  // METASPLOIT — exploitation
  () => ({ tool: 'METASPLOIT', action: 'PROBE',   target: `${randomIP()}:445`, result: 'VULN_DETECTED', extra: `MS17-010_ETERNALBLUE`,                               color: '#FF4444' }),
  () => ({ tool: 'METASPLOIT', action: 'EXPLOIT', target: `${randomIP()}:22`,  result: 'SHELL_GAINED',  extra: `UID=ROOT`,                                           color: '#FF0000' }),
  () => ({ tool: 'METASPLOIT', action: 'PAYLOAD', target: `${randomIP()}`,     result: 'EXPLOIT_OK',    extra: `METERPRETER_SESSION_${Math.floor(Math.random()*9)+1}`, color: '#FF4444' }),
  () => ({ tool: 'METASPLOIT', action: 'PIVOT',   target: `${randomIP()}`,     result: 'EXPLOIT_OK',    extra: `LATERAL_MOVE_SUCCESS`,                               color: '#FF4444' }),
  () => ({ tool: 'METASPLOIT', action: 'SCAN',    target: `${randomIP()}:3389`,result: 'VULN_DETECTED', extra: `RDP_BLUEKEEP_CVE-2019-0708`,                         color: '#FF4444' }),

  // BURP SUITE — web attacks
  () => ({ tool: 'BURPSUITE', action: 'FUZZ',      target: `${randomIP()}:80/login`, result: 'INJECTING',    extra: `SQLI_PAYLOAD_${Math.floor(Math.random()*50)+1}`, color: '#FFE600' }),
  () => ({ tool: 'BURPSUITE', action: 'INTERCEPT', target: `${randomIP()}:443`,      result: 'BYPASS_OK',    extra: `AUTH_TOKEN_FORGED`,                               color: '#FF4444' }),
  () => ({ tool: 'BURPSUITE', action: 'SCAN',      target: `${randomIP()}:8080`,     result: 'VULN_DETECTED',extra: `XSS_REFLECTED`,                                   color: '#FFE600' }),
  () => ({ tool: 'BURPSUITE', action: 'REPEAT',    target: `${randomIP()}:443/api`,  result: 'BYPASS_OK',    extra: `IDOR_EXPLOITED`,                                   color: '#FF4444' }),
  () => ({ tool: 'BURPSUITE', action: 'INTRUDER',  target: `${randomIP()}:80/admin`, result: 'INJECTING',    extra: `BRUTE_FORCE_RUNNING`,                              color: '#FFE600' }),

  // SSH — access
  () => ({ tool: 'SSH', action: 'CONNECT', target: `${randomIP()}:22`,  result: 'CONN_RESET',    extra: `HOST_KEY_CHANGED`,                                           color: '#FF4444' }),
  () => ({ tool: 'SSH', action: 'TUNNEL',  target: `${randomIP()}:22`,  result: 'EXPLOIT_OK',    extra: `PORT_FWD_${randomPort()}>>${randomPort()}`,                  color: '#00FFE7' }),
  () => ({ tool: 'SSH', action: 'BRUTE',   target: `${randomIP()}:22`,  result: 'SHELL_GAINED',  extra: `USER=admin PASS=CRACKED`,                                    color: '#FF0000' }),

  // PYTHON — custom scripts
  () => ({ tool: 'PYTHON', action: 'SCRIPT',   target: `arp_spoof.py`,    result: 'EXPLOIT_OK',    extra: `GATEWAY_POISONED`,                                         color: '#00FF88' }),
  () => ({ tool: 'PYTHON', action: 'SCANNER',  target: `port_scan.py`,    result: 'SCAN_DONE',     extra: `OPEN: ${Math.floor(Math.random()*8)+2} PORTS`,             color: '#00FF88' }),
  () => ({ tool: 'PYTHON', action: 'SNIFFER',  target: `pkt_capture.py`,  result: 'SNIFFING',      extra: `IFACE=eth0 FILTER=tcp`,                                    color: '#00FF88' }),
  () => ({ tool: 'PYTHON', action: 'EXFIL',    target: `dns_tunnel.py`,   result: 'EXPLOIT_OK',    extra: `BYTES_SENT: ${Math.floor(Math.random()*900)+100}`,          color: '#00FF88' }),
]

// Result color map
const RESULT_COLOR: Record<string, string> = {
  VULN_DETECTED:  '#FF4444',
  EXPLOIT_OK:     '#FF4444',
  SHELL_GAINED:   '#FF0000',
  BYPASS_OK:      '#FF4444',
  INJECTING:      '#FFE600',
  SNIFFING:       '#BC13FE',
  PORT_OPEN:      '#00FFE7',
  HOSTS_FOUND:    '#00FFE7',
  SCAN_DONE:      '#00FF88',
  TIMEOUT:        '#666',
  CONN_RESET:     '#FF4444',
  FILTERED:       '#888',
}

// Tool abbreviation colors
const TOOL_COLOR: Record<string, string> = {
  NMAP:       '#00FFE7',
  WIRESHARK:  '#BC13FE',
  METASPLOIT: '#FF4444',
  BURPSUITE:  '#FFE600',
  SSH:        '#00FFE7',
  PYTHON:     '#00FF88',
}

let logId = 0
function generateLog(): LogLine {
  const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
  const base     = template()
  return { ...base, id: ++logId, timestamp: ts() }
}

// -----------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------
export default function NetworksPanel() {
  const [logs, setLogs]       = useState<LogLine[]>([])
  const bottomRef             = useRef<HTMLDivElement>(null)
  const [count, setCount]     = useState(0)
  const [threats, setThreats] = useState(0)

  // Seed initial logs on client only — avoids SSR hydration mismatch
  useEffect(() => {
    setLogs(Array.from({ length: 8 }, generateLog))
  }, [])

  useEffect(() => {
    // Vary interval — aggressive activity bursts
    let timeout: ReturnType<typeof setTimeout>

    function scheduleNext() {
      const delay = 300 + Math.random() * 600
      timeout = setTimeout(() => {
        const newLog = generateLog()
        setLogs(prev => {
          const next = [...prev, newLog]
          return next.length > 28 ? next.slice(-28) : next
        })
        setCount(c => c + 1)
        if (['VULN_DETECTED','EXPLOIT_OK','SHELL_GAINED','BYPASS_OK'].includes(newLog.result)) {
          setThreats(t => t + 1)
        }
        scheduleNext()
      }, delay)
    }

    scheduleNext()
    return () => clearTimeout(timeout)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'rgba(15,5,29,0.92)',
      border: '1px solid rgba(188,19,254,0.35)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'var(--font-mono)',
    }}>
      {/* Header */}
      <div style={{
        padding: '7px 10px',
        borderBottom: '1px solid rgba(188,19,254,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#FF00FF', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700 }}>[[</span>
          <span style={{ color: '#C8A8E9', fontSize: 10, letterSpacing: '0.2em' }}>NETWORKS</span>
          <span style={{ color: '#FF00FF', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700 }}>]]</span>
          {/* Live dot */}
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF4444', boxShadow: '0 0 6px #FF4444', animation: 'coreSpin 1s linear infinite' }} />
          <span style={{ fontSize: 8, color: '#FF4444', letterSpacing: '0.15em' }}>LIVE</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 8, color: 'rgba(200,168,233,0.4)', letterSpacing: '0.1em' }}>
            TOTAL: <span style={{ color: '#00FFE7' }}>{count}</span>
          </span>
          <span style={{ fontSize: 8, color: 'rgba(200,168,233,0.4)', letterSpacing: '0.1em' }}>
            THREATS: <span style={{ color: '#FF4444' }}>{threats}</span>
          </span>
        </div>
      </div>

      {/* Log stream */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '6px 0',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(188,19,254,0.3) transparent',
      }}>
        {logs.map(log => (
          <div
            key={log.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '44px 80px 68px 1fr 1fr',
              gap: 4,
              padding: '2px 10px',
              fontSize: 9,
              lineHeight: 1.7,
              borderBottom: '1px solid rgba(188,19,254,0.04)',
              transition: 'background 0.3s',
            }}
          >
            {/* Timestamp */}
            <span style={{ color: 'rgba(200,168,233,0.35)', fontSize: 8 }}>{log.timestamp}</span>

            {/* Tool */}
            <span style={{
              color: TOOL_COLOR[log.tool] ?? '#C8A8E9',
              textShadow: `0 0 6px ${TOOL_COLOR[log.tool] ?? '#C8A8E9'}60`,
              letterSpacing: '0.08em',
              fontWeight: 700,
              fontSize: 9,
            }}>
              [{log.tool}]
            </span>

            {/* Action */}
            <span style={{ color: 'rgba(200,168,233,0.6)', letterSpacing: '0.08em', fontSize: 8 }}>
              {log.action}
            </span>

            {/* Target */}
            <span style={{ color: 'rgba(200,168,233,0.45)', fontSize: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {log.target}
            </span>

            {/* Result + extra */}
            <span style={{
              color: RESULT_COLOR[log.result] ?? '#C8A8E9',
              textShadow: `0 0 6px ${RESULT_COLOR[log.result] ?? '#C8A8E9'}60`,
              fontSize: 8,
              letterSpacing: '0.06em',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {log.result} <span style={{ color: 'rgba(200,168,233,0.35)' }}>{log.extra}</span>
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Footer status bar */}
      <div style={{
        flexShrink: 0,
        padding: '5px 10px',
        borderTop: '1px solid rgba(188,19,254,0.15)',
        display: 'flex', gap: 12, alignItems: 'center',
      }}>
        {(['NMAP','WIRESHARK','METASPLOIT','BURPSUITE'] as const).map(tool => (
          <div key={tool} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: TOOL_COLOR[tool], boxShadow: `0 0 4px ${TOOL_COLOR[tool]}` }} />
            <span style={{ fontSize: 7, color: `${TOOL_COLOR[tool]}99`, letterSpacing: '0.1em' }}>{tool}</span>
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 7, color: 'rgba(200,168,233,0.25)', letterSpacing: '0.1em' }}>
          eddie-codes-ai · LOCAL MODE
        </span>
      </div>
    </div>
  )
}