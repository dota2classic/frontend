
import React from 'react'

import { } from '..'
import formatDuration from "format-duration";


interface IDurationProps {
  duration: number;
}

export const Duration: React.FC<IDurationProps> = ({ duration }) => {
  return (
    <>
      {formatDuration(duration * 1000)}
    </>
  )
}

