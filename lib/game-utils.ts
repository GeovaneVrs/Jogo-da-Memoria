import { Heart, Star, Sun, Moon, Cloud, Flower2, Music, Zap, Umbrella, Gift, Cake } from "lucide-react"
import type { Difficulty, MemoryCard } from "./types"

// Configuração de ícones
const iconConfigs = [
  { icon: Heart, color: "text-rose-500" },
  { icon: Star, color: "text-amber-500" },
  { icon: Sun, color: "text-yellow-500" },
  { icon: Moon, color: "text-blue-500" },
  { icon: Cloud, color: "text-sky-500" },
  { icon: Flower2, color: "text-emerald-500" },
  { icon: Music, color: "text-blue-600" },
  { icon: Zap, color: "text-orange-500" },
  { icon: Umbrella, color: "text-teal-500" },
  { icon: Gift, color: "text-pink-500" },
  { icon: Cake, color: "text-red-500" },
]

// Função para criar cartas com o número correto de pares para cada dificuldade
export const createCards = (difficulty: Difficulty): MemoryCard[] => {
  // Número de pares baseado na dificuldade
  const pairsCount = getTotalPairs(difficulty)

  // Seleciona os ícones baseado na dificuldade
  const selectedIcons = iconConfigs.slice(0, pairsCount)

  const cards: MemoryCard[] = []

  selectedIcons.forEach(({ icon, color }, index) => {
    cards.push({ id: index * 2, icon, color, isMatched: false }, { id: index * 2 + 1, icon, color, isMatched: false })
  })

  return cards.sort(() => Math.random() - 0.5)
}

// Obter o número total de pares para a dificuldade atual
export const getTotalPairs = (difficulty: Difficulty): number => {
  return difficulty === "fácil" ? 4 : difficulty === "médio" ? 6 : 8
}

