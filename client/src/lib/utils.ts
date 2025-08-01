import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDisplayName(user: {
  first_name?: string
  middle_name?: string
  last_name?: string
  username: string
}): string {
  const parts = [user.first_name, user.middle_name, user.last_name].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : user.username
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}