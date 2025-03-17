"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Difficulty } from "@/lib/types"

type BestScores = Record<Difficulty, number | null>

interface GameStatsContextType {
  bestScores: BestScores
  updateBestScore: (difficulty: Difficulty, score: number) => void
}

const GameStatsContext = createContext<GameStatsContextType | undefined>(undefined)

export function useGameStats() {
  const context = useContext(GameStatsContext)
  if (context === undefined) {
    throw new Error("useGameStats must be used within a GameStatsProvider")
  }
  return context
}

export function GameStatsProvider({ children }: { children: ReactNode }) {
  const [bestScores, setBestScores] = useState<BestScores>({
    fácil: null,
    médio: null,
    difícil: null,
  })

  // Carregar melhores pontuações do localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem("memoryGameBestScores")
    if (savedScores) {
      setBestScores(JSON.parse(savedScores))
    }
  }, [])

  const updateBestScore = (difficulty: Difficulty, score: number) => {
    if (bestScores[difficulty] === null || score < bestScores[difficulty]!) {
      const newScores = {
        ...bestScores,
        [difficulty]: score,
      }

      setBestScores(newScores)

      // Salvar no localStorage
      localStorage.setItem("memoryGameBestScores", JSON.stringify(newScores))
    }
  }

  return <GameStatsContext.Provider value={{ bestScores, updateBestScore }}>{children}</GameStatsContext.Provider>
}

