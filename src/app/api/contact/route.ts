import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Not configured' }, { status: 503 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from:    'CYBERPHREAK <onboarding@resend.dev>',
      to:      ['hello@chaoticreative.dev'],
      replyTo: email,
      subject: `[CYBERPHREAK] New message from ${name}`,
      html: `
        <div style="background:#0F051D;color:#C8A8E9;padding:24px;font-family:monospace;font-size:13px;line-height:1.7;">
          <div style="color:#00FFE7;font-size:16px;font-weight:bold;margin-bottom:16px;">
            ◈ INCOMING TRANSMISSION — eddie-codes-ai
          </div>
          <div style="margin-bottom:8px;"><span style="color:#BC13FE;">FROM:</span> ${name}</div>
          <div style="margin-bottom:16px;"><span style="color:#BC13FE;">RETURN_ADDRESS:</span> ${email}</div>
          <div style="border:1px solid rgba(188,19,254,0.3);padding:14px;background:rgba(188,19,254,0.05);">
            <div style="color:#BC13FE;font-size:10px;letter-spacing:0.2em;margin-bottom:8px;">PAYLOAD:</div>
            <div style="white-space:pre-wrap;">${message}</div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }
}