import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MediScan IA — Diagnóstico médico asistido por IA',
  description: 'Segunda opinión diagnóstica por imagen para clínicas de Latinoamérica. Análisis en minutos, validado por especialistas.',
  openGraph: {
    title: 'MediScan IA',
    description: 'Diagnóstico médico por imagen asistido por IA para LATAM',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
