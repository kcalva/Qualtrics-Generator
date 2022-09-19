import React, { useState } from 'react'
import ExportData from './ExportData'
import SendUser from './SendUser'
import UpdateQuestion from './UpdateQuestion'

const CreateQuestions = (props)=> {
    const [surveyName, setSurveyName] = useState('')
    const [surveyID, setSurveyID] = useState()
    const [questionText, setQuestionText] = useState('')
    const [exportTag, setExportTag] = useState('')
    const [leftOperand, setLeftOperand] = useState('')
    const [rightOperand, setRightOperand] = useState('')
    const[questionIDList, setQuestionIDList] = useState([])

    const initialQuestionData = JSON.stringify({
        "QuestionText": questionText,
        "DataExportTag": exportTag,
        "QuestionType": "MC",
        "Selector": "SAHR",
        "SubSelector": "TX",
        "Configuration": {
            "QuestionDescriptionOption": "UseText",
            "LabelPosition": "BELOW"
        },
        "QuestionDescription": questionText,
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
        "DataVisibility": {
            "Private": false,
            "Hidden": false
        },
        "DisplayLogic": {
            "0": {
                "0": {
                    "LogicType": "EmbeddedField",
                    "LeftOperand": leftOperand,
                    "Operator": "EqualTo",
                    "RightOperand": rightOperand,
                    "Type": "Expression",
                    "Description": "<span class=\"ConjDesc\">If</span>  <span class=\"LeftOpDesc\">"+leftOperand+"</span> <span class=\"OpDesc\">Is Equal to</span> <span class=\"RightOpDesc\">" + rightOperand +"</span>"
                },
                "Type": "If"
            },
            "Type": "BooleanExpression",
            "inPage": false
        },
        "QuestionText_Unsafe": questionText
    })

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

        const surveyMetaData = JSON.stringify({
            "SurveyStatus": "Active",
        })
        
        const updateMetaDataRequestOptions = {
            method: 'PUT',
            headers: props.myHeaders,
            body: surveyMetaData,
            redirect: 'follow'
        }
        
        //Update metadata for Survey to set its status to active
        const updateMetadataRes = await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyObj.result.SurveyID}/metadata`, updateMetaDataRequestOptions)
        const updateMetaDataObj = await updateMetadataRes.json()
        console.log('making survey active ', updateMetaDataObj)
        
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
        setQuestionIDList((prevState)=>[...prevState, questionObj.result.QuestionID])
        console.log(questionIDList)
    }

    return (
        <>
            <label>Survey Name</label>
            <textarea value={surveyName} onChange={(e)=>{setSurveyName(e.target.value)}}/>
            <label>Question Text</label>
            <textarea value={questionText} onChange={(e)=>{setQuestionText(e.target.value)}}/>
            <label>Question Tag</label>
            <textarea value={exportTag} onChange={(e)=>{setExportTag(e.target.value)}}/>
            <label>MetaData Name</label>
            <textarea value={leftOperand} onChange={(e)=>{setLeftOperand(e.target.value)}}/>
            <label>MetaData Value</label>
            <textarea value={rightOperand} onChange={(e)=>{setRightOperand(e.target.value)}}/>
            <button onClick={()=>{createQuestion({surveyName})}} className='Button'>
                Click to add questions
            </button>
            
            <UpdateQuestion myHeaders={props.myHeaders} surveyID={surveyID} questionIDList={questionIDList} questionData={initialQuestionData} createQuestion={createQuestion}/>
            <SendUser myHeaders={props.myHeaders} surveyID={surveyID}/>
            <ExportData myHeaders={props.myHeaders} surveyID={surveyID}/>
        </>
    )
}

export default CreateQuestions