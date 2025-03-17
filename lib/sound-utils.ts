"use client"

// Função para reproduzir sons
export const playSound = (soundType: "flip" | "match" | "error" | "win" | "reset") => {
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

