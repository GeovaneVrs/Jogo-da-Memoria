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

  // Atualizar cartas quando a dificuldade mudar
  useEffect(() => {
    setCards(createCards(difficulty))
  }, [difficulty])

  // Iniciar/parar o temporizador
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
    // Iniciar o jogo no primeiro clique
    if (!gameStarted) {
      setGameStarted(true)
    }

    // Prevenir cliques durante verificação ou em cartas já combinadas
    if (isChecking || cards[clickedIndex].isMatched) return
    // Prevenir clique em carta já virada
    if (flippedIndexes.includes(clickedIndex)) return
    // Prevenir clique se já tiver duas cartas viradas
    if (flippedIndexes.length === 2) return

    // Adicionar carta clicada às cartas viradas
    const newFlipped = [...flippedIndexes, clickedIndex]
    setFlippedIndexes(newFlipped)

    // Reproduzir som de clique
    playSound("flip")

    // Se agora temos duas cartas viradas, verificar se há combinação
    if (newFlipped.length === 2) {
      setIsChecking(true)
      setMoves((prev) => prev + 1)

      const [firstIndex, secondIndex] = newFlipped
      const firstCard = cards[firstIndex]
      const secondCard = cards[secondIndex]

      if (firstCard.icon === secondCard.icon) {
        // Combinação encontrada
        setTimeout(() => {
          setCards(
            cards.map((card, index) =>
              index === firstIndex || index === secondIndex ? { ...card, isMatched: true } : card,
            ),
          )
          setFlippedIndexes([])
          setMatches((m) => m + 1)
          setIsChecking(false)

          // Reproduzir som de combinação
          playSound("match")

          // Verificar conclusão do jogo
          const totalPairs = getTotalPairs(difficulty)
          if (matches === totalPairs - 1) {
            handleGameCompletion()
          }
        }, 500)
      } else {
        // Sem combinação - resetar após atraso
        setTimeout(() => {
          setFlippedIndexes([])
          setIsChecking(false)

          // Reproduzir som de erro
          playSound("error")
        }, 1000)
      }
    }
  }

  const handleGameCompletion = () => {
    setGameCompleted(true)

    // Atualizar melhor pontuação
    const currentScore = moves
    updateBestScore(difficulty, currentScore)

    // Disparar confetti
    triggerConfetti()

    // Reproduzir som de vitória
    playSound("win")
  }

  const resetGame = () => {
    // Criar novas cartas com a dificuldade atual
    setCards(createCards(difficulty))
    setFlippedIndexes([])
    setMatches(0)
    setIsChecking(false)
    setMoves(0)
    setTime(0)
    setGameStarted(false)
    setGameCompleted(false)

    // Reproduzir som de reset
    playSound("reset")
  }

  const changeDifficulty = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)

    // Resetar o jogo
    setFlippedIndexes([])
    setMatches(0)
    setIsChecking(false)
    setMoves(0)
    setTime(0)
    setGameStarted(false)
    setGameCompleted(false)

    // Reproduzir som de reset
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

