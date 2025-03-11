import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ColorProvider } from "@/contexts/ColorContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Formulário de Cartão de Crédito",
  description: "Um formulário de cartão de crédito interativo",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ColorProvider>{children}</ColorProvider>
      </body>
    </html>
  )
}



import './globals.css'