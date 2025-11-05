'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Force client-side rendering
    document.body.classList.add('client-loaded')
  }, [])

  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  )
}
