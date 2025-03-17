"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreditCard, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CreditCardDisplay } from "@/components/credit-card-display"
import { detectCardType } from "@/lib/card-utils"
import { useColor } from "@/contexts/ColorContext"

const formSchema = z.object({
  cardNumber: z
    .string()
    .min(13, "O número do cartão deve ter pelo menos 13 dígitos")
    .max(19, "O número do cartão deve ter no máximo 19 dígitos")
    .refine((val) => /^[0-9]+$/.test(val.replace(/\s/g, "")), "O número do cartão deve conter apenas dígitos")
    .refine((val) => {
      // Luhn algorithm for credit card validation
      const digits = val.replace(/\s/g, "").split("").map(Number).reverse()
      const sum = digits.reduce((acc, digit, idx) => {
        if (idx % 2 === 1) {
          const doubled = digit * 2
          return acc + (doubled > 9 ? doubled - 9 : doubled)
        }
        return acc + digit
      }, 0)
      return sum % 10 === 0
    }, "Número de cartão inválido"),
  cardholderName: z.string().min(3, "O nome do titular é obrigatório"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "A data de validade deve estar no formato MM/AA")
    .refine((val) => {
      const [month, year] = val.split("/")
      const expiry = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1)
      const now = new Date()
      return expiry > now
    }, "O cartão está expirado"),
  cvv: z
    .string()
    .min(3, "O CVV deve ter pelo menos 3 dígitos")
    .max(4, "O CVV deve ter no máximo 4 dígitos")
    .refine((val) => /^[0-9]+$/.test(val), "O CVV deve conter apenas dígitos"),
})

type FormValues = z.infer<typeof formSchema>

export default function CreditCardForm() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { colorScheme, setCardNumber } = useColor()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    },
  })

  const cardNumber = form.watch("cardNumber")
  const cardholderName = form.watch("cardholderName")
  const expiryDate = form.watch("expiryDate")
  const cvv = form.watch("cvv")

  const cardType = detectCardType(cardNumber.replace(/\s/g, ""))

  // Update color scheme when card number changes
  useEffect(() => {
    setCardNumber(cardNumber)
  }, [cardNumber, setCardNumber])

  function onSubmit(data: FormValues) {
    console.log(data)
    setIsSubmitted(true)
  }

  function formatCardNumber(value: string) {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  function formatExpiryDate(value: string) {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`
    }

    return value
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-center">
        <CreditCardDisplay
          cardNumber={cardNumber}
          cardholderName={cardholderName}
          expiryDate={expiryDate}
          cvv={cvv}
          cardType={cardType}
          isFlipped={isFlipped}
        />
      </div>

      <div>
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Seu cartão ainda não foi clonado!</h2>
            <p className="text-slate-600 mb-6">Tenha cuidado onde você coloca seus dados! Não foi desta vez mas nunca deve baixar a guarda. Se desconfiar de qualquer coisa, bloqueie seu cartão imediatamente, abra um Boletim de Ocorrencia e informe imediatamente para seu banco!</p>
            <Button
              onClick={() => {
                form.reset()
                setIsSubmitted(false)
              }}
              className={`bg-gradient-to-r from-${colorScheme.from} to-${colorScheme.to} hover:from-${colorScheme.from} hover:to-${colorScheme.to} text-${colorScheme.text}`}
            >
              Fazer Outra Verificação
            </Button>
          </motion.div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número do Cartão</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          inputmode="numeric"
                          placeholder="1234 5678 9012 3456"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value)
                            field.onChange(formatted)
                          }}
                          className="pl-10"
                          maxLength={19}
                        />
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cardholderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Titular</FormLabel>
                    <FormControl>
                      <Input placeholder="João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Validade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MM/AA"
                          {...field}
                          onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value)
                            field.onChange(formatted)
                          }}
                          maxLength={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123"
                          {...field}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                          maxLength={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className={`w-full bg-gradient-to-r from-${colorScheme.from} to-${colorScheme.to} hover:from-${colorScheme.from} hover:to-${colorScheme.to} text-${colorScheme.text}`}
              >
                Verificar agora!
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}

