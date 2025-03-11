"use client"

import CreditCardForm from "@/components/credit-card-form"
import { useColor } from "@/contexts/ColorContext"

export default function Home() {
  const { colorScheme } = useColor()

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-${colorScheme.from}/10 to-${colorScheme.to}/10`}
    >
      <div className="w-full max-w-4xl">
        <h1 className={`text-4xl font-bold text-center mb-8 text-${colorScheme.from}`}>Verifique se meu cartão foi clonado</h1>
        <div className="w-full flex flex-col items-center">
          <p className={`text-sm max-w-96 text-center mb-8 text-gray-800`}>
            As vezes não temos certeza se nosso cartão está clonado, e para isso podemos usar o site para verificar se o cartão foi clonado de maneira segura.
          </p>
        </div>
        <CreditCardForm />
      </div>
    </main>
  )
}

