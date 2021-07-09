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
  const [shortestLap, setShortestLap] = useState({ lapNum: 0, lapTime: Number.MAX_VALUE })
  const [longestLap, setLongestLap] = useState({ lapNum: 0, lapTime: 0 })

  useEffect(() => {
    if (startTime) {
      const intervalID = setInterval(runTimer, 1000 / 60)
      return () => clearInterval(intervalID)
    }
  }, [startTime])
  
  useEffect(() => {
    if (timeElapsed) {
      runLap()
    }
  }, [timeElapsed])
  
  const startStopwatch = () => {
    if (!timeElapsed) {
      addLap()
    }
    
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
    const newLaps = [{ lapNum: (laps.length + 1), lapTime: 0 }, ...laps]
    
    if (laps.length > 0) {
      newLaps[1].lapTime > longestLap.lapTime && setLongestLap({lapNum: newLaps[1].lapNum, lapTime: newLaps[1].lapTime})
      newLaps[1].lapTime < shortestLap.lapTime && setShortestLap({lapNum: newLaps[1].lapNum, lapTime: newLaps[1].lapTime})
    }

    setTotalLapDuration(timeElapsed)
    setLaps(newLaps)
  }
  
  const resetStopWatch = () => {
    setTimeElapsed(0)
    setLaps([])
    setTotalLapDuration(0)
  }
  
  const displayLapLines = () => {
    const lapsToDisplay = 5 - laps.length
    let emptyLaps = []

    for (let i = 0; i <= lapsToDisplay; i++) {
      emptyLaps.push('')
    } 

    return emptyLaps
  }
  
  const handleStartStopButton = () => {startTime ? setStartTime(0) : startStopwatch()}
  const handleLapResetButton = startTime ? addLap : resetStopWatch
  
  const lapResetButtonText = (startTime || !timeElapsed) ? 'Lap' : 'Reset'
  const startStopButtonText = startTime ? 'Stop' : 'Start'
  const startStopButtonClassName = startTime ? "stop" : "start"
  

  return (
    <>
      <main>
        <h1 className="time">{formatTime(timeElapsed)}</h1>

        <div className="controls">
          <button
            className="lap-reset-button"
            onClick={handleLapResetButton}
            disabled={!timeElapsed}
          >
            {lapResetButtonText}
          </button>
          <button
            className={"start-stop-button " + startStopButtonClassName}
            onClick={handleStartStopButton}
          >
            {startStopButtonText}
          </button>
        </div>

        <div className="lap-list-container">
          <ul className="lap-list">
            {laps.map((lap) => {
              return (
                <li
                  key={lap.lapNum}
                  className={
                    laps.length > 2 ?
                    lap.lapNum === longestLap.lapNum ? 'longest' : 
                    lap.lapNum === shortestLap.lapNum ? 'shortest' :
                    '' : ''
                  }
                >
                  Lap {lap.lapNum} <span>{formatTime(lap.lapTime)}</span>
                </li>
              )
            })}
            {displayLapLines().map((item, index) => {
              return <li key={index + 6}></li>
            })}
          </ul>
        </div>
      </main>
    </>
  )
}

export default App