import React from "react";
import "./Button.css";

/**
 * Simple reusable button.
 * Props:
 * - color: "primary" | "secondary" (maps to CSS classes)
 * - size:  "medium" | "small"      (maps to CSS classes)
 */
export const Button = ({ children, color = 'primary', size = 'medium', ...rest }) => {
  // Map props to classes. You can replace with Tailwind classes if you prefer.
  const colorClass = color === 'primary' ? 'btn--primary' : 'btn--secondary'
  const sizeClass = size === 'medium' ? 'btn--md' : 'btn--sm'

  return (
    <button className={`btn ${colorClass} ${sizeClass}`} {...rest}>
      {children}
    </button>
  )
}