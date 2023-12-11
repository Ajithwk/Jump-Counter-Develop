import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MyMovie from "./MyMovie1.mp4"
import "./SubjectSelection.css"
function SubjectSelection(props) {
    const location = useLocation();
    const [bin,setBin]=useState(1);
    const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase,setPhase] = useState([1]);
  const videoRef = useRef(null);
  const [currentSubject, setCurrentSubject] = useState(1)
  const [frequency,setFrequency]=useState([0])
  const formData = location.state;

  useEffect(() => {

    handleBin();
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
  }, [running,hours, minutes, seconds]);
useEffect(()=>{
  const handleKeyDown = (e) => {
    if (!isNaN(e.key)) {
      if (parseInt(e.key) <= formData.subjects.length) {
        setCurrentSubject(parseInt(e.key));
      }
    }
    else if (e.key == 'f' && !e.repeat) {
      console.log('before',{frequency})
      setFrequency((prevFrequency) => {
        const updatedFrequency = [...prevFrequency];
        updatedFrequency[currentSubject - 1] = (updatedFrequency[currentSubject - 1] || 0) + 1;
        return updatedFrequency;
      });
      console.log('after',{frequency})
    }
  };
  document.addEventListener('keydown', handleKeyDown);
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
})
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
  // console.log({formData})
    var hms =hours.toString().padStart(2, "0")+":"+minutes.toString().padStart(2, "0")+":"+seconds.toString().padStart(2, "0");   // your input string
    var a = hms.split(':'); // split it at the colons

    var s = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
      if((s%formData.binSize)==0 && s!=0){ 

        setBin((s/formData.binSize)+1)

      }
      if(formData.subjects.length>phase.length){
        setPhase([...phase,[1]*(formData.subjects.length-phase.length)])
      }
      if(formData.subjects.length>frequency.length){
        setFrequency([...frequency,[0]*(formData.subjects.length-frequency.length)])
       
      }
      for(let i in formData.subjects){
        if(((formData.subjects[i].phaseOneMinutes)*60+ formData.subjects[i].phaseOneSeconds)==s ){
          let tem = phase;
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

    <video id="videobox"
      ref={videoRef}
      width="1470"
      height="600"
      controls={false}
      onEnded={handleVideoEnd}
      src={MyMovie} // Replace with the actual path
      type="video/mp4"
    >
      Your browser does not support the video tag.
    </video>
    </div>
    <div className="blocks-container">
    
    <div className="block">
      <p>Subject we are in: {currentSubject}</p>
      <p>Bin: {bin}</p>
      <p>{`${hours.toString().padStart(2, "0")}:${minutes
       .toString()
       .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}</p>
      </div>
    
      <div className="block">
        
      <p className="frequency-block">Frequency: {frequency[currentSubject - 1]}</p>
      
      </div>
    
      <div className="block">
      <p>Phase we are in: {phase[currentSubject - 1]}</p>
      <p>Date: {(new Date()).toLocaleString()}</p>
      <p>Group: {formData.subjects[currentSubject - 1].dropdownSelection}</p>
      <p>Condition: <input type="text" /></p>
      </div>
    </div>

    <div className="buttons-container">
    <button onClick={ handleStart} disabled={running}>
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
