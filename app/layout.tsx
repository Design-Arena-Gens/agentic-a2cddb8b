import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Correo - Gestor de Emails',
  description: 'Aplicación de gestión de correos electrónicos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
