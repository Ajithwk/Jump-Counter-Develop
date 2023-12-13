import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./SubjectSelection.css";

function SubjectSelection() {
  const location = useLocation();
  const formData = location.state;
  const [bin, setBin] = useState(1);
  const [seconds, setSeconds] = useState(Array.from({ length: (formData?.subjects?.length || 0) }, () => 0));
const [minutes, setMinutes] = useState(Array.from({ length: (formData?.subjects?.length || 0) }, () => 0));
const [hours, setHours] = useState(Array.from({ length: (formData?.subjects?.length || 0) }, () => 0));
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(1);
  const [subjectTimers, setSubjectTimers] = useState(Array.from({ length: (formData?.subjects?.length || 0) }, () => null));
  const videoRef = useRef(null);
  const [frequency, setFrequency] = useState([]);
  const video = formData?.uploadedVideo;
  const videoURL = video ? URL.createObjectURL(video) : null;

  // State to track whether the timer has been started for each subject
  const [subjectTimerStarted, setSubjectTimerStarted] = useState(Array.from({ length: (formData?.subjects?.length || 0) }, () => false));

useEffect(()=>{
  setSubjectTimerStarted((t)=>{
    return t.map((b, index) => {
      if (index === 0) {
        return true;
      }
      return b;
    });
  })

},[]);



  useEffect(() => {
    handleBin();
    let interval;
    // console.log({seconds})
    const startTimer = () => {
      interval = setInterval(() => {
        for(let sub in formData.subjects){
          if(subjectTimerStarted[sub]){
            console.log(subjectTimerStarted[sub])
        setSeconds((prevSeconds) => {
          if (prevSeconds[sub] == 59) {
            setMinutes((prevMinutes) => {
              if (prevMinutes[sub] == 59) {
                setHours((prevHours) => {
                  const newHours = [...prevHours];
                  newHours[sub] = newHours[sub] + 1;
                  return newHours;
                });
                prevMinutes[sub] = 0;
                return [...prevMinutes];
              }
              return prevMinutes.map((prevMinute, index) => {
                if (index == sub) {
                  return prevMinute + 1;
                }
                return prevMinute;
              });
            });
            prevSeconds[sub] = 0;
            return [...prevSeconds];
          }
          return prevSeconds.map((prevSecond, index) => {
            if (index == sub) {
              return prevSecond + 1;
            }
            return prevSecond;
          });
        });

          
        }
      }
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
  }, [running, hours[currentSubject-1], minutes[currentSubject-1], seconds[currentSubject-1], currentSubject]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isNaN(e.key)) {
        const key = parseInt(e.key);
        if (key <= (formData?.subjects?.length || 0)) {
          setCurrentSubject(key);

          // Start the timer for the selected subject if not started
          if (!subjectTimerStarted[key - 1]) {
            setSubjectTimerStarted((prevStarted) => {
              const newStarted = [...prevStarted];
              newStarted[key - 1] = true;
              return newStarted;
            });

            // Reset the timer to 0 when opening the subject for the first time
            // setHours(0);
            // setMinutes(0);
            // setSeconds(0);
          }

          // if (!subjectTimers[key - 1]) {
          //   setSubjectTimers((prevTimers) => {
          //     const newTimers = [...prevTimers];
          //     newTimers[key - 1] = new Date().getTime();
          //     return newTimers;
          //   });
          // }
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
  }, [currentSubject, formData?.subjects?.length, subjectTimers, subjectTimerStarted]);

  useEffect(() => {
    handleBin();
  }, [hours, minutes, seconds, bin, formData?.binSize, formData?.subjects?.length, phase]);

  const handleStart = () => {
    setRunning(true);

    // Start the timer for the selected subject if not started
    // if (!subjectTimers[currentSubject - 1]) {
    //   setSubjectTimers((prevTimers) => {
    //     const newTimers = [...prevTimers];
    //     newTimers[currentSubject - 1] = new Date().getTime();
    //     return newTimers;
    //   });
    // }

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

  const handleBin = () => {
    // console.log(hours[currentSubject-1],minutes[currentSubject-1],seconds[currentSubject-1])
    for(let sub in formData.subjects){
    var hms = `${hours[sub].toString().padStart(2, "0")}:${minutes[sub].toString().padStart(2, "0")}:${seconds[sub].toString().padStart(2, "0")}`;
    var a = hms.split(':');

    var s = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
    if (s % (formData?.binSize || 1) === 0 && s !== 0) {
      setBin((s / (formData?.binSize || 1)) + 1);
    }

    if ((formData?.subjects?.length || 0) > phase.length) {
      setPhase((prevPhase) => [...prevPhase, ...Array((formData?.subjects?.length || 0) - prevPhase.length).fill(1)]);
    }

    if ((formData?.subjects?.length || 0) > frequency.length) {
      setFrequency([...frequency, ...Array((formData?.subjects?.length || 0) - frequency.length).fill(0)]);
    }

    for (let i = 0; i < (formData?.subjects?.length || 0); i++) {
      const p = parseInt(formData?.subjects[i]?.phaseOneMinutes || 0) * 60 + parseInt(formData?.subjects[i]?.phaseOneSeconds || 0);
      if (p === s) {
        setPhase((prevPhase) => {
          const updatedPhase = [...prevPhase];
          if (updatedPhase.length <= i) {
            updatedPhase.push(2);
          } else {
            updatedPhase[i] = 2;
          }
          return updatedPhase;
        });
      }
    }
  }
    // return bin;

  };

  return (
    <div className="container1">
      <div className="video-container">
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          controls={true}
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
          <p>{`${hours[currentSubject-1].toString().padStart(2, "0")}:${minutes[currentSubject-1].toString().padStart(2, "0")}:${seconds[currentSubject-1].toString().padStart(2, "0")}`}</p>
        </div>
        <div className="block">
          <p className="frequency-block">Frequency: {frequency[currentSubject - 1]}</p>
        </div>
        <div className="block">
          <p>Phase we are in: {phase[currentSubject - 1]}</p>
          <p>Date: {(new Date()).toLocaleString()}</p>
          <p>Group: {(formData?.subjects && formData?.subjects[currentSubject - 1]?.dropdownSelection) || ""}</p>
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

