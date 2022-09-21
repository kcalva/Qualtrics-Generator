import React, { useState } from 'react'
import { addQuestion } from '../API/qualtricsAPI'

const CreateQuestions = ()=> {
    const [questionText, setQuestionText] = useState('')
    const [questionID, setQuestionID] = useState('')
    const [numChoices, setNumChoices] = useState()


    return (
        <>
            <label>questionText</label>
            <textarea value={questionText} onChange={(e)=>{setQuestionText(e.target.value)}}/>
            <label>questionID</label>
            <textarea value={questionID} onChange={(e)=>{setQuestionID(e.target.value)}}/>
            <label>numChoices</label>
            <textarea value={numChoices} onChange={(e)=>{setNumChoices(e.target.value)}}/>
            <button onClick={()=>{addQuestion({ questionText,questionID, numChoices })}} className='Button'>
               addQuestion
            </button>
        </>
    )
}

export default CreateQuestions