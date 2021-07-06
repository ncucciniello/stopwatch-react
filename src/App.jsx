import React, { useEffect, useState } from 'react'
import './App.css'


const initialState = {

}


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

  
  const handleStartStopButton = () => {
    getTimeStamp()
    isRunning ? stopStopwatch() : startStopwatch()
  }  

  const handleLapResetButton = () => {
    if (isRunning) {
      console.log('lap pressed')
    } else {
      console.log('reset pressed')
      resetTimer()
    }
  }

  const getTimeStamp = () => isRunning ? setStopTime(Date.now()) : setStartTime(Date.now())
  
  const startStopwatch = () => {
    setIsRunning(true)
    setIsNewSession(false)
  }

  const stopStopwatch = () => {
    setIsRunning(false)
    setCurrentDuration(timeElapsed)
  }
  
  const runTimer = () => setTimeElapsed((Date.now() - startTime) + currentDuration)

  const resetTimer = () => {
      setIsNewSession(true)
      setStartTime(0)
      setStopTime(0)
      setTimeElapsed(0)
      setCurrentDuration(0)
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
    if(isRunning) {
        intervalID = setInterval(() => { runTimer() }, 1000 / 60)
    }
    return () => clearInterval(intervalID)
  }, [isRunning])




  return (
    <div>
      <main>

        {/* <Display /> */}
        <div className="time">{formatTime(timeElapsed)}</div>

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