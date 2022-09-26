import React, { useState } from 'react'
import { addQuestion } from '../API/qualtricsAPI'

const CreateQuestions = ()=> {
    const [questionText, setQuestionText] = useState('')
    const [questionID, setQuestionID] = useState('')
    const [numChoices, setNumChoices] = useState()


    return (
        <div>
            <div style={{display:"flex", flexDirection: "column"}}>
            <label>questionText</label>
            <textarea value={questionText} onChange={(e)=>{setQuestionText(e.target.value)}}/>
            </div>
            <div style={{display:"flex", flexDirection: "column"}}>
            <label>questionID</label>
            <textarea value={questionID} onChange={(e)=>{setQuestionID(e.target.value)}}/>
            </div>
            <div style={{display:"flex", flexDirection: "column"}}>
            <label>numChoices</label>
            <textarea value={numChoices} onChange={(e)=>{setNumChoices(e.target.value)}}/>
            </div>
            <button onClick={()=>{addQuestion({ questionText,questionID, numChoices })}} className='Button'>
               addQuestion
            </button>
        </div>
    )
}

export default CreateQuestions