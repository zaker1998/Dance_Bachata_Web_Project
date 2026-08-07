"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

interface FadeUpProps extends ComponentProps<typeof motion.div> {
  children: ReactNode;
  delay?: number;
  once?: boolean;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "blockquote";
}

/**
 * Tiny client island that fades content in from below as it enters the viewport.
 * Keeps Framer Motion confined to actual animated nodes instead of forcing the
 * entire page to be a client component.
 */
export function FadeUp({
  children,
  delay = 0,
  once = true,
  as = "div",
  ...rest
}: FadeUpProps) {
  const Comp = motion[as] as typeof motion.div;
  const prefersReducedMotion = useReducedMotion();
  return (
    <Comp
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once }}
      transition={{ duration: 0.5, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
