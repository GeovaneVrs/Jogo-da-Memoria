"use client"

// Função para disparar confetti
export const triggerConfetti = () => {
  try {
    // Verificar se a biblioteca confetti está disponível
    if (typeof window !== "undefined" && window.confetti) {
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
        window.confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        window.confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)
    } else {
      console.log("🎉 Confetti! (biblioteca não disponível)")
    }
  } catch (error) {
    console.log("Erro ao disparar confetti:", error)
  }
}

// Adicionar tipos para o confetti global
declare global {
  interface Window {
    confetti: any
  }
}

