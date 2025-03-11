import type React from "react"
import Image from 'next/image';

import VisaLogo from '@/assets/visa-svgrepo-com.svg';
import MastercardLogo from '@/assets/mc_vrt_pos.svg';

interface CardLogoProps {
  cardType: string
}

export const CardLogo: React.FC<CardLogoProps> = ({ cardType }) => {
  switch (cardType) {
    case "visa":
      return <Image src={VisaLogo} alt="Visa Logo" />;
    case "mastercard":
      return <Image src={MastercardLogo} alt="Mastercard Logo" />;
    default:
      return null
  }
}