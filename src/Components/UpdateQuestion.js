import React, { useState } from 'react'

const UpdateQuestion = (props) => {
    const [questionID, setQuestionID] = useState('')

    const updateQuestion = async (params) => {
        console.log('surveyID in update question ', props.surveyID)
        console.log('questionId list in upadte questions ', props.questionIDList)
        
        const qid = props.questionIDList.find((id)=>id === params.questionID)
        console.log('id found ', qid)

        const updateRequestOptions = {
            method: 'PUT',
            headers: props.myHeaders,
            body: props.questionData,
            redirect: 'follow'
        }

        if(qid === undefined){
            props.createQuestion()
        }
        else{
            const res = await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${props.surveyID}/questions/${params.questionID}`, updateRequestOptions)
            const updateObj = await res.json()
            console.log('updateObj ', updateObj)
        }
    }

    return (
        <>
            <label>Question ID</label>
            <textarea value={questionID} onChange={(e)=>{setQuestionID(e.target.value)}}/>
            <button onClick={()=>{updateQuestion({questionID})}} className='Button'>
                Click to update question
            </button>
        </>
    )
}

export default UpdateQuestion