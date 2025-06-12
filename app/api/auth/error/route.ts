import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  console.error("Auth error:", error, errorDescription)

  return NextResponse.json(
    {
      error: error || "Unknown authentication error",
      errorDescription: errorDescription || "An unknown error occurred during authentication",
    },
    { status: 400 },
  )
}
