import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** @param {import('clsx').ClassValue[]} inputs */
export const cn = (...inputs) => twMerge(clsx(inputs))
