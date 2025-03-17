import MemoryGameContainer from "@/components/memory-game/memory-game-container"
import { GameStatsProvider } from "@/components/memory-game/game-stats-provider"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-400">
      <div className="container mx-auto px-4 py-8">
        <GameStatsProvider>
          <MemoryGameContainer />
        </GameStatsProvider>
      </div>
    </main>
  )
}

