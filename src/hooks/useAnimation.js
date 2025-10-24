import { useState, useEffect } from 'react'

export function useAnimation(initialState = true) {
  const [isPlaying, setIsPlaying] = useState(initialState)

  const toggle = () => setIsPlaying(prev => !prev)
  const play = () => setIsPlaying(true)
  const pause = () => setIsPlaying(false)

  return {
    isPlaying,
    toggle,
    play,
    pause
  }
}