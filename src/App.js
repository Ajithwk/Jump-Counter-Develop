import React, { useState }  from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import InitialForm from './InitialForm';
import SubjectSelection from './SubjectSelection';

  function App() {
    // const [formData1, setFormData1] = useState({
    //   numberOfSubjects: '',
    //   totalRunTime: '',
    //   phaseOneMinutes: '',
    //   phaseOneSeconds: '',
    //   phaseTwoMinutes: '',
    //   phaseTwoSeconds: '',
    //   numberOfBins: '',
    //   binDurationMinutes: '',
    //   binDurationSeconds: '',
    // });
  return (
    <Router>
      <Routes>
        {/* <Route path="/select-subject" element={<SubjectSelection formData={formData1} onFormDataChange={setFormData1}/>} /> */}
        <Route path='/select-subject' element={<SubjectSelection/>} />
        <Route path="/" element={<InitialForm/>} />
      </Routes>
    </Router>
  );
}

export default App;