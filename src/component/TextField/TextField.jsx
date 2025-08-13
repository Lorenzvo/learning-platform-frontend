import React from 'react'
import './TextField.css' // optional

/**
 * Minimal TextField. A11y-friendly with label support.
 * Props:
 * - placeholder: string
 * - type: "text" | "password" | "email" ...
 * - variant: "outlined" | "filled" (affects CSS only; optional)
 */
export const TextField = ({ placeholder, type = 'text', variant = 'outlined', ...rest }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`textfield ${variant === 'outlined' ? 'textfield--outlined' : 'textfield--filled'}`}
      {...rest}
    />
  )
}