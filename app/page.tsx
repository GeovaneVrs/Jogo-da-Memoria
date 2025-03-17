"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Heart,
  Star,
  Sun,
  Moon,
  Cloud,
  Flower2,
  Music,
  Zap,
  Umbrella,
  Gift,
  Cake,
  type LucideIcon,
  Trophy,
  Timer,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type MemoryCard = {
  id: number
  icon: LucideIcon
  isMatched: boolean
  color: string
}

type Difficulty = "fácil" | "médio" | "difícil"

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
const createCards = (difficulty: Difficulty) => {
  // Número de pares baseado na dificuldade
  const pairsCount = difficulty === "fácil" ? 4 : difficulty === "médio" ? 6 : 8

  // Seleciona os ícones baseado na dificuldade
  const selectedIcons = iconConfigs.slice(0, pairsCount)

  const cards: MemoryCard[] = []

  selectedIcons.forEach(({ icon, color }, index) => {
    cards.push({ id: index * 2, icon, color, isMatched: false }, { id: index * 2 + 1, icon, color, isMatched: false })
  })

  return cards.sort(() => Math.random() - 0.5)
}

// Função para disparar confetti
const triggerConfetti = () => {
  const duration = 3 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min
  }

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    const particleCount = 50 * (timeLeft / duration)

    // Dispara confetti de ambos os lados
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  }, 250)
}

export default function MemoryGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("fácil")
  const [cards, setCards] = useState<MemoryCard[]>(() => createCards(difficulty))
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [time, setTime] = useState(0)
  const [bestScores, setBestScores] = useState<Record<Difficulty, number | null>>({
    fácil: null,
    médio: null,
    difícil: null,
  })

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

  // Formatar o tempo em minutos:segundos
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

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
          const totalPairs = difficulty === "fácil" ? 4 : difficulty === "médio" ? 6 : 8
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
    if (bestScores[difficulty] === null || currentScore < bestScores[difficulty]!) {
      setBestScores({
        ...bestScores,
        [difficulty]: currentScore,
      })

      // Salvar no localStorage
      localStorage.setItem(
        "memoryGameBestScores",
        JSON.stringify({
          ...bestScores,
          [difficulty]: currentScore,
        }),
      )
    }

    // Mostrar mensagem de parabéns
    toast("🎉 Parabéns! Você encontrou todos os pares! 🎈", {
      className: "bg-green-600 text-white border-green-700 font-bold text-lg",
    })

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

  const changeDifficulty = (newDifficulty: string) => {
    setDifficulty(newDifficulty as Difficulty)
    // O useEffect vai atualizar as cartas

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

  // Carregar melhores pontuações do localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem("memoryGameBestScores")
    if (savedScores) {
      setBestScores(JSON.parse(savedScores))
    }
  }, [])

  // Função para reproduzir sons
  const playSound = (soundType: "flip" | "match" | "error" | "win" | "reset") => {
    // Implementação básica - em um projeto real, você carregaria arquivos de áudio
    try {
      const audio = new Audio()

      switch (soundType) {
        case "flip":
          audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3"
          break
        case "match":
          audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3"
          break
        case "error":
          audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3"
          break
        case "win":
          audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3"
          break
        case "reset":
          audio.src = "https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3"
          break
      }

      audio.volume = 0.3
      audio.play().catch((e) => console.log("Erro ao reproduzir som:", e))
    } catch (error) {
      console.log("Erro ao reproduzir som:", error)
    }
  }

  // Ajustar o layout da grade conforme a dificuldade
  const getGridCols = () => {
    switch (difficulty) {
      case "fácil":
        return "grid-cols-2 sm:grid-cols-4" // 2x4 ou 4x2 para 8 cartas
      case "médio":
        return "grid-cols-3 sm:grid-cols-4" // 3x4 ou 4x3 para 12 cartas
      case "difícil":
        return "grid-cols-4 sm:grid-cols-4" // 4x4 para 16 cartas
    }
  }

  // Calcular o tamanho dos cartões com base na dificuldade
  const getCardSize = () => {
    switch (difficulty) {
      case "fácil":
        return "w-20 h-20 sm:w-24 sm:h-24"
      case "médio":
        return "w-16 h-16 sm:w-20 sm:h-20"
      case "difícil":
        return "w-14 h-14 sm:w-18 sm:h-18"
    }
  }

  // Calcular o tamanho dos ícones com base na dificuldade
  const getIconSize = () => {
    switch (difficulty) {
      case "fácil":
        return "w-10 h-10 sm:w-12 sm:h-12"
      case "médio":
        return "w-8 h-8 sm:w-10 sm:h-10"
      case "difícil":
        return "w-6 h-6 sm:w-8 sm:h-8"
    }
  }

  // Obter o número total de pares para a dificuldade atual
  const getTotalPairs = () => {
    return difficulty === "fácil" ? 4 : difficulty === "médio" ? 6 : 8
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-gradient-to-b from-sky-400 to-blue-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">Jogo da Memória</h1>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <Select value={difficulty} onValueChange={changeDifficulty}>
            <SelectTrigger className="w-28 bg-white/90 border-blue-300 text-blue-700">
              <SelectValue placeholder="Dificuldade" />
            </SelectTrigger>
            <SelectContent className="bg-white border-blue-300">
              <SelectItem value="fácil">Fácil (8)</SelectItem>
              <SelectItem value="médio">Médio (12)</SelectItem>
              <SelectItem value="difícil">Difícil (16)</SelectItem>
            </SelectContent>
          </Select>

          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1 bg-yellow-400/90 border-yellow-500 text-yellow-900"
          >
            <Trophy className="w-4 h-4 text-yellow-700" />
            <span>Melhor: {bestScores[difficulty] !== null ? bestScores[difficulty] : "-"}</span>
          </Badge>

          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1 bg-green-400/90 border-green-500 text-green-900"
          >
            <RefreshCw className="w-4 h-4 text-green-700" />
            <span>Jogadas: {moves}</span>
          </Badge>

          <Badge
            variant="outline"
            className="flex items-center gap-1 px-3 py-1 bg-blue-400/90 border-blue-500 text-blue-900"
          >
            <Timer className="w-4 h-4 text-blue-700" />
            <span>Tempo: {formatTime(time)}</span>
          </Badge>
        </div>

        <p className="text-white font-medium mt-2 drop-shadow-sm">
          Pares encontrados: {matches} de {getTotalPairs()}
        </p>
      </div>

      <div
        className={`grid ${getGridCols()} gap-2 sm:gap-4 p-4 sm:p-6 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg`}
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: card.isMatched || flippedIndexes.includes(index) ? 180 : 0,
              scale: card.isMatched ? 0.95 : 1,
            }}
            whileHover={{ scale: flippedIndexes.includes(index) || card.isMatched ? 1 : 1.05 }}
            transition={{ duration: 0.3 }}
            className="perspective-1000"
          >
            <Card
              className={`relative ${getCardSize()} cursor-pointer transform-style-3d transition-all duration-300 ${
                card.isMatched
                  ? "bg-green-100 border-green-300"
                  : flippedIndexes.includes(index)
                    ? "bg-blue-100 border-blue-300"
                    : "bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200 hover:border-blue-300 hover:shadow-md"
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-100/10 to-white/20" />

              {/* Parte de trás do cartão (quando não virado) */}
              <motion.div
                animate={{ opacity: card.isMatched || flippedIndexes.includes(index) ? 0 : 1 }}
                className="absolute inset-0 flex items-center justify-center backface-hidden"
              >
                <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-blue-300 via-sky-300 to-cyan-300" />
              </motion.div>

              {/* Parte da frente do cartão (quando virado) */}
              <AnimatePresence>
                {(card.isMatched || flippedIndexes.includes(index)) && (
                  <motion.div
                    initial={{ opacity: 0, rotateY: 180 }}
                    animate={{
                      opacity: 1,
                      rotateY: 180,
                      scale: card.isMatched ? 1.1 : 1,
                    }}
                    exit={{ opacity: 0, rotateY: 180 }}
                    className="absolute inset-0 flex items-center justify-center backface-hidden"
                  >
                    <card.icon
                      className={`${getIconSize()} ${
                        card.isMatched ? `${card.color} filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]` : card.color
                      }`}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      <Button
        onClick={resetGame}
        variant="default"
        size="lg"
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-none text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        Novo Jogo
      </Button>
    </div>
  )
}

