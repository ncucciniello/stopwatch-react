import React, { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [isNewSession, setIsNewSession] = useState(true)

  const [startTime, setStartTime] = useState(0)
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0)
  const [timeBeforePause, setTimeBeforePause] = useState(0)

  const [laps, setLaps] = useState([])
  const [numOfLaps, setNumOfLaps] = useState(1)
  const [currentLapDuration, setCurrrentLapDuration] = useState(0)
  const [totalLapDuration, setTotalLapDuration] = useState(0)
  // const [longestLap, setLongestLap] = useState(0)
  // const [shortestLap, setShortestLap] = useState(9999999)

  const START_TEXT = 'Start'
  const STOP_TEXT = 'Stop'
  const RESET_TEXT = 'Reset'
  const LAP_TEXT = 'Lap'

  const handleStartStopButton = () => {
    setStartTime(Date.now())
    isRunning ? stopStopwatch() : startStopwatch()
  }  

  const handleLapResetButton = () => {
    if (isRunning) {
      addLap()
    } else {
      resetTimer()
      resetLaps()
    }
  }
  
  const startStopwatch = () => {
    setIsRunning(true)
    setIsNewSession(false)
  }

  const stopStopwatch = () => {
    setIsRunning(false)
    setTimeBeforePause(totalTimeElapsed)
  }
  
  const runTimer = () => setTotalTimeElapsed((Date.now() - startTime) + timeBeforePause)

  const resetTimer = () => {
    setIsNewSession(true)
    setStartTime(0)
    setTotalTimeElapsed(0)
    setTimeBeforePause(0)
  }
  
  const runLap = () => setCurrrentLapDuration(totalTimeElapsed - totalLapDuration)
    
  const addLap = () => {
    setTotalLapDuration(totalLapDuration => totalLapDuration + currentLapDuration)

    const newLaps = [{'lapNum': numOfLaps, 'lapTime': currentLapDuration}, ...laps]

    setLaps(newLaps)
    setNumOfLaps(numOfLaps => numOfLaps + 1)
  }

  const resetLaps = () => {
    setLaps([])
    setNumOfLaps(1)
    setCurrrentLapDuration(0)
    setTotalLapDuration(0)
  }

  const formatTime = (timeInMilli) => {
    const totalSeconds = timeInMilli / 1000
    const [minutes, seconds, centiseconds] = [
      totalSeconds / 60,
      totalSeconds % 60,
      (timeInMilli % 1000) / 10
    ].map((num) => Math.floor(num).toString(10).padStart(2, '0'))

    return `${minutes}:${seconds}.${centiseconds}`
  }
  
  useEffect(() => {
    let intervalID
    if (isRunning) {
        intervalID = setInterval(() => { 
          runTimer()
        }, 1000 / 60)
    }
    return () => clearInterval(intervalID)
  }, [isRunning])

  useEffect(() => {
      runLap()
  }, [totalTimeElapsed])


  return (
    <div>
      <main>
        <div className="time">{formatTime(totalTimeElapsed)}</div>

        <div className="controls">
          <button 
            className="lap-reset-button" 
            onClick={() => handleLapResetButton()} 
            disabled={isNewSession}
          >
            {isRunning || isNewSession ? LAP_TEXT : RESET_TEXT}
          </button>
          <button 
            className={"start-stop-button " + (isRunning ? "stop" : "start")} 
            onClick={() => handleStartStopButton()} 
          >
            {isRunning ? STOP_TEXT : START_TEXT}
          </button>
        </div>

        <div className="lap-list-container">
          <ul className="lap-list">
            {laps.map((lap, index) => { 
              return <li key={index}>Lap {lap.lapNum}<span>{formatTime(lap.lapTime)}</span></li> 
            })}
          </ul>
        </div>

      </main>
    </div>
  )
}

export default App