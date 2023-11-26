import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SubjectSelection({ onFormDataChange }) {
    const navigate = useNavigate();
    const [numberOfSubjects, setNumberOfSubjects] = useState(0);
    const [subjectsData, setSubjectsData] = useState([]);

    // Whenever the number of subjects changes, update the subjectsData state
    const handleNumberOfSubjectsChange = (e) => {
        const newNumberOfSubjects = parseInt(e.target.value, 10);
        setNumberOfSubjects(newNumberOfSubjects);
        setSubjectsData(Array.from({ length: newNumberOfSubjects }, () => ({
            hours: '',
            minutes: '',
            dropdownSelection: '' // Assuming a default dropdown value
        })));
    };

    // Handle individual input changes for each subject's duration and dropdown
    const handleSubjectDataChange = (index, field, value) => {
        const updatedSubjectsData = [...subjectsData];
        updatedSubjectsData[index] = {
            ...updatedSubjectsData[index],
            [field]: value
        };
        setSubjectsData(updatedSubjectsData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ numberOfSubjects, subjectsData });
        navigate('/next-page'); // or whatever your next route is
        onFormDataChange({ numberOfSubjects, subjectsData });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>
                    Number of Subjects:
                    <input
                        type="number"
                        value={numberOfSubjects}
                        onChange={handleNumberOfSubjectsChange}
                    />
                </label>
            </div>

            {subjectsData.map((subject, index) => (
                <div key={index} className="form-group">
                    <label>
                        Subject {index + 1} Duration:
                        Hours:
                        <input
                            type="number"
                            value={subject.hours}
                            onChange={(e) => handleSubjectDataChange(index, 'hours', e.target.value)}
                        />
                        Minutes:
                        <input
                            type="number"
                            value={subject.minutes}
                            onChange={(e) => handleSubjectDataChange(index, 'minutes', e.target.value)}
                        />
                    </label>
                    <label>
                        Dropdown:
                        <select
                            value={subject.dropdownSelection}
                            onChange={(e) => handleSubjectDataChange(index, 'dropdownSelection', e.target.value)}
                        >
                            {/* Assuming these are your dropdown options */}
                            <option value="">Please select</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            {/* ...other options... */}
                        </select>
                    </label>
                </div>
            ))}

            <button type="submit">Next</button>
        </form>
    );
}

export default SubjectSelection;