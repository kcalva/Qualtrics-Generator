import React from 'react'
import { useState } from 'react'
import SendUser from './SendUser'
import UpdateQuestion from './UpdateQuestion'

const CreateQuestions = (props)=> {
    const [surveyName, setSurveyName] = useState('')
    const [surveyID, setSurveyID] = useState()
    const [questionID, setQuestionID] = useState()
    const [questionData, setQuestionData] = useState()

    const createSurvey = async (params) => {
        const surveyData = JSON.stringify({
          "SurveyName": params.surveyName,
          "Language": "EN",
          "ProjectCategory": "EX"
        })
    
        const surveyRequestOptions = {
          method: 'POST',
          headers: props.myHeaders,
          body: surveyData,
          redirect: 'follow'
        }
    
        //Creating the survey
        const createSurveyres = await fetch("https://iad1.qualtrics.com/API/v3/survey-definitions", surveyRequestOptions)
        const surveyObj =  await createSurveyres.json()
        
        setSurveyID(surveyObj.result.SurveyID)
        return surveyObj.result.SurveyID
    }

    const getSurveyId = async (params) => {
        if(surveyID === undefined){
            console.log('surveyID not found: creating survey... ')
            return await createSurvey(params)
        }
        return surveyID
    }

    const createQuestion = async (params) => { 

        const newSurveyId = await getSurveyId(params)

        let initialQuestionData = JSON.stringify({
            "QuestionText": "I am treated with respect at work",
            "DataExportTag": "Q1",
            "QuestionType": "MC",
            "Selector": "SAHR",
            "SubSelector": "TX",
            "Configuration": {
                "QuestionDescriptionOption": "UseText",
                "LabelPosition": "BELOW"
            },
            "QuestionDescription": "I am treated with respect at work",
            "Choices": {
                "1": {
                    "Display": "Strongly disagree"
                },
                "2": {
                    "Display": "Disagree"
                },
                "3": {
                    "Display": "Neither agree nor disagree"
                },
                "4": {
                    "Display": "Agree"
                },
                "5": {
                    "Display": "Strongly agree"
                }
            },
            "ChoiceOrder": [
                1,
                2,
                3,
                4,
                5
            ],
            "Validation": {
                "Settings": {
                    "ForceResponse": "OFF",
                    "ForceResponseType": "ON",
                    "Type": "None"
                }
            },
            "Language": [],
            "NextChoiceId": 6,
            "NextAnswerId": 1,
            "QuestionID": "QID1",
            "DataVisibility": {
                "Private": false,
                "Hidden": false
            },
            "DisplayLogic": {
                "0": {
                    "0": {
                        "LogicType": "EmbeddedField",
                        "LeftOperand": "Q1",
                        "Operator": "EqualTo",
                        "RightOperand": "1",
                        "Type": "Expression",
                        "Description": "<span class=\"ConjDesc\">If</span>  <span class=\"LeftOpDesc\">Q1</span> <span class=\"OpDesc\">Is Equal to</span> <span class=\"RightOpDesc\"> 1 </span>"
                    },
                    "Type": "If"
                },
                "Type": "BooleanExpression",
                "inPage": false
            },
            "QuestionText_Unsafe": "I am treated with respect at work"
        })

        const questionRequestOptions = {
            method: 'POST',
            headers: props.myHeaders,
            body: initialQuestionData,
            redirect: 'follow'
        }
        
        //Creating the questions we want 
        const res = await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${newSurveyId}/questions`, questionRequestOptions)
        const questionObj =  await res.json()
        console.log('Question created')
        setQuestionID(questionObj.result.QuestionID)
        setQuestionData(initialQuestionData)
    }

    return (
        <>
            <textarea value={surveyName} onChange={(e)=>{setSurveyName(e.target.value)}}/>
            <button onClick={()=>{createQuestion({surveyName})}} className='button'>
                Click to add questions
            </button>
            
            {/* <UpdateQuestion myHeaders={props.myHeaders} surveyID={surveyID} questionID={questionID} questionData={questionData}/> */}
            <SendUser myHeaders={props.myHeaders} surveyID={surveyID}/>
        </>
    )
}

export default CreateQuestions