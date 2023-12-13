import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Papa from "papaparse";
import "./SubjectSelection.css";

function SubjectSelection() {
  const location = useLocation();
  const formData = location.state;
  const [bin, setBin] = useState([]);
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
  setSeconds((t)=>{
    return t.map((b, index) => {
      if (index === 0) {
        return 0;
      }
      return b;
    });
  })
  if ((formData?.subjects?.length || 0) > bin.length) {
    setBin((prevBin) => [...prevBin, ...Array((formData?.subjects?.length || 0) - prevBin.length).fill(1)]);
  }
  if ((formData?.subjects?.length || 0) > phase.length) {
    setPhase((prevPhase) => [...prevPhase, ...Array((formData?.subjects?.length || 0) - prevPhase.length).fill(1)]);
  }

  if ((formData?.subjects?.length || 0) > frequency.length) {
    setFrequency([...frequency, ...Array((formData?.subjects?.length || 0) - frequency.length).fill(0)]);
  }
},[]);



  useEffect(() => {
    let interval;
    // console.log({seconds})
    const startTimer = () => {
      interval = setInterval(() => {
        for(let sub in formData.subjects){
          if(subjectTimerStarted[sub]){
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
  }, [running, hours, minutes, seconds, currentSubject]);

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


          }

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
  }, [hours, minutes, seconds]);

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

  const handleBin = () => {
    // console.log(hours[currentSubject-1],minutes[currentSubject-1],seconds[currentSubject-1])
    for(let sub in formData.subjects){
    var hms = `${hours[sub].toString().padStart(2, "0")}:${minutes[sub].toString().padStart(2, "0")}:${seconds[sub].toString().padStart(2, "0")}`;
    var a = hms.split(':');

    var s = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);


    if (s % (formData?.binSize || 1) === 0 && s !== 0) {
        setBin((prevBins) => {
        const updatedBins = [...prevBins];
        updatedBins[sub] = updatedBins[sub] + 1;
        return updatedBins;
      });
    }
    
    // for (let i = 0; i < (formData?.subjects?.length || 0); i++) {
      const p = parseInt(formData?.subjects[sub]?.phaseOneMinutes || 0) * 60 + parseInt(formData?.subjects[sub]?.phaseOneSeconds || 0);
      if (p === s) {
        setPhase((prevPhase) => {
          const updatedPhase = [...prevPhase];
          if (updatedPhase.length <= sub) {
            updatedPhase.push(2);
          } else {
            updatedPhase[sub] = 2;
          }
          return updatedPhase;
        });
      }
    // }
  }
    // return bin;

  };
  
  const exportToCSV = () => {
    const csvData = [
      ["", ...formData.subjects.map((_, index) => `Subject ${index + 1}`)],
      ["Preinjection/Phase 1"],
      ["Bin 1", ...bin.slice(0, formData.subjects.length)],
      ["Bin 2", ...bin.slice(formData.subjects.length, formData.subjects.length * 2)],
      ["Bin 3", ...bin.slice(formData.subjects.length * 2, formData.subjects.length * 3)],
      ["Post Injection/Phase 2"],
      ["Bin 4", ...bin.slice(formData.subjects.length * 3, formData.subjects.length * 4)],
      ["Bin 5", ...bin.slice(formData.subjects.length * 4, formData.subjects.length * 5)],
      ["Bin 6", ...bin.slice(formData.subjects.length * 5, formData.subjects.length * 6)],
      ["Up to number of bins", ...Array(formData.subjects.length * 6).fill("")], // Adjust if you have more bins
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "export.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
          <p>Bin: {bin[currentSubject-1]}</p>
          <p>{`${hours[currentSubject-1].toString().padStart(2, "0")}:${minutes[currentSubject-1].toString().padStart(2, "0")}:${seconds[currentSubject-1].toString().padStart(2, "0")}`}</p>
        </div>
        <div className="block">
          <p className="frequency-block">Frequency: {frequency[currentSubject - 1]}</p>
        </div>
        <div className="block">
          <p>Phase we are in: {phase[currentSubject - 1]}</p>
          <p>Date: {(new Date()).toDateString()}</p>
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
        <button onClick={exportToCSV}>
          Export to CSV
        </button>
      </div>
    </div>
  );
}

export default SubjectSelection;