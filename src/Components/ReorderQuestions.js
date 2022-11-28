import React, { useState } from 'react'
import { reorderQuestions } from '../API/qualtricsAPI'

const ReorderQuestions = ()=> {
    const [questionIDs, setQuestionIDs] = useState('')


    return (
        <div>
            <div style={{display:"flex", flexDirection: "column"}}>
            <label>questionIDs</label>
            <textarea value={questionIDs} onChange={(e)=>{setQuestionIDs(e.target.value)}}/>
            </div>
            <button onClick={()=>{reorderQuestions({ order: questionIDs.split(',')})}} className='Button'>
               reorderQuestions
            </button>
        </div>
    )
}

export default ReorderQuestions