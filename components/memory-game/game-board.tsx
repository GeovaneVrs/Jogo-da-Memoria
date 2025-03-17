"use client"

import type { MemoryCard, Difficulty } from "@/lib/types"
import MemoryCardComponent from "./memory-card"

interface GameBoardProps {
  cards: MemoryCard[]
  flippedIndexes: number[]
  difficulty: Difficulty
  onCardClick: (index: number) => void
}

export default function GameBoard({ cards, flippedIndexes, difficulty, onCardClick }: GameBoardProps) {
  // Ajustar o layout da grade conforme a dificuldade
  const getGridCols = () => {
    switch (difficulty) {
      case "fácil":
        return "grid-cols-4" // 2x4 para 8 cartas
      case "médio":
        return "grid-cols-4" // 3x4 para 12 cartas
      case "difícil":
        return "grid-cols-4" // 4x4 para 16 cartas
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`grid ${getGridCols()} gap-2 p-4 rounded-2xl bg-blue-400/30 backdrop-blur-sm`}
        style={{
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {cards.map((card, index) => (
          <MemoryCardComponent
            key={card.id}
            card={card}
            index={index}
            isFlipped={flippedIndexes.includes(index)}
            difficulty={difficulty}
            onClick={() => onCardClick(index)}
          />
        ))}
      </div>
    </div>
  )
}

