export function detectCardType(cardNumber: string): string {
  // Remove all non-digit characters
  const cleanedNumber = cardNumber.replace(/\D/g, "")

  // Visa: Starts with 4 and has 13, 16, or 19 digits
  if (/^4[0-9]{12}(?:[0-9]{3})?(?:[0-9]{3})?$/.test(cleanedNumber)) {
    return "visa"
  }

  // Mastercard: Starts with 51-55 or 2221-2720 and has 16 digits
  if (
    /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
      cleanedNumber,
    )
  ) {
    return "mastercard"
  }

  // American Express: Starts with 34 or 37 and has 15 digits
  if (/^3[47][0-9]{13}$/.test(cleanedNumber)) {
    return "amex"
  }

  // Discover: Starts with 6011, 622126-622925, 644-649, or 65 and has 16-19 digits
  if (/^6(?:011|5[0-9]{2})[0-9]{12,15}$/.test(cleanedNumber)) {
    return "discover"
  }

  // Unknown card type
  return ""
}

