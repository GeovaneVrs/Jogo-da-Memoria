"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface GameControlsProps {
  resetGame: () => void
  gameCompleted: boolean
}

export default function GameControls({ resetGame, gameCompleted }: GameControlsProps) {
  const [showCongrats, setShowCongrats] = useState(false)

  useEffect(() => {
    if (gameCompleted) {
      setShowCongrats(true)
      const timer = setTimeout(() => {
        setShowCongrats(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [gameCompleted])

  return (
    <div className="flex flex-col items-center mt-6">
      {showCongrats && (
        <div className="bg-green-500 text-white font-bold text-lg px-6 py-2 rounded-full mb-4">
          🎉 Parabéns! Você encontrou todos os pares!
        </div>
      )}

      <Button
        onClick={resetGame}
        className="bg-green-500 hover:bg-green-600 text-white font-medium rounded-full px-8 py-2"
      >
        Novo Jogo
      </Button>
    </div>
  )
}

