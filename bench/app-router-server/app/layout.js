import * as React from 'react'
import { Analytics } from '@vercel/analytics/next'

export default function Root({ children }) {
  return (
    <html>
      <head></head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
