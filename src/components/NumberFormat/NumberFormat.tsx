
import React from 'react'

import { } from '..'

import c from './NumberFormat.module.scss'

interface INumberFormatProps {
  number: number;
}

export const NumberFormat: React.FC<INumberFormatProps> = ({ number }) => {
  return (
    <>{new Intl.NumberFormat("ru").format(number)}</>
  )
}

