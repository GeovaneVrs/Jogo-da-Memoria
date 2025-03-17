import type { LucideIcon } from "lucide-react"

export type Difficulty = "fácil" | "médio" | "difícil"

export type MemoryCard = {
  id: number
  icon: LucideIcon
  isMatched: boolean
  color: string
}

