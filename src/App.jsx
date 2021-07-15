import React, { useEffect, useState } from 'react'
import './App.css'

import formatTime  from './utils/formatTime'

const initalLongestLap = {lapNum: 0, lapTime: 0}
const initalShortestLap = {lapNum: 0, lapTime: Number.MAX_VALUE}

const App = () => {
  const [startTime, setStartTime] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const [laps, setLaps] = useState([])
  const [totalLapDuration, setTotalLapDuration] = useState(0)
  const [longestLap, setLongestLap] = useState(initalLongestLap)
  const [shortestLap, setShortestLap] = useState(initalShortestLap)

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

  const runTimer = () => {
    setTimeElapsed(timeElapsed + (Date.now() - startTime))
  }

  const runLap = () => {
    const newLaps = [...laps]
    newLaps[0].lapTime = timeElapsed - totalLapDuration

    setLaps(newLaps)
  }

  const addLap = () => {
    const newLaps = [{ lapNum: (laps.length + 1), lapTime: 0,  }, ...laps]

    if (laps.length > 0) {
      if (newLaps[1].lapTime > longestLap.lapTime) {
        setLongestLap({ lapNum: newLaps[1].lapNum, lapTime: newLaps[1].lapTime })
      }
      if (newLaps[1].lapTime < shortestLap.lapTime) {
        setShortestLap({ lapNum: newLaps[1].lapNum, lapTime: newLaps[1].lapTime })
      }
    }

    setTotalLapDuration(timeElapsed)
    setLaps(newLaps)
  }

  const resetStopWatch = () => {
    setTimeElapsed(0)
    setLaps([])
    setTotalLapDuration(0)
    setLongestLap(initalLongestLap)
    setShortestLap(initalShortestLap)
  }
  
  const displayLaps = (lapsArray) => lapsArray.map((lap) => (
    <li
      key={lap.lapNum}
      className={lapsArray.length > 2 ? handleLapClass(lap): ''}
    >
      Lap {lap.lapNum} <span>{formatTime(lap.lapTime)}</span>
    </li>
  ))
  
  const handleLapClass = (currentLap) => {
    if (currentLap.lapNum === longestLap.lapNum) {
      return 'longest'
    } 
    
    if (currentLap.lapNum === shortestLap.lapNum) {
      return 'shortest'
    } 
    
    return '' 
  }

  const displayEmptyLaps = (lapsArray) => {
    const maxNumOfEmptyLaps = 6
    const numOfEmptyLaps = maxNumOfEmptyLaps - lapsArray.length
  
    const emptyLaps = [...Array(numOfEmptyLaps)].map((_, index) => <li key={index - maxNumOfEmptyLaps} />)
  
    return emptyLaps
  }
  
  const handleLapsDisplay = () => { 
    if (laps.length > 0) { 
      return displayLaps(laps) 
    }
  }

  const handleEmptyLapsDisplay = () => { 
    if (laps.length < 6) { 
      return displayEmptyLaps(laps) 
    }
  }
  const handleStartStopButton = () => startTime ? setStartTime(0) : startStopwatch()
  const handleLapResetButton = startTime ? addLap : resetStopWatch
  
  const lapResetButtonText = (startTime || !timeElapsed) ? 'Lap' : 'Reset'
  const startStopButtonText = startTime ? 'Stop' : 'Start'
  const startStopButtonClassName = startTime ? "stop" : "start"

  return (
    <main>
      <h1 className="time">{formatTime(timeElapsed)}</h1>

      <div className="controls">
        <button
          type="button"
          className="lap-reset-button"
          onClick={handleLapResetButton}
          disabled={!timeElapsed}
        >
          {lapResetButtonText}
        </button>
        <button
          type="button"
          className={`start-stop-button ${startStopButtonClassName}`}
          onClick={handleStartStopButton}
        >
          {startStopButtonText}
        </button>
      </div>

      <div className="lap-list-container">
        <ul className="lap-list">
          {handleLapsDisplay()}
          {handleEmptyLapsDisplay()}
        </ul>
      </div>
    </main>
  )
}

export default App