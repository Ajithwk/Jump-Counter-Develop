// InitialForm.js
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import "./InitialForm.css";
const InitialForm = ()=> {
    // const history = useHistory();
    const navigate = useNavigate();
    const [numberOfSubjects, setNumberOfSubjects] = useState('');
    const [numberOfBins, setNumberOfBins] = useState('');
    const [binSize, setBinSize] = useState(0);
    const [formData, setFormData] = useState({
        numberOfSubjects: '',
        subjects: [],
        // phaseOneMinutes: '',
        // phaseOneSeconds: '',
        // phaseTwoMinutes: '',
        // phaseTwoSeconds: '',
        binSize:0,
        numberOfBins: '',
        binDurationMinutes: '',
        binDurationSecondsnpm: '',
    });

    const handleNumberOfSubjectsChange = (e) => {
        setNumberOfSubjects(e.target.value)
    };
    const handleNumberOfBins = (e) => {
        setFormData({...formData,numberOfBins:e.target.value});
    };
    const handleFileChange = (event) => {

    };

    const handleNext = () => {
       
        // Navigate to the subject selection page
        // onFormDataChange({ numberOfSubjects: numberOfSubjects });
        // History.pushState(formData,'/select-subject');
        navigate('/select-subject',{state:formData})
        // return  <SubjectSelection formData={formData}/>
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        // if (name === "numberOfSubjects") {
            setFormData(prevFormData => {
                const newSubjects = Array.from({ length: parseInt(value, 10) }, () => ({ minutes: '', seconds: '' }));
                return {
                    ...prevFormData,
                    numberOfSubjects: value,
                    subjects: newSubjects,
                };
            });
        // } else if (name === "numberOfBins") {
        //     const newNumberOfBins = value;
        //     setNumberOfBins(newNumberOfBins);
        //     // Now we update the formData state with the new number of bins
        //     setFormData(prevFormData => {
        //         const newBinSize = calculateBinSize(prevFormData.subjects, newNumberOfBins);
        //         return {
        //             ...prevFormData,
        //             numberOfBins: newNumberOfBins,
        //         };
        //     });
        // } else {
        //     setFormData(prevFormData => ({
        //         ...prevFormData,
        //         [name]: value,
        //     }));
        // }
        // let {name,value} = e.target;
    //    setNumberOfSubjects(value)
    };
    const handleSubjectChange = (e, index) => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            const newSubjects = prevFormData.subjects.map((subject, idx) => {
                if (idx === index) {
                    return { ...subject, [name.split('_')[0]]: value };
                }
                return subject;
            });

            return {
                ...prevFormData,
                subjects: newSubjects,
                binDurationMinutes: Math.floor(binSize / 60),
                binDurationSeconds: binSize % 60,
            };
        });
        // calculateBinSize();
    };
    const calculateBinSize = () => {
        let totalSecondsArray = formData.subjects.map((subject) => {
            const totalSecondsPhaseOne =
                parseInt(subject.phaseOneMinutes, 10) * 60 + parseInt(subject.phaseOneSeconds, 10);

            const totalSecondsPhaseTwo =
                parseInt(subject.phaseTwoMinutes, 10) * 60 + parseInt(subject.phaseTwoSeconds, 10);

            return totalSecondsPhaseOne + totalSecondsPhaseTwo;
        });
        // totalSecondsArray = [totalSecondsArray[0]]
        const filteredSecondsArray = totalSecondsArray.filter(seconds => typeof seconds === 'number' && !isNaN(seconds));
        const totalSeconds = filteredSecondsArray.reduce((acc, seconds) => acc + seconds, 0);
        const val = Number.isFinite(parseInt(formData.numberOfBins)) ? totalSeconds / parseInt(formData.numberOfBins) : 0;

        setBinSize( totalSeconds / formData.numberOfBins);
        

    };
    const handleBinSize=(e)=>{
        // setBinSize(e.target.value)
        setFormData(prevFormData => {

            return {
                ...prevFormData,
                binSize:e.target.value
            };
        });
    }
    // Only include the inputs for the first part of the form here
    return (
        <div >
        <h1 style={{ textAlign: 'center' }}>Jump Counter</h1>
    
    <div className='container'>
    <div >
       
        <div className="form-group">
            <label  className='block1'>
                Number of Subjects: </label>
                <input
                    type="number"
                    name="numberOfSubjects"
                    value={formData.numberOfSubjects}
                    onChange={handleChange}
                />
            
        </div>

        <div className="form-group">
            <label  className='block1'>
                Number of bins:</label>
                <input
                    type="number"
                    name="numberOfBins"
                    value={formData.numberOfBins}
                    onChange={handleNumberOfBins}
                />
            
        </div>
        

        <div className="form-group">
            <label className='block1'>
                Bin Size:</label>
                <input
                    type="text"
                    name="binSize"
                    value={formData.binSize}
                    onChange={handleBinSize}
                    // readOnly
                />
            
        </div>

        <div className="form-group">
            <label className='block1'>
                Video Upload: </label>

                <input type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    required />
            
        </div>

        {formData.subjects.map((subject, index) => (
            <div key={index} className="form-group">
                <label>Subject {index + 1}</label>
                <label>
                    Phase 1:</label>
                    <label>Minutes:</label>
                    <input
                        type="number"
                        name={`phaseOneMinutes_${index}`}
                        value={subject.phaseOneMinutes}
                        onChange={(e) => handleSubjectChange(e, index)}
                    />
                    <label> Seconds:</label>
                    <input
                        type="number"
                        name={`phaseOneSeconds_${index}`}
                        value={subject.phaseOneSeconds}
                        onChange={(e) => handleSubjectChange(e, index)}
                    />
               
                <label>
                    Phase 2: </label>
                    <label>Minutes:</label>
                    <input
                        type="number"
                        name={`phaseTwoMinutes_${index}`}
                        value={subject.phaseTwoMinutes}
                        onChange={(e) => handleSubjectChange(e, index)}
                    />
                   <label>  Seconds:</label>
                    <input
                        type="number"
                        name={`phaseTwoSeconds_${index}`}
                        value={subject.phaseTwoSeconds}
                        onChange={(e) => handleSubjectChange(e, index)}
                    />
                
                <label>
                    SubjectCode:</label>
                    <select
                    name="dropdownSelection"
                        value={subject.dropdownSelection}
                        onChange={(e) => handleSubjectChange(e, index)}
                    >
                        {/* Assuming these are your dropdown options */}
                        <option value="">Please select Subject Code</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                        <option value="H">H</option>
                    </select>
                
            </div>
        ))}


        
        {/* <button type="button"><Link to="/select-subject" state={{formData}}>
    Next Step
  </Link></button> */}
  <button type='button' onClick={handleNext}>Next</button>
    </div>
    </div>
    </div>
);
}


export default InitialForm;