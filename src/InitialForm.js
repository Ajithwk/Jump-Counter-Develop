// InitialForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InitialForm({ onFormDataChange }) {
    const navigate = useNavigate();
    const [numberOfSubjects, setNumberOfSubjects] = useState('');
    const [numberOfBins, setNumberOfBins] = useState('');
    const [formData, setFormData] = useState({
        numberOfSubjects: '',
        subjects: [],
        phaseTwoMinutes: '',
        phaseTwoSeconds: '',
        numberOfBins: '',
        binDurationMinutes: '',
        binDurationSeconds: '',
    });

    const handleNumberOfSubjectsChange = (e) => {
        setNumberOfSubjects(e.target.value)
    };
    const handleNumberOfBins = (e) => {
        setNumberOfBins(e.target.value)
    };
    const handleFileChange = (event) => {

    };

    const handleNext = () => {
        // Navigate to the subject selection page
        onFormDataChange({ numberOfSubjects: numberOfSubjects });
        navigate('/select-subject');
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "numberOfSubjects") {
            setFormData(prevFormData => ({
                ...prevFormData,
                numberOfSubjects: value,
                subjects: Array.from({ length: parseInt(value, 10) }, () => ({ minutes: '', seconds: '' }))
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };
    const handleSubjectChange = (e, index) => {
        const { name, value } = e.target;
        const newSubjects = formData.subjects.map((subject, idx) => {
            if (idx === index) {
                return { ...subject, [name]: value };
            }
            return subject;
        });
        setFormData({ ...formData, subjects: newSubjects });
    };

    // Only include the inputs for the first part of the form here
    return (
        <div>
            <div className="form-group">
                <label>
                    Number of Subjects:
                    <input
                        type="number"
                        name="numberOfSubjects"
                        value={formData.numberOfSubjects}
                        onChange={handleChange}
                    />
                </label>
            </div>

            <div className="form-group">
                <label>
                    Number of bins:
                    <input
                        type="number"
                        name="numberOfBins"
                        value={numberOfBins}
                        onChange={handleNumberOfBins}
                    />
                </label>
            </div>

            <div className="form-group">
                <label>
                    Video Upload:

                    <input type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        required />
                </label>
            </div>

            {formData.subjects.map((subject, index) => (
                <div key={index} className="form-group">
                    <label>Subject {index + 1}</label>
                    <label>
                        Phase Duration 1:
                        Minutes:
                        <input
                            type="text"
                            name={`minutes`}
                            value={subject.minutes}
                            onChange={(e) => handleSubjectChange(e, index)}
                        />
                        Seconds:
                        <input
                            type="text"
                            name={`seconds`}
                            value={subject.seconds}
                            onChange={(e) => handleSubjectChange(e, index)}
                        />
                    </label>
                    <label>
                        Phase Duration 2:
                        Minutes:
                        <input
                            type="text"
                            name={`minutes`}
                            value={subject.minutes}
                            onChange={(e) => handleSubjectChange(e, index)}
                        />
                        Seconds:
                        <input
                            type="text"
                            name={`seconds`}
                            value={subject.seconds}
                            onChange={(e) => handleSubjectChange(e, index)}
                        />
                    </label>
                    <label>
                        SubjectCode:
                        <select
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
                    </label>
                </div>
            ))}

            <button type="button" onClick={handleNext}>Next</button>
        </div>
    );
}

export default InitialForm;