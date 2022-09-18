import React from 'react'

const UpdateQuestion = (props) => {
    const getQuestionId = () =>{
        if(props.questionID === undefined){
            console.log('questionID not defined: creating question... ')
            props.createQuestion()
        }
    }
  

  const updateQuestion = async () => {
    console.log('surveyID in update question ', props.surveyID)
    
    getQuestionId()
    
    const updateRequestOptions = {
      method: 'PUT',
      headers: props.myHeaders,
      body: props.questionData,
      redirect: 'follow'
    }

    const res = await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${props.surveyID}/questions/${props.questionID}`, updateRequestOptions)
    const updateObj = await res.json()
    console.log('updateObj ', updateObj)

  }

  return (
    <>
        <button onClick={updateQuestion} className='Button'>
            Click to update question
        </button>  
    </>
  )
}

export default UpdateQuestion