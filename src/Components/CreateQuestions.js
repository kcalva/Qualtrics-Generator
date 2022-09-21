import React, { useState } from 'react'
import { addQuestion } from '../API/qualtricsAPI'

const CreateQuestions = ()=> {
    const [questionText, setQuestionText] = useState('')
    const [questionID, setQuestionID] = useState('')
    const [numChoices, setNumChoices] = useState()


    return (
        <>
            <label>Question Text</label>
            <textarea value={questionText} onChange={(e)=>{setQuestionText(e.target.value)}}/>
            <label>Question ID (ex. QID#)</label>
            <textarea value={questionID} onChange={(e)=>{setQuestionID(e.target.value)}}/>
            <label>Number of Choices</label>
            <textarea value={numChoices} onChange={(e)=>{setNumChoices(e.target.value)}}/>
            <button onClick={()=>{addQuestion({ questionText,questionID, numChoices })}} className='Button'>
                Click to add questions
            </button>
        </>
    )
}

export default CreateQuestions