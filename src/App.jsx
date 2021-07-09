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

  const [laps, setLaps] = useState([])
  const [totalLapDuration, setTotalLapDuration] = useState(0)

  const START_TEXT = 'Start'
  const STOP_TEXT = 'Stop'
  const RESET_TEXT = 'Reset'
  const LAP_TEXT = 'Lap'

  const handleStartStopButton = () => {
    startTime ? setStartTime(0) : startStopwatch()
  }  

  const handleLapResetButton = () => {
    startTime ? addLap() : resetStopWatch()
  }

  const startStopwatch = () => {
    !timeElapsed && addLap()
  
    setStartTime(Date.now())
  }
  
  const runTimer = () => setTimeElapsed(timeElapsed + (Date.now() - startTime))

  const runLap = () => {
    const newLapsArray = [...laps]
    const currentLap = newLapsArray[0]

    currentLap.lapTime = timeElapsed - totalLapDuration

    setLaps(newLapsArray)
  }

  const addLap = () => {
    let lapStatus = ''
    
    const newLaps = [{'lapNum': (laps.length + 1), 'lapTime': 0, 'lapStatus': ''}, ...laps]
    
    setTotalLapDuration(timeElapsed)
    setLaps(newLaps)
  }

  const resetStopWatch = () => {
    setTimeElapsed(0)
    setLaps([])
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
    timeElapsed && runLap()
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
              return <li key={lap.lapNum} className={lap.lapStatus}>Lap {lap.lapNum} <span>{formatTime(lap.lapTime)}</span></li> 
            })}
          </ul>
        </div>

      </main>
    </div>
  )
}

export default App