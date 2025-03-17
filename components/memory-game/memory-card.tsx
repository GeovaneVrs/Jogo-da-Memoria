"use client"

import type { MemoryCard, Difficulty } from "@/lib/types"
import { Card } from "@/components/ui/card"

interface MemoryCardProps {
  card: MemoryCard
  index: number
  isFlipped: boolean
  difficulty: Difficulty
  onClick: () => void
}

export default function MemoryCardComponent({ card, index, isFlipped, difficulty, onClick }: MemoryCardProps) {
  // Calcular o tamanho dos cartões com base na dificuldade
  const getCardSize = () => {
    switch (difficulty) {
      case "fácil":
        return "w-16 h-16 sm:w-20 sm:h-20"
      case "médio":
        return "w-14 h-14 sm:w-16 sm:h-16"
      case "difícil":
        return "w-12 h-12 sm:w-14 sm:h-14"
    }
  }

  // Calcular o tamanho dos ícones com base na dificuldade
  const getIconSize = () => {
    switch (difficulty) {
      case "fácil":
        return "w-8 h-8"
      case "médio":
        return "w-7 h-7"
      case "difícil":
        return "w-6 h-6"
    }
  }

  return (
    <div className="perspective-1000" style={{ perspective: "1000px" }}>
      <Card
        className={`relative ${getCardSize()} cursor-pointer transition-all duration-300 ${
          card.isMatched
            ? "bg-white border-green-300"
            : isFlipped
              ? "bg-white border-blue-300"
              : "bg-white border-blue-200"
        }`}
        onClick={onClick}
        style={{
          transform: card.isMatched || isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Parte de trás do cartão (quando não virado) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            opacity: card.isMatched || isFlipped ? 0 : 1,
          }}
        >
          <div className="w-1/2 h-1/2 rounded-full bg-blue-300" />
        </div>

        {/* Parte da frente do cartão (quando virado) */}
        {(card.isMatched || isFlipped) && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {card.icon && <card.icon className={`${getIconSize()} ${card.isMatched ? `${card.color}` : card.color}`} />}
          </div>
        )}
      </Card>
    </div>
  )
}

