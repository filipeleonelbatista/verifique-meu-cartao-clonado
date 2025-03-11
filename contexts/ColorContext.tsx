"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { detectCardType } from "@/lib/card-utils"

type ColorScheme = {
  from: string
  to: string
  text: string
}

type ColorContextType = {
  colorScheme: ColorScheme
  setCardNumber: (cardNumber: string) => void
}

const defaultColorScheme: ColorScheme = {
  from: "purple-500",
  to: "purple-800",
  text: "white",
}

const colorSchemes: { [key: string]: ColorScheme } = {
  default: defaultColorScheme,
  visa: { from: "blue-500", to: "blue-700", text: "white" },
  mastercard: { from: "red-500", to: "orange-500", text: "white" },
  amex: { from: "blue-400", to: "blue-600", text: "white" },
  discover: { from: "orange-400", to: "orange-600", text: "white" },
}

const ColorContext = createContext<ColorContextType>({
  colorScheme: defaultColorScheme,
  setCardNumber: () => {},
})

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme)

  const setCardNumber = (cardNumber: string) => {
    const cardType = detectCardType(cardNumber.replace(/\s/g, ""))
    setColorScheme(colorSchemes[cardType] || defaultColorScheme)
  }

  return <ColorContext.Provider value={{ colorScheme, setCardNumber }}>{children}</ColorContext.Provider>
}

export function useColor() {
  const context = useContext(ColorContext)
  if (context === undefined) {
    throw new Error("useColor must be used within a ColorProvider")
  }
  return context
}

