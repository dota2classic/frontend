
import React, {PropsWithChildren} from 'react'

import {Navbar} from '..'

import c from './Layout.module.scss'
import cx from "classnames";
interface LayoutProps {
  className?: string;
}
export const Layout = ({ children, className }: PropsWithChildren<LayoutProps>) => {

  return (
    <div className={cx(c.layout, className)}>
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
