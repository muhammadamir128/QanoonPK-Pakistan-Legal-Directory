import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID || ''
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ''

  const configured = Boolean(clientId.trim().length > 5 && clientSecret.trim().length > 5)

  return NextResponse.json({
    configured,
    clientId: configured ? `${clientId.slice(0, 12)}...` : '',
  })
}

export async function POST(req: Request) {
  try {
    const { clientId, clientSecret } = await req.json()

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Both Google Client ID and Client Secret are required' },
        { status: 400 }
      )
    }

    const trimmedId = clientId.trim()
    const trimmedSecret = clientSecret.trim()

    process.env.GOOGLE_CLIENT_ID = trimmedId
    process.env.GOOGLE_CLIENT_SECRET = trimmedSecret

    // Save to .env file in root directory
    const envPath = path.join(process.cwd(), '.env')
    let content = ''
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf-8')
    } else {
      const examplePath = path.join(process.cwd(), '.env.example')
      if (fs.existsSync(examplePath)) {
        content = fs.readFileSync(examplePath, 'utf-8')
      }
    }

    if (content.includes('GOOGLE_CLIENT_ID=')) {
      content = content.replace(/GOOGLE_CLIENT_ID=.*/g, `GOOGLE_CLIENT_ID="${trimmedId}"`)
    } else {
      content += `\nGOOGLE_CLIENT_ID="${trimmedId}"`
    }

    if (content.includes('GOOGLE_CLIENT_SECRET=')) {
      content = content.replace(/GOOGLE_CLIENT_SECRET=.*/g, `GOOGLE_CLIENT_SECRET="${trimmedSecret}"`)
    } else {
      content += `\nGOOGLE_CLIENT_SECRET="${trimmedSecret}"`
    }

    fs.writeFileSync(envPath, content.trim() + '\n', 'utf-8')

    return NextResponse.json({
      success: true,
      message: 'Google OAuth credentials saved successfully to .env',
      configured: true,
    })
  } catch (error: any) {
    console.error('Failed to save Google OAuth credentials:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to save Google OAuth credentials' },
      { status: 500 }
    )
  }
}
