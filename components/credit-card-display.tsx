"use client"

import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"
import { CardLogo } from "./card-logo"
import { useColor } from "@/contexts/ColorContext"

interface CreditCardDisplayProps {
  cardNumber: string
  cardholderName: string
  expiryDate: string
  cvv: string
  cardType: string
  isFlipped: boolean
}

export function CreditCardDisplay({
  cardNumber,
  cardholderName,
  expiryDate,
  cvv,
  cardType,
  isFlipped,
}: CreditCardDisplayProps) {
  const { colorScheme } = useColor()

  // Format card number for display
  const formattedCardNumber = cardNumber || "•••• •••• •••• ••••"

  // Format cardholder name for display
  const formattedCardholderName = cardholderName || "SEU NOME"

  // Format expiry date for display
  const formattedExpiryDate = expiryDate || "MM/AA"

  // Get card background based on card type
  const getCardBackground = () => {
    switch (cardType) {
      case "visa":
        return "from-blue-500 to-blue-700"
      case "mastercard":
        return "from-red-500 to-orange-500"
      case "amex":
        return "from-blue-400 to-blue-600"
      case "discover":
        return "from-orange-400 to-orange-600"
      default:
        return "from-purple-500 to-purple-800" // Changed to purple gradient
    }
  }

  return (
    <div className="w-full max-w-[380px] h-[240px] relative" style={{ perspective: "1000px" }}>
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full rounded-xl p-6 shadow-lg bg-gradient-to-br from-${colorScheme.from} to-${colorScheme.to} text-${colorScheme.text}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            {(cardType === "visa" || cardType === "mastercard") && (
              <div className="absolute top-6 right-6 w-16 h-16">
                <CardLogo cardType={cardType} />
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="text-lg font-mono tracking-wider">{formattedCardNumber}</div>
          </div>

          <div className="mt-6 flex justify-between">
            <div>
              <div className="text-xs opacity-80">TITULAR DO CARTÃO</div>
              <div className="font-medium uppercase tracking-wide">{formattedCardholderName}</div>
            </div>

            <div>
              <div className="text-xs opacity-80">VALIDADE</div>
              <div className="font-medium">{formattedExpiryDate}</div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={`absolute w-full h-full rounded-xl shadow-lg bg-gradient-to-br from-${colorScheme.from} to-${colorScheme.to} text-${colorScheme.text}`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="h-12 bg-black/30 mt-6"></div>

          <div className="px-6 mt-4">
            <div className="flex justify-end items-center">
              <div className="bg-white/80 text-slate-800 px-2 py-2 rounded w-16 text-right">
                <span className="font-mono">{cvv || "•••"}</span>
              </div>
            </div>

            <div className="mt-6 text-xs opacity-80 text-center">
              <p>Este cartão é propriedade do banco emissor.</p>
              <p>O uso não autorizado é proibido.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

