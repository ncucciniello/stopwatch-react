import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [isNewSession, setIsNewSession] = useState(true)

  const [startTime, setStartTime] = useState(0)
  const [stopTime, setStopTime] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [currentDuration, setCurrentDuration] = useState(0)

  const START_TEXT = 'Start'
  const STOP_TEXT = 'Stop'
  const RESET_TEXT = 'Reset'
  const LAP_TEXT = 'Lap'

  const formatTime = (timeInMilli) => {
    const totalSeconds = timeInMilli / 1000
    const [minutes, seconds, centiseconds] = [
      totalSeconds / 60,
      totalSeconds % 60,
      (timeInMilli % 1000) / 10
    ].map((num) => Math.floor(num).toString(10).padStart(2, '0'))

    return `${minutes}:${seconds}.${centiseconds}`
  }

  const getTimeStamp = () => {
    isRunning ? setStopTime(Date.now()) : setStartTime(Date.now())
  }

  const runTimer = () => {
    setTimeElapsed((Date.now() - startTime) + currentDuration)
  }

  const startStopwatch = () => {
    setIsRunning(true)
  }

  const stopStopwatch = () => {
    setIsRunning(false)
    setCurrentDuration(timeElapsed)
  }

  const handleStartStopButton = () => {
    getTimeStamp()
    isRunning ? stopStopwatch() : startStopwatch()
  }

  useEffect(() => {
    let interval
    if(isRunning) {
        console.log('start time', startTime)
        interval = setInterval(() => {runTimer()}, 1000 / 60)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  return (
    <div>
      <main>

        <div className="time">{formatTime(timeElapsed)}</div>

        <div className="controls">
          <button className="lap-reset-button" disabled>Lap</button>
          <button 
            className={"start-stop-button " + (isRunning ? "stop" : "start")} 
            onClick={() => handleStartStopButton()} 
          >
            {isRunning ? STOP_TEXT : START_TEXT}
          </button>
        </div>

        <div className="lap-list-container">
          <ul className="lap-list">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>

      </main>
    </div>
  )
}

export default App