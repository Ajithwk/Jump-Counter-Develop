import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./SubjectSelection.css";

function SubjectSelection(props) {
  const location = useLocation();
  const [bin, setBin] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(1);
  const videoRef = useRef(null);
  const [frequency, setFrequency] = useState([]);
  const formData = location.state;
  const video = formData?.uploadedVideo; // Use optional chaining to prevent errors if formData is undefined
  const videoURL = video ? URL.createObjectURL(video) : null;



  useEffect(() => {
    handleBin();
    let interval;

    const startTimer = () => {
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
    };

    const stopTimer = () => {
      clearInterval(interval);
    };

    if (running) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [running, hours, minutes, seconds]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isNaN(e.key)) {
        if (parseInt(e.key) <= formData?.subjects?.length) {
          setCurrentSubject(parseInt(e.key));
        }
      } else if (e.key === 'f' && !e.repeat) {
        setFrequency((prevFrequency) => {
          const updatedFrequency = [...prevFrequency];
          updatedFrequency[currentSubject - 1] = (updatedFrequency[currentSubject - 1] || 0) + 1;
          return updatedFrequency;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSubject, formData?.subjects?.length]);

  useEffect(() => {
    handleBin();
  }, [hours, minutes, seconds, bin, formData?.binSize, formData?.subjects?.length, phase]);

  const handleStart = () => {
    setRunning(true);
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  };

  const handleStop = () => {
    setRunning(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleVideoEnd = () => {
    setRunning(false);
  };
  const handleBin = () =>{
      var hms =hours.toString().padStart(2, "0")+":"+minutes.toString().padStart(2, "0")+":"+seconds.toString().padStart(2, "0");   // your input string
      var a = hms.split(':'); // split it at the colons
  
      var s = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
        if((s%formData.binSize)==0 && s!=0){ 
  
          setBin((s/formData.binSize)+1)
  
        }
        if(formData.subjects.length>phase.length){
          setPhase((prevPhase) => [...prevPhase, ...Array(formData.subjects.length - prevPhase.length).fill(1)]);
        }
        if(formData.subjects.length>frequency.length){
          setFrequency([...frequency,[0]*(formData.subjects.length-frequency.length)])
         
        }
       
        for(let i in formData.subjects){
          const p = parseInt(formData.subjects[i].phaseOneMinutes)*60+ parseInt(formData.subjects[i].phaseOneSeconds)
          if( p==s){
            let tem = phase;
            console.log({tem})
            if(tem.length<=i){
              tem.push(2)
            }else{
              tem[i]=2
            }
            setPhase(tem)
          }
          
        }
  
      return bin
  }
  
  return (
    <div className="container1">
      <div className="video-container">
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          controls={false}
          onEnded={handleVideoEnd}
        >
          <source src={videoURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="blocks-container">
        <div className="block">
          <p>Subject we are in: {currentSubject}</p>
          <p>Bin: {bin}</p>
          <p>{`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</p>
        </div>
        <div className="block">
          <p className="frequency-block">Frequency: {frequency[currentSubject - 1]}</p>
        </div>
        <div className="block">
          <p>Phase we are in: {phase[currentSubject-1]}</p>
          <p>Date: {(new Date()).toLocaleString()}</p>
          <p>Group: {formData.subjects[currentSubject - 1].dropdownSelection}</p>
          <p>Condition: <input type="text" /></p>
        </div>
      </div>
      <div className="buttons-container">
        <button onClick={handleStart} disabled={running}>
          Start
        </button>
        <button onClick={handleStop} disabled={!running}>
          Pause
        </button>
      </div>
    </div>
  );
}

export default SubjectSelection;
