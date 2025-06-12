"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export function AuthErrorContent() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [errorDescription, setErrorDescription] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    const errorDescParam = searchParams.get("error_description")

    setError(errorParam || "Unknown authentication error")
    setErrorDescription(errorDescParam || "An unknown error occurred during authentication")
  }, [searchParams])

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
      <p className="font-medium">{error}</p>
      {errorDescription && <p className="text-sm mt-1">{errorDescription}</p>}
    </div>
  )
}
