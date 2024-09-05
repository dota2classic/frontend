
import React from 'react'

import { } from '..'

import c from './Table.module.scss'

export const Table = (props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLTableElement>, HTMLTableElement>) => {

  return (
    <table className={c.table}>
      {props.children}
    </table>
  )
}
