import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MyMovie from "./MyMovie1.mp4"

function SubjectSelection(props) {
    const location = useLocation();
    const [bin,setBin]=useState(1);
    const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [running, setRunning] = useState(false);
  const videoRef = useRef(null);
  const formData = location.state;

  useEffect(() => {
    console.log(location.state)
    let interval;
    if (running) {
      // Immediately start playing the video
      videoRef.current.play();

      // Start the timer
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 59) {
                setHours((prevHours) => prevHours + 1);
                return 0;
              }
              return prevMinutes + 1;
            });
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

    return () => clearInterval(interval);
  }, [running]);

  const handleStart = () => {
    setRunning(true);
  };

  const handleStop = () => {
    setRunning(false);
  };

  const handleVideoEnd = () => {
    setRunning(false);
  };

const handleBin = () =>{
    var hms =hours.toString().padStart(2, "0")+":"+minutes.toString().padStart(2, "0")+":"+seconds.toString().padStart(2, "0");   // your input string
    var a = hms.split(':'); // split it at the colons

    var s = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
    // if(s<=formData.)
    return bin
}

    return (
     <div>

     <button onClick={handleStart} disabled={running}>
       Start
     </button>
     <button onClick={handleStop} disabled={!running}>
       Stop
     </button>
     <video
       ref={videoRef}
       width="600"
       height="400"
       controls
       onEnded={handleVideoEnd}
       src={MyMovie} // Replace with the actual path
       type="video/mp4"
     >
       Your browser does not support the video tag.
     </video>
     <p>{`${hours.toString().padStart(2, "0")}:${minutes
       .toString()
       .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</p>
       <p>Bin {handleBin()}</p>
   </div>
    );
}

export default SubjectSelection;