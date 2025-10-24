import { useState, useEffect, useRef } from 'react'
import catImage from '../assets/images/cat.svg'
import flyingDollar from '../assets/images/flying-dollar.svg'
import '../styles/animations.css'

function DancingCat() {
  const [animationType, setAnimationType] = useState('none') // 'none', 'jump', 'dance', 'crazy'
  const [speed, setSpeed] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [randomDance, setRandomDance] = useState('dance1')
  const [crazyPosition, setCrazyPosition] = useState({ x: 0, y: 0 })
  const [crazyRotation, setCrazyRotation] = useState(0)
  const [crazyScale, setCrazyScale] = useState(1)
  const audioRef = useRef(null)
  const danceAudioRef = useRef(null)
  const crazyIntervalRef = useRef(null)
  const [showDonationPopup, setShowDonationPopup] = useState(false)

  // Random dance animation changer
  useEffect(() => {
    if (animationType === 'dance') {
      const dances = ['dance1', 'dance2', 'dance3', 'dance4', 'dance5']
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * dances.length)
        setRandomDance(dances[randomIndex])
      }, 2000 + Math.random() * 2000) // Random interval between 2-4 seconds

      return () => clearInterval(interval)
    }
  }, [animationType])

  const handleJump = () => {
    if (crazyIntervalRef.current) {
      clearInterval(crazyIntervalRef.current)
      crazyIntervalRef.current = null
    }

    if (animationType === 'jump') {
      // Already jumping - trigger another jump by resetting
      setAnimationType('none')
      setTimeout(() => {
        setAnimationType('jump')
      }, 10)
    } else {
      setAnimationType('jump')
      setIsPlaying(true)
    }
  }

  const handleDance = () => {
    if (crazyIntervalRef.current) {
      clearInterval(crazyIntervalRef.current)
      crazyIntervalRef.current = null
    }

    if (animationType === 'dance') {
      setAnimationType('none')
      setIsPlaying(false)
      if (danceAudioRef.current) {
        danceAudioRef.current.pause()
      }
    } else {
      setAnimationType('dance')
      setIsPlaying(true)
      if (danceAudioRef.current) {
        danceAudioRef.current.play()
      }
    }
  }

  const handleCrazy = () => {
    if (animationType === 'crazy') {
      setAnimationType('none')
      setIsPlaying(false)
      if (crazyIntervalRef.current) {
        clearInterval(crazyIntervalRef.current)
        crazyIntervalRef.current = null
      }
      setCrazyPosition({ x: 0, y: 0 })
      setCrazyRotation(0)
      setCrazyScale(1)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    } else {
      setAnimationType('crazy')
      setIsPlaying(true)
      if (audioRef.current) {
        audioRef.current.play()
      }

      // Start DOPE mode - 진짜 미친 움직임
      crazyIntervalRef.current = setInterval(() => {
        const randomX = Math.random() * window.innerWidth * 0.8 - window.innerWidth * 0.4
        const randomY = Math.random() * window.innerHeight * 0.8 - window.innerHeight * 0.4
        const randomRotation = Math.random() * 1080 - 540 // 더 많이 회전
        const randomScale = 0.3 + Math.random() * 2 // 더 극단적인 크기 변화

        setCrazyPosition({ x: randomX, y: randomY })
        setCrazyRotation(randomRotation)
        setCrazyScale(randomScale)
      }, 100 + Math.random() * 200) // 더 빠르게!
    }
  }

  const handleSpeedChange = (e) => {
    setSpeed(parseFloat(e.target.value))
  }

  const handleDonation = () => {
    setShowDonationPopup(true)
  }

  const closeDonationPopup = () => {
    setShowDonationPopup(false)
  }

  const animationDuration = 2 / speed

  let animationClass = ''
  let inlineStyle = {
    animationDuration: `${animationDuration}s`
  }

  if (animationType === 'jump') {
    animationClass = 'jumping'
  } else if (animationType === 'dance') {
    animationClass = `dancing ${randomDance}`
  } else if (animationType === 'crazy') {
    animationClass = 'crazy'
    inlineStyle = {
      ...inlineStyle,
      transform: `translate(${crazyPosition.x}px, ${crazyPosition.y}px) rotate(${crazyRotation}deg) scale(${crazyScale})`,
      transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  }

  return (
    <div className={`dancing-cat-container ${animationType === 'crazy' ? 'dope-container' : ''}`}>
      {/* Donation Button */}
      <button className="donation-button" onClick={handleDonation} title="Support me!">
        <img src={flyingDollar} alt="Donate" className="dollar-icon" />
      </button>

      <div className={`cat-wrapper ${animationType === 'crazy' ? 'crazy-mode' : ''}`}>
        <img
          src={catImage}
          alt="Dancing Cat"
          className={`cat-image ${animationClass}`}
          style={inlineStyle}
        />
      </div>

      <div className="controls">
        <div className="button-group">
          <button onClick={handleJump} className="control-button jump-btn">
            jump
          </button>
          <button
            onClick={handleDance}
            className={`control-button dance-btn ${animationType === 'dance' ? 'active' : ''}`}
          >
            {animationType === 'dance' ? 'pause' : 'dance'}
          </button>
          <button
            onClick={handleCrazy}
            className={`control-button crazy-btn ${animationType === 'crazy' ? 'active' : ''}`}
          >
            {animationType === 'crazy' ? 'chill' : 'dope'}
          </button>
        </div>

        <div className="speed-control">
          <label htmlFor="speed-slider">
            speed {speed.toFixed(1)}x
          </label>
          <input
            id="speed-slider"
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={speed}
            onChange={handleSpeedChange}
            className="speed-slider"
          />
          <div className="speed-labels">
            <span>slow</span>
            <span>chill</span>
            <span>fast</span>
          </div>
        </div>
      </div>

      {/* Background Music - Default Lofi */}
      <audio ref={audioRef} loop autoPlay>
        <source src="https://www.bensound.com/bensound-music/bensound-slowmotion.mp3" type="audio/mpeg" />
      </audio>

      {/* Dance Music - Heavy Bass & Kick */}
      <audio ref={danceAudioRef} loop>
        <source src="https://www.bensound.com/bensound-music/bensound-energy.mp3" type="audio/mpeg" />
      </audio>

      {/* Donation Popup */}
      {showDonationPopup && (
        <div className="donation-popup-overlay" onClick={closeDonationPopup}>
          <div className="donation-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup" onClick={closeDonationPopup}>×</button>
            <h2>후원해주세요! 💖</h2>
            <p className="donation-message">
              vibin' cat이 마음에 드셨나요?<br />
              커피 한 잔의 여유로 응원해주세요!
            </p>
            <div className="account-info">
              <p className="account-label">후원 계좌번호</p>
              <p className="account-number">국민은행 653202-04-129363</p>
            </div>
            <button className="copy-button" onClick={() => {
              navigator.clipboard.writeText('653202-04-129363')
              alert('계좌번호가 복사되었습니다!')
            }}>
              계좌번호 복사
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DancingCat