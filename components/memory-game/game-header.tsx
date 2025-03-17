"use client"

import { formatTime } from "@/lib/format-utils"
import type { Difficulty } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, RefreshCw, Timer } from "lucide-react"

interface GameHeaderProps {
  difficulty: Difficulty
  changeDifficulty: (difficulty: Difficulty) => void
  moves: number
  time: number
  matches: number
  totalPairs: number
  bestScore: number | null
}

export default function GameHeader({
  difficulty,
  changeDifficulty,
  moves,
  time,
  matches,
  totalPairs,
  bestScore,
}: GameHeaderProps) {
  return (
    <div className="text-center w-full max-w-md mx-auto mb-4">
      <div className="flex justify-between items-center mb-4">
        <Select value={difficulty} onValueChange={(value) => changeDifficulty(value as Difficulty)}>
          <SelectTrigger className="w-28 bg-white/90 text-blue-700 font-medium rounded-full">
            <SelectValue placeholder="Dificuldade" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="fácil">Fácil</SelectItem>
            <SelectItem value="médio">Médio</SelectItem>
            <SelectItem value="difícil">Difícil</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex space-x-2">
          <Badge className="bg-blue-500/90 text-white rounded-full px-3 py-1 flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            <span>Melhor: {bestScore !== null ? bestScore : "-"}</span>
          </Badge>

          <Badge className="bg-blue-500/90 text-white rounded-full px-3 py-1 flex items-center gap-1">
            <RefreshCw className="w-4 h-4" />
            <span>Jogadas: {moves}</span>
          </Badge>

          <Badge className="bg-blue-500/90 text-white rounded-full px-3 py-1 flex items-center gap-1">
            <Timer className="w-4 h-4" />
            <span>Tempo: {formatTime(time)}</span>
          </Badge>
        </div>
      </div>

      <p className="text-white font-medium text-lg">
        Pares encontrados: {matches} de {totalPairs}
      </p>
    </div>
  )
}

