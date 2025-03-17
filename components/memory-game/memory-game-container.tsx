"use client"

import { useState, useEffect } from "react"
import { useGameStats } from "./game-stats-provider"
import GameHeader from "./game-header"
import GameBoard from "./game-board"
import GameControls from "./game-controls"
import { createCards, getTotalPairs } from "@/lib/game-utils"
import { playSound } from "@/lib/sound-utils"
import { triggerConfetti } from "@/lib/animation-utils"
import type { Difficulty, MemoryCard } from "@/lib/types"

export default function MemoryGameContainer() {
  const { bestScores, updateBestScore } = useGameStats()
  const [difficulty, setDifficulty] = useState<Difficulty>("fácil")
  const [cards, setCards] = useState<MemoryCard[]>(() => createCards(difficulty))
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [time, setTime] = useState(0)


  useEffect(() => {
    setCards(createCards(difficulty))
  }, [difficulty])


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [gameStarted, gameCompleted])

  const handleCardClick = (clickedIndex: number) => {

    if (!gameStarted) {
      setGameStarted(true)
    }


    if (isChecking || cards[clickedIndex].isMatched) return

    if (flippedIndexes.includes(clickedIndex)) return

    if (flippedIndexes.length === 2) return

    const newFlipped = [...flippedIndexes, clickedIndex]
    setFlippedIndexes(newFlipped)

    playSound("flip")

    if (newFlipped.length === 2) {
      setIsChecking(true)
      setMoves((prev) => prev + 1)

      const [firstIndex, secondIndex] = newFlipped
      const firstCard = cards[firstIndex]
      const secondCard = cards[secondIndex]

      if (firstCard.icon === secondCard.icon) {
        setTimeout(() => {
          setCards(
            cards.map((card, index) =>
              index === firstIndex || index === secondIndex ? { ...card, isMatched: true } : card,
            ),
          )
          setFlippedIndexes([])
          setMatches((m) => m + 1)
          setIsChecking(false)

          playSound("match")

          const totalPairs = getTotalPairs(difficulty)
          if (matches === totalPairs - 1) {
            handleGameCompletion()
          }
        }, 500)
      } else {
        setTimeout(() => {
          setFlippedIndexes([])
          setIsChecking(false)

          playSound("error")
        }, 1000)
      }
    }
  }

  const handleGameCompletion = () => {
    setGameCompleted(true)

    const currentScore = moves
    updateBestScore(difficulty, currentScore)

    triggerConfetti()

    playSound("win")
  }

  const resetGame = () => {
    setCards(createCards(difficulty))
    setFlippedIndexes([])
    setMatches(0)
    setIsChecking(false)
    setMoves(0)
    setTime(0)
    setGameStarted(false)
    setGameCompleted(false)

    playSound("reset")
  }

  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)


    setFlippedIndexes([])
    setMatches(0)
    setIsChecking(false)
    setMoves(0)
    setTime(0)
    setGameStarted(false)
    setGameCompleted(false)


    playSound("reset")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh]">
      <GameHeader
        difficulty={difficulty}
        changeDifficulty={changeDifficulty}
        moves={moves}
        time={time}
        matches={matches}
        totalPairs={getTotalPairs(difficulty)}
        bestScore={bestScores[difficulty]}
      />

      <GameBoard cards={cards} flippedIndexes={flippedIndexes} difficulty={difficulty} onCardClick={handleCardClick} />

      <GameControls resetGame={resetGame} gameCompleted={gameCompleted} />
    </div>
  )
}

