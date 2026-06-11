import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Play, RotateCcw, Volume2, VolumeX, Shield, Coins, AlertTriangle, ArrowRight, Smartphone } from 'lucide-react'

interface TasteRaceProps {
  onClose?: () => void
}

// Sound Synthesizer using Web Audio API
const playSound = (type: 'coin' | 'crash' | 'gameover' | 'click' | 'countdown' | 'engine' | 'low_lives' | 'clock_tick') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    
    if (type === 'coin') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08) // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    } else if (type === 'crash') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(150, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } else if (type === 'gameover') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(330, ctx.currentTime) // E4
      osc.frequency.setValueAtTime(261.63, ctx.currentTime + 0.15) // C4
      osc.frequency.setValueAtTime(196, ctx.currentTime + 0.3) // G3
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.6)
    } else if (type === 'click') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } else if (type === 'countdown') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(440, ctx.currentTime) // A4
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    } else if (type === 'engine') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(80, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + 0.6)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.6)
    } else if (type === 'low_lives') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.3)
    } else if (type === 'clock_tick') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(1000, ctx.currentTime)
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.05)
    }
  } catch (e) {
    console.warn('AudioContext not allowed or supported yet.', e)
  }
}

export function TasteRace({ onClose }: TasteRaceProps) {
  const { t, i18n } = useTranslation()
  const isTR = i18n.language?.startsWith('tr')
  
  // Game states
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [score, setScore] = useState(0) // session collected TASTE
  const [timeRemaining, setTimeRemaining] = useState(120) // 2 minutes
  const [lives, setLives] = useState(3)
  const [highScore, setHighScore] = useState<number>(() => {
    return parseFloat(localStorage.getItem('taste_race_highscore') || '0')
  })
  const [totalBalance, setTotalBalance] = useState<number>(() => {
    return parseFloat(localStorage.getItem('taste_race_total_balance') || '0')
  })
  
  // Game canvas references
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const requestRef = useRef<number | null>(null)
  
  // Controls state
  const keysPressed = useRef<{ [key: string]: boolean }>({})
  const [isMobileControls, setIsMobileControls] = useState(false)
  const touchLeft = useRef(false)
  const touchRight = useRef(false)
  
  // Player & Game variables (non-reactive to avoid re-renders in animation loop)
  const gameVars = useRef({
    playerX: 0, // normalized -1 to 1 (left to right)
    playerWidth: 50,
    playerHeight: 85,
    speed: 8, // starting speed
    maxSpeed: 20,
    distanceTravelled: 0,
    roadOffset: 0,
    obstacles: [] as Array<{ id: number; x: number; y: number; width: number; height: number; speed: number; color: string }>,
    collectibles: [] as Array<{ id: number; x: number; y: number; size: number; pulse: number }>,
    invulnerableFrames: 0,
    nextSpawnObstacle: 0,
    nextSpawnCollectible: 0,
    totalGiftsCollected: 0,
  })

  // Detect mobile
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 600
    setIsMobileControls(isMobile)
  }, [])

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true
      // Prevent scrolling
      if (['arrowleft', 'arrowright', ' ', 'arrowup', 'arrowdown', 'a', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Start game
  const startGame = () => {
    if (soundEnabled) {
      playSound('engine')
      setTimeout(() => {
        playSound('countdown')
      }, 350)
    }
    setLives(3)
    setTimeRemaining(120)
    setScore(0)
    setGameState('PLAYING')
    
    // Reset game variables
    gameVars.current = {
      playerX: 0,
      playerWidth: 46,
      playerHeight: 80,
      speed: 6.5,
      maxSpeed: 17,
      distanceTravelled: 0,
      roadOffset: 0,
      obstacles: [],
      collectibles: [],
      invulnerableFrames: 0,
      nextSpawnObstacle: 0,
      nextSpawnCollectible: 0,
      totalGiftsCollected: 0,
    }
  }

  // End game
  const endGame = (completed = false) => {
    setGameState('GAMEOVER')
    if (soundEnabled) playSound('gameover')
    
    // Calculate rewards
    // minimum 0.2 TASTE, max 1.0 (session limit is 1.0 TASTE)
    let finalReward = gameVars.current.totalGiftsCollected * 0.2
    if (finalReward < 0.2 && (120 - timeRemaining) > 5) {
      finalReward = 0.2 // played at least 5s
    }
    if (finalReward > 1.0) {
      finalReward = 1.0 // session limit is 1 TASTE
    }
    
    const finalScore = parseFloat(finalReward.toFixed(2))
    setScore(finalScore)
    
    // Update highscore
    if (finalScore > highScore) {
      setHighScore(finalScore)
      localStorage.setItem('taste_race_highscore', finalScore.toString())
    }
    
    // Update balance
    const newBalance = parseFloat((totalBalance + finalScore).toFixed(2))
    setTotalBalance(newBalance)
    localStorage.setItem('taste_race_total_balance', newBalance.toString())
  }

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'PLAYING') return
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const nextTime = prev - 1
        if (nextTime <= 0) {
          clearInterval(timer)
          endGame(true)
          return 0
        }
        // Play tick sound in final 10 seconds of the countdown
        if (nextTime <= 10 && soundEnabled) {
          playSound('clock_tick')
        }
        return nextTime
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameState, soundEnabled])

  // Core Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    resizeCanvas()

    const loop = () => {
      update()
      draw(ctx, canvas.width, canvas.height)
      requestRef.current = requestAnimationFrame(loop)
    }

    requestRef.current = requestAnimationFrame(loop)
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [gameState])

  // Update Game Physics
  const update = () => {
    const v = gameVars.current
    
    // Increase speed slowly
    if (v.speed < v.maxSpeed) {
      v.speed += 0.001
    }

    // Road scroll
    v.roadOffset = (v.roadOffset + v.speed) % 120
    v.distanceTravelled += v.speed / 60

    // Invulnerability flashing frames countdown
    if (v.invulnerableFrames > 0) {
      v.invulnerableFrames--
    }

    // Input Movement
    const moveSpeed = 0.06
    if (keysPressed.current['arrowleft'] || keysPressed.current['a'] || touchLeft.current) {
      v.playerX = Math.max(-1.1, v.playerX - moveSpeed)
    }
    if (keysPressed.current['arrowright'] || keysPressed.current['d'] || touchRight.current) {
      v.playerX = Math.min(1.1, v.playerX + moveSpeed)
    }

    // Spawn Obstacles (cars)
    if (v.distanceTravelled >= v.nextSpawnObstacle) {
      const obstacleWidth = 44
      const obstacleHeight = 75
      // Random road column (-0.8 to 0.8)
      const randomColX = (Math.random() * 1.6) - 0.8
      
      v.obstacles.push({
        id: Date.now() + Math.random(),
        x: randomColX,
        y: -100,
        width: obstacleWidth,
        height: obstacleHeight,
        speed: (Math.random() * 2) + 2, // relative scrolling speed down
        color: ['#3b82f6', '#10b981', '#a855f7', '#f43f5e', '#ffffff'][Math.floor(Math.random() * 5)]
      })
      
      // Schedule next spawn based on speed
      v.nextSpawnObstacle = v.distanceTravelled + (Math.random() * 15 + 10)
    }

    // Spawn Collectibles (TASTE 🎁)
    if (v.distanceTravelled >= v.nextSpawnCollectible) {
      const randomColX = (Math.random() * 1.6) - 0.8
      v.collectibles.push({
        id: Date.now() + Math.random(),
        x: randomColX,
        y: -50,
        size: 20,
        pulse: 0
      })
      v.nextSpawnCollectible = v.distanceTravelled + (Math.random() * 12 + 6)
    }

    // Map screen coord helpers
    const getScreenX = (normX: number, canvasWidth: number) => {
      const roadWidth = canvasWidth * 0.65
      const roadCenter = canvasWidth / 2
      return roadCenter + (normX * (roadWidth / 2))
    }

    // Update Obstacles
    v.obstacles = v.obstacles.filter(obs => {
      obs.y += v.speed - obs.speed
      
      // Collision check with player
      const obsScreenX = getScreenX(obs.x, canvasRef.current!.width) - obs.width / 2
      const playerScreenX = getScreenX(v.playerX, canvasRef.current!.width) - v.playerWidth / 2
      const playerY = canvasRef.current!.height - 130
      
      if (
        v.invulnerableFrames === 0 &&
        playerScreenX < obsScreenX + obs.width &&
        playerScreenX + v.playerWidth > obsScreenX &&
        playerY < obs.y + obs.height &&
        playerY + v.playerHeight > obs.y
      ) {
        // Crash!
        if (soundEnabled) playSound('crash')
        setLives((prev) => {
          if (prev <= 1) {
            endGame(false)
            return 0
          }
          const nextLives = prev - 1
          if (nextLives === 1 && soundEnabled) {
            playSound('low_lives')
          }
          return nextLives
        })
        v.invulnerableFrames = 90 // 1.5 seconds invulnerability
        v.speed = Math.max(5, v.speed - 3) // slow down
        return false // destroy obstacle
      }
      
      return obs.y < canvasRef.current!.height + 100
    })

    // Update Collectibles
    v.collectibles = v.collectibles.filter(item => {
      item.y += v.speed
      item.pulse = (item.pulse + 0.1) % (Math.PI * 2)
      
      // Collision check with player
      const itemScreenX = getScreenX(item.x, canvasRef.current!.width)
      const playerScreenX = getScreenX(v.playerX, canvasRef.current!.width) - v.playerWidth / 2
      const playerY = canvasRef.current!.height - 130
      
      if (
        playerScreenX < itemScreenX + item.size &&
        playerScreenX + v.playerWidth > itemScreenX - item.size &&
        playerY < item.y + item.size &&
        playerY + v.playerHeight > item.y - item.size
      ) {
        // Collect!
        if (soundEnabled) playSound('coin')
        v.totalGiftsCollected++
        return false
      }
      
      return item.y < canvasRef.current!.height + 100
    })
  }

  // Draw Game Graphics to Canvas
  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const v = gameVars.current
    
    // 1. Background Grass shoulder
    ctx.fillStyle = '#1e3a1e' // dark green grass
    ctx.fillRect(0, 0, width, height)
    
    // Draw grass side decorations (trees/bushes/flowers) scrolling down
    ctx.fillStyle = '#14532d'
    const decorationSpacing = 160
    const startY = (v.distanceTravelled * 60) % decorationSpacing
    for (let y = -decorationSpacing + startY; y < height; y += decorationSpacing) {
      // Left side trees
      ctx.beginPath()
      ctx.arc(width * 0.1, y, 22, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(width * 0.13, y - 10, 18, 0, Math.PI * 2)
      ctx.fill()
      
      // Right side trees
      ctx.beginPath()
      ctx.arc(width * 0.9, y + 40, 22, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(width * 0.87, y + 30, 18, 0, Math.PI * 2)
      ctx.fill()
    }

    // 2. Road surface
    const roadWidth = width * 0.65
    const roadLeft = (width - roadWidth) / 2
    ctx.fillStyle = '#334155' // slate road
    ctx.fillRect(roadLeft, 0, roadWidth, height)

    // Road side curb borders (Red & White retro stripes)
    const stripeLength = 40
    const curbOffset = (v.distanceTravelled * 60) % (stripeLength * 2)
    ctx.lineWidth = 6
    for (let y = -stripeLength * 2 + curbOffset; y < height; y += stripeLength * 2) {
      ctx.strokeStyle = '#ef4444' // red
      ctx.beginPath(); ctx.moveTo(roadLeft, y); ctx.lineTo(roadLeft, y + stripeLength); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(roadLeft + roadWidth, y); ctx.lineTo(roadLeft + roadWidth, y + stripeLength); ctx.stroke()
      
      ctx.strokeStyle = '#ffffff' // white
      ctx.beginPath(); ctx.moveTo(roadLeft, y + stripeLength); ctx.lineTo(roadLeft, y + stripeLength * 2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(roadLeft + roadWidth, y + stripeLength); ctx.lineTo(roadLeft + roadWidth, y + stripeLength * 2); ctx.stroke()
    }

    // Dashed center lanes
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 4
    ctx.setLineDash([30, 45])
    ctx.beginPath()
    ctx.moveTo(width / 2, -100 + v.roadOffset)
    ctx.lineTo(width / 2, height + 100)
    ctx.stroke()
    ctx.setLineDash([]) // reset

    // 3. Draw Collectibles (TASTE 🎁)
    v.collectibles.forEach(item => {
      const itemX = width / 2 + (item.x * (roadWidth / 2))
      const pulseSize = item.size + Math.sin(item.pulse) * 3
      
      // Draw a glowing coin / gift box
      ctx.shadowBlur = 15
      ctx.shadowColor = '#f59e0b'
      
      // Draw outer gold ring
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(itemX, item.y, pulseSize, 0, Math.PI * 2)
      ctx.fill()
      
      // Draw inner core
      ctx.fillStyle = '#f59e0b'
      ctx.beginPath()
      ctx.arc(itemX, item.y, pulseSize * 0.75, 0, Math.PI * 2)
      ctx.fill()
      
      // Draw T text
      ctx.shadowBlur = 0 // reset shadow
      ctx.fillStyle = '#000000'
      ctx.font = `bold ${pulseSize * 1.1}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('T', itemX, item.y + 1)
    })

    // 4. Draw Obstacles (Enemy cars)
    v.obstacles.forEach(obs => {
      const obsX = width / 2 + (obs.x * (roadWidth / 2)) - obs.width / 2
      
      // Draw a cool retro car block
      ctx.fillStyle = obs.color
      ctx.fillRect(obsX, obs.y, obs.width, obs.height)
      
      // Wheels
      ctx.fillStyle = '#000000'
      ctx.fillRect(obsX - 4, obs.y + 10, 4, 15) // Top-left
      ctx.fillRect(obsX + obs.width, obs.y + 10, 4, 15) // Top-right
      ctx.fillRect(obsX - 4, obs.y + obs.height - 25, 4, 15) // Bottom-left
      ctx.fillRect(obsX + obs.width, obs.y + obs.height - 25, 4, 15) // Bottom-right
      
      // Windshield / Windows
      ctx.fillStyle = '#cbd5e1'
      ctx.fillRect(obsX + 4, obs.y + 22, obs.width - 8, 12) // Front windshield
      ctx.fillRect(obsX + 4, obs.y + obs.height - 20, obs.width - 8, 8) // Rear window
      
      // Headlights
      ctx.fillStyle = '#fef08a' // yellow lights
      ctx.fillRect(obsX + 4, obs.y, 6, 4)
      ctx.fillRect(obsX + obs.width - 10, obs.y, 6, 4)
    })

    // 5. Draw Player Car
    const playerX = width / 2 + (v.playerX * (roadWidth / 2)) - v.playerWidth / 2
    const playerY = height - 130
    
    // Check if invulnerable (make it flash)
    if (v.invulnerableFrames === 0 || Math.floor(v.invulnerableFrames / 6) % 2 === 0) {
      // Draw Red Sports Car (Player)
      ctx.shadowBlur = 10
      ctx.shadowColor = 'rgba(239, 68, 68, 0.4)'
      
      ctx.fillStyle = '#ef4444' // red body
      ctx.fillRect(playerX, playerY, v.playerWidth, v.playerHeight)
      
      // Wheels
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(playerX - 5, playerY + 12, 5, 18)
      ctx.fillRect(playerX + v.playerWidth, playerY + 12, 5, 18)
      ctx.fillRect(playerX - 5, playerY + v.playerHeight - 30, 5, 18)
      ctx.fillRect(playerX + v.playerWidth, playerY + v.playerHeight - 30, 5, 18)
      
      // Spoiler
      ctx.fillStyle = '#991b1b'
      ctx.fillRect(playerX - 4, playerY + v.playerHeight - 4, v.playerWidth + 8, 6)
      
      // Windshield & Windows
      ctx.fillStyle = '#93c5fd'
      ctx.fillRect(playerX + 5, playerY + 22, v.playerWidth - 10, 15) // Front
      ctx.fillRect(playerX + 5, playerY + v.playerHeight - 24, v.playerWidth - 10, 10) // Rear
      
      // Neon/Gold Underglow
      ctx.fillStyle = '#fbbf24'
      ctx.fillRect(playerX + 4, playerY, 6, 4) // Left light
      ctx.fillRect(playerX + v.playerWidth - 10, playerY, 6, 4) // Right light
      
      ctx.shadowBlur = 0 // reset
    }
  }

  // Handle WhatsApp claim click
  const handleWhatsAppClaim = () => {
    if (soundEnabled) playSound('click')
    const text = isTR 
      ? `Merhaba! TASTE Race oyununda 250 TASTE sınırına ulaştım. Çekim talebi oluşturmak istiyorum.\n\nToplam Bakiyem: ${totalBalance} TASTE\nCüzdan Adresim: ${localStorage.getItem('taste_wallet_address') || 'Cüzdan adresi eklenmedi'}` 
      : `Hello! I have reached the 250 TASTE threshold in TASTE Race. I would like to make a withdrawal.\n\nTotal Balance: ${totalBalance} TASTE\nWallet Address: ${localStorage.getItem('taste_wallet_address') || 'Not Set'}`
    const link = `https://chat.whatsapp.com/G2Q6xjoYt94GzseLmFnUtO` // Directly opens their WhatsApp community
    
    // Copy info to clipboard first to help them post in the group
    navigator.clipboard.writeText(text).then(() => {
      alert(isTR 
        ? "Çekim şablonu kopyalandı! Şimdi WhatsApp grubuna yönlendiriliyorsunuz. Mesajınızı oraya yapıştırın." 
        : "Withdrawal info copied! Redirecting to WhatsApp group. Paste your message there.")
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(link)
      } else {
        window.open(link, '_blank')
      }
    })
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleToggleSound = () => {
    playSound('click')
    setSoundEnabled(!soundEnabled)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      background: '#090d16',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Top Header */}
      <div style={{
        height: '60px',
        padding: '0 16px',
        background: 'rgba(15,23,42,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}>
        {onClose ? (
          <button
            onClick={() => { playSound('click'); onClose(); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: 700
            }}
          >
            <ArrowLeft size={18} /> {isTR ? 'Geri' : 'Back'}
          </button>
        ) : (
          <div style={{ width: '40px' }} />
        )}
        
        <div style={{ fontWeight: 900, fontSize: '16px', color: '#fbbf24', letterSpacing: '1px' }}>
          TASTE RACE 🏎️
        </div>

        <button
          onClick={handleToggleSound}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
            borderRadius: '10px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#040711',
        overflow: 'hidden'
      }}>
        
        {/* GAME CANVAS */}
        <div style={{
          width: '100%',
          height: '100%',
          maxWidth: '450px',
          background: '#111827',
          position: 'relative'
        }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          
          {/* PLAYING STATE HUD OVERLAY */}
          {gameState === 'PLAYING' && (
            <>
              {/* TOP HUD BAR */}
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                zIndex: 5
              }}>
                {/* Health & Time */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{
                    background: 'rgba(15,23,42,0.85)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    fontWeight: 800
                  }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span key={i} style={{ opacity: i < lives ? 1 : 0.2, transition: 'opacity 0.2s', fontSize: '15px' }}>❤️</span>
                    ))}
                  </div>
                  
                  <div style={{
                    background: 'rgba(15,23,42,0.85)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 900,
                    color: timeRemaining < 20 ? '#f43f5e' : '#fff',
                    textAlign: 'center'
                  }}>
                    ⏱️ {formatTime(timeRemaining)}
                  </div>
                </div>

                {/* Score */}
                <div style={{
                  background: 'rgba(15,23,42,0.85)',
                  border: '1px solid rgba(245,159,11,0.4)',
                  borderRadius: '16px',
                  padding: '8px 14px',
                  textAlign: 'right',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ fontSize: '9px', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {isTR ? 'KAZANILAN TASTE' : 'EARNED TASTE'}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#fbbf24', marginTop: '2px' }}>
                    {Math.min(1.0, gameVars.current.totalGiftsCollected * 0.2).toFixed(1)} / 1.0
                  </div>
                </div>
              </div>

              {/* MOBILE CONTROLS OVERLAY */}
              {isMobileControls && (
                <div style={{
                  position: 'absolute',
                  bottom: '30px',
                  left: '20px',
                  right: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '40px',
                  zIndex: 5
                }}>
                  <button
                    onTouchStart={() => { touchLeft.current = true }}
                    onTouchEnd={() => { touchLeft.current = false }}
                    style={{
                      flex: 1,
                      height: '75px',
                      background: 'rgba(15,23,42,0.8)',
                      border: '2px solid rgba(255,255,255,0.15)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowLeft size={32} />
                  </button>
                  
                  <button
                    onTouchStart={() => { touchRight.current = true }}
                    onTouchEnd={() => { touchRight.current = false }}
                    style={{
                      flex: 1,
                      height: '75px',
                      background: 'rgba(15,23,42,0.8)',
                      border: '2px solid rgba(255,255,255,0.15)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowRight size={32} />
                  </button>
                </div>
              )}
            </>
          )}

          {/* START SCREEN PANEL */}
          {gameState === 'START' && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10,15,30,0.92)',
              backdropFilter: 'blur(10px)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '56px', marginBottom: '10px' }}>🏎️</div>
              <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fbbf24', margin: '0 0 8px 0', textShadow: '0 0 15px rgba(245,159,11,0.4)' }}>
                TASTE RACE
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 24px 0', lineHeight: 1.5 }}>
                {isTR
                  ? "Arabanı sola-sağa sür, diğer arabalara çarpmadan yoldaki TASTE hediye kutularını topla!"
                  : "Drive left and right, dodge enemy traffic, and collect TASTE boxes along the road!"}
              </p>

              {/* Instructions Card */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '24px',
                fontSize: '12px',
                color: '#cbd5e1',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div>⏱️ <b>{isTR ? 'Süre:' : 'Duration:'}</b> {isTR ? '2 Dakika (120 saniye)' : '2 Minutes (120 seconds)'}</div>
                <div>❤️ <b>{isTR ? 'Can:' : 'Lives:'}</b> {isTR ? '3 Çarpma hakkı' : '3 Crashes allowed'}</div>
                <div>🎁 <b>{isTR ? 'Kazanç:' : 'Earnings:'}</b> {isTR ? 'Her kutu +0.2 TASTE (Maks: 1.0 TASTE / yarış)' : 'Each box +0.2 TASTE (Max: 1.0 TASTE / race)'}</div>
                <div>🎮 <b>{isTR ? 'Kontroller:' : 'Controls:'}</b> {isTR ? 'Klavyede A/D veya Yön Tuşları, Mobilde Ekran Butonları' : 'A/D or Arrows on Keyboard, Screen Buttons on Mobile'}</div>
              </div>

              {/* Balance Box */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.03))',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: '20px',
                padding: '16px',
                marginBottom: '30px'
              }}>
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {isTR ? 'TOPLAM YARIŞ BAKİYESİ' : 'TOTAL RACE BALANCE'}
                </div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
                  {totalBalance.toFixed(2)} / 250.0 TASTE
                </div>
                
                {/* Progress bar to 250 */}
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (totalBalance / 250) * 100)}%`, height: '100%', background: '#10b981' }} />
                </div>

                {totalBalance >= 250 ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleWhatsAppClaim}
                    style={{
                      width: '100%',
                      marginTop: '14px',
                      background: 'linear-gradient(135deg, #25D366, #128C7E)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(37,211,102,0.3)'
                    }}
                  >
                    💬 {isTR ? 'WhatsApp ile Çek (250 TASTE)' : 'Withdraw via WhatsApp (250 TASTE)'}
                  </motion.button>
                ) : (
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '8px' }}>
                    {isTR ? '* Çekim yapmak için en az 250 TASTE biriktirmelisiniz.' : '* You must reach at least 250 TASTE to withdraw.'}
                  </div>
                )}
              </div>

              {/* Start Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '18px',
                  padding: '16px',
                  fontSize: '16px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(245,159,11,0.4)'
                }}
              >
                <Play size={18} fill="#000" />
                {isTR ? 'Yarışı Başlat' : 'Start Race'}
              </motion.button>
            </div>
          )}

          {/* GAMEOVER SCREEN PANEL */}
          {gameState === 'GAMEOVER' && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10,15,30,0.95)',
              backdropFilter: 'blur(10px)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>🏁</div>
              <h2 style={{ fontSize: '26px', fontWeight: 900, color: lives === 0 ? '#ef4444' : '#10b981', margin: '0 0 6px 0' }}>
                {lives === 0 ? (isTR ? 'Kaza Yaptın!' : 'Crashed!') : (isTR ? 'Yarış Tamamlandı!' : 'Race Finished!')}
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 24px 0' }}>
                {isTR ? 'Süre Doldu veya Canların Bitti' : 'Time ran out or you lost all lives'}
              </p>

              {/* Results */}
              <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '30px',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                  <span style={{ color: '#94a3b8' }}>⏱️ {isTR ? 'Süre:' : 'Time:'}</span>
                  <span style={{ fontWeight: 800 }}>{120 - timeRemaining} {isTR ? 'saniye' : 'seconds'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                  <span style={{ color: '#94a3b8' }}>🎁 {isTR ? 'Toplanan Kutu:' : 'Boxes Collected:'}</span>
                  <span style={{ fontWeight: 800 }}>{gameVars.current.totalGiftsCollected}</span>
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                  <span style={{ color: '#fbbf24', fontWeight: 800 }}>🪙 {isTR ? 'Kazanılan TASTE:' : 'TASTE Reward:'}</span>
                  <span style={{ color: '#fbbf24', fontWeight: 900 }}>+{score.toFixed(2)} TASTE</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startGame}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(245,159,11,0.3)'
                  }}
                >
                  <RotateCcw size={16} />
                  {isTR ? 'Tekrar Yarış' : 'Race Again'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { playSound('click'); setGameState('START'); }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    borderRadius: '16px',
                    padding: '14px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {isTR ? 'Ana Menüye Dön' : 'Back to Main Menu'}
                </motion.button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
