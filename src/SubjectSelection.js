import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import MyMovie from "./MyMovie1.mp4";

function SubjectSelection(props) {
  const location = useLocation();
  const [bin, setBin] = useState(1);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(Array.from({ length: location.state.subjects.length }, () => [1]));
  const videoRef = useRef(null);
  const [currentSubject, setCurrentSubject] = useState(1);
  const [frequency, setFrequency] = useState(Array(location.state.subjects.length).fill(0));
  const [formData] = useState(location.state);
  const [subjectTimes, setSubjectTimes] = useState(formData.subjects.map(() => ({ hours: 0, minutes: 0, seconds: 0 })));

  const calculateSubjectTime = useCallback(
    (subject) => {
      const time = subjectTimes[subject - 1];
      return time.hours * 3600 + time.minutes * 60 + time.seconds;
    },
    [subjectTimes]
  );

  const handleVideoPlay = useCallback(() => {
    videoRef.current.play().catch((error) => console.error("Error playing video:", error));
  }, []);

  const handleVideoPause = useCallback(() => {
    videoRef.current.pause();
  }, []);

  const handleVideoEnd = useCallback(() => {
    setRunning(false);
  }, []);

  const cleanupVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.removeEventListener('canplaythrough', handleVideoPlay);
      videoRef.current.removeEventListener('ended', handleVideoEnd);
    }
  }, [handleVideoPlay, handleVideoEnd]);

  const handleStart = useCallback(() => {
    setRunning(true);
  }, []);

  const handleStop = useCallback(() => {
    setRunning(false);
    cleanupVideo();
  }, [cleanupVideo]);

  const handleBin = useCallback(() => {
    const s = calculateSubjectTime(currentSubject);
    const newBin = Math.floor(s / formData.binSize) + 1;

    if (newBin !== bin) {
      setBin(newBin);
    }

    setPhase((prevPhase) => {
      const newPhase = [...prevPhase];

      if (!newPhase[currentSubject - 1]) {
        newPhase[currentSubject - 1] = [];
      }

      if (newPhase[currentSubject - 1][newBin - 1] === undefined) {
        newPhase[currentSubject - 1][newBin - 1] = 1;
      } else if (newPhase[currentSubject - 1][newBin - 1] === 1) {
        if (formData.subjects[currentSubject - 1].numPhases === 2) {
          newPhase[currentSubject - 1][newBin - 1] = 2;
        }
      }

      return newPhase;
    });
  }, [currentSubject, bin, calculateSubjectTime, formData.binSize, formData.subjects, setBin, setPhase]);

  useEffect(() => {
    handleBin();
  }, [currentSubject, bin, handleBin]);

  useEffect(() => {
    let interval;

    if (running) {
      cleanupVideo();
      videoRef.current.currentTime = calculateSubjectTime(currentSubject);
      videoRef.current.addEventListener('canplaythrough', handleVideoPlay);
      videoRef.current.addEventListener('ended', handleVideoEnd);
      interval = setInterval(() => {
        setSubjectTimes((prevTimes) => {
          const newTimes = [...prevTimes];
          newTimes[currentSubject - 1] = {
            hours: newTimes[currentSubject - 1].hours,
            minutes: newTimes[currentSubject - 1].minutes,
            seconds: newTimes[currentSubject - 1].seconds + 1,
          };
          return newTimes;
        });
      }, 1000);
    } else {
      cleanupVideo();
      clearInterval(interval);
    }

    return () => {
      cleanupVideo();
      clearInterval(interval);
    };
  }, [running, currentSubject, bin, calculateSubjectTime, handleVideoPlay, handleVideoEnd, cleanupVideo]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isNaN(e.key)) {
        const selectedSubject = parseInt(e.key);
        if (selectedSubject <= formData.subjects.length) {
          setCurrentSubject(selectedSubject);
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
  }, [currentSubject, formData.subjects, setFrequency]);

  return (
    <div>
      <button onClick={ handleStart} disabled={running}>
        Start
      </button>
      <button onClick={handleStop} disabled={!running}>
        Pause
      </button>
      <video
        ref={videoRef}
        width="600"
        height="400"
        controls={false}
        onEnded={handleVideoEnd}
        src={MyMovie} // Replace with the actual path
        type="video/mp4"
      >
        Your browser does not support the video tag.
      </video>
      <div>
        <p>{`${subjectTimes[currentSubject - 1].hours.toString().padStart(2, "0")}:${subjectTimes[currentSubject - 1].minutes.toString().padStart(2, "0")}:${subjectTimes[currentSubject - 1].seconds.toString().padStart(2, "0")}`}</p>
        <p>Subject we are in: {currentSubject}</p>
        <p>Bin {bin}</p>
        <p>Phase we are in: {phase[currentSubject - 1][bin - 1]}</p>
        <p>Frequency: {frequency[currentSubject - 1]}</p>
        <p>Date: {(new Date()).toLocaleString()}</p>
        <p>Group: {formData.subjects[currentSubject - 1].dropdownSelection}</p>
        <p>Condition: <input type="text" /></p>
      </div>
    </div>
  );
}

export default SubjectSelection;

