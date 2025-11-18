import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateGroupAvatar = (name: string) => {
  const initials = name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .slice(0, 3)
    .join("")

  // Random color
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]
  const colorIndex = name.charCodeAt(0) % colors.length
  const bg = colors[colorIndex]

  return { initials, bg }
}
