const formatTime = (timeInMilli) => {
    const totalSeconds = timeInMilli / 1000
    const [minutes, seconds, centiseconds] = [
      totalSeconds / 60,
      totalSeconds % 60,
      (timeInMilli % 1000) / 10
    ].map((num) => Math.floor(num).toString(10).padStart(2, '0'))
    
    return `${minutes}:${seconds}.${centiseconds}`
  }

export default formatTime