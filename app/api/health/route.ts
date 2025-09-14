import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "LEGACY API is working",
    timestamp: new Date().toISOString()
  })
}
