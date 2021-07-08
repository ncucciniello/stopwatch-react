import React, { useEffect, useState } from 'react'
import './App.css'

const formatTime = (timeInMilli) => {
  const totalSeconds = timeInMilli / 1000
  const [minutes, seconds, centiseconds] = [
    totalSeconds / 60,
    totalSeconds % 60,
    (timeInMilli % 1000) / 10
  ].map((num) => Math.floor(num).toString(10).padStart(2, '0'))

  return `${minutes}:${seconds}.${centiseconds}`
}


function App() {
  const [startTime, setStartTime] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timeBeforePause, setTimeBeforePause] = useState(0)

  const [laps, setLaps] = useState([])
  const [numOfLaps, setNumOfLaps] = useState(1)
  const [currentLapDuration, setCurrrentLapDuration] = useState(0)
  const [totalLapDuration, setTotalLapDuration] = useState(0)

  const START_TEXT = 'Start'
  const STOP_TEXT = 'Stop'
  const RESET_TEXT = 'Reset'
  const LAP_TEXT = 'Lap'

  const handleStartStopButton = () => {
    startTime ? stopStopwatch() : startStopwatch()
  }  

  const handleLapResetButton = () => {
    if (startTime) {
      addLap()
    } else {
      resetTimer()
      resetLaps()
    }
  }
  
  const startStopwatch = () => {
    setStartTime(Date.now())
  }

  const stopStopwatch = () => {
    setStartTime(0)
    setTimeBeforePause(timeElapsed)
  }

  const runTimer = () => setTimeElapsed((Date.now() - startTime) + timeBeforePause)

  const resetTimer = () => {
    setTimeElapsed(0)
    setTimeBeforePause(0)
  }
  
  const runLap = () => setCurrrentLapDuration(timeElapsed - totalLapDuration)
    
  const addLap = () => {
    let lapStatus = ''

    setTotalLapDuration(totalLapDuration => totalLapDuration + currentLapDuration)

    const newLaps = [{'lapNum': numOfLaps, 'lapTime': currentLapDuration, 'lapStatus': lapStatus}, ...laps]
    setLaps(newLaps)

    setNumOfLaps(numOfLaps => numOfLaps + 1)
  }

  const resetLaps = () => {
    setLaps([])
    setNumOfLaps(1)
    setCurrrentLapDuration(0)
    setTotalLapDuration(0)
  }
  
  useEffect(() => {
    let intervalID
    if (startTime) {
        intervalID = setInterval(() => { 
          runTimer()
        }, 1000 / 60)
    }
    return () => clearInterval(intervalID)
  }, [startTime])

  useEffect(() => {
    runLap()
  }, [timeElapsed])

  return (
    <div>
      <main>
        <div className="time">{formatTime(timeElapsed)}</div>

        <div className="controls">
          <button 
            className="lap-reset-button" 
            onClick={handleLapResetButton} 
            disabled={!timeElapsed}
          >
            {startTime || !timeElapsed ? LAP_TEXT : RESET_TEXT}
          </button>
          <button 
            className={"start-stop-button " + (startTime ? "stop" : "start")} 
            onClick={handleStartStopButton} 
          >
            {startTime ? STOP_TEXT : START_TEXT}
          </button>
        </div>

        <div className="lap-list-container">
          <ul className="lap-list">
            {laps.map((lap) => { 
              return <li key={lap.lapNum}>Lap {lap.lapNum} <span>{formatTime(lap.lapTime)}</span></li> 
            })}
          </ul>
        </div>

      </main>
    </div>
  )
}

export default App