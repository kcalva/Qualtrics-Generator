import React, { useState, useEffect } from 'react'

const CreateQuestions = (props)=> {
    const [questionText, setQuestionText] = useState('')
    const [questionID, setQuestionID] = useState('')
    const [numChoices, setNumChoices] = useState()

    useEffect(() => {
    
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
        fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${props.surveyID}/metadata`, updateMetaDataRequestOptions)
       
    },[props.myHeaders, props.surveyID]);


    const publishSurvey = () => {
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
        fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${props.surveyID}/metadata`, updateMetaDataRequestOptions)
    }


    const getRatingQuestionData = (questionTag,qID,numChoices,questionText) => {

        console.log(`Getting rating question data for ${questionTag} with ${numChoices} choices and text: ${questionText}`)

        const questionJson = JSON.stringify({
            "QuestionText": questionText,
            "QuestionDescription": questionText,
            "QuestionText_Unsafe": questionText,

            "DataExportTag": questionTag,
            "QuestionID": qID,

            "DisplayLogic": {
                "0": {
                    "0": {
                        "LogicType": "EmbeddedField",
                        "LeftOperand": `sf${questionTag}`,
                        "Operator": "EqualTo",
                        "RightOperand": "1",
                        "Type": "Expression",
                    },
                    "Type": "If"
                },
                "Type": "BooleanExpression",
                "inPage": false
            },

            "Choices": 
            numChoices === "4"?{
                "1": {"Display": "Strongly disagree"},
                "2": {"Display": "Disagree"},
                "3": {"Display": "Agree"},
                "4": {"Display": "Strongly agree"}
            }:
            numChoices === "7"?{
                "1": {"Display": "Strongly disagree"},
                "2": {"Display": "Disagree"},
                "3": {"Display": "Somewhat disagree"},
                "4": {"Display": "Neither agree nor disagree"},
                "5": {"Display": "Somewhat agree"},
                "6": {"Display": "Agree"},
                "7": {"Display": "Strongly agree"}
            }:{ // default to 5
                "1": {"Display": "Strongly disagree"},
                "2": {"Display": "Disagree"},
                "3": {"Display": "Neither agree nor disagree"},
                "4": {"Display": "Agree"},
                "5": {"Display": "Strongly agree"}
            },
            "ChoiceOrder": 
                numChoices === "4"?[1,2,3,4]:
                numChoices === "7"?[1,2,3,4,5,6,7]:
                [1,2,3,4,5], // default

            "QuestionType": "MC",
            "Selector": "SAHR",
            "SubSelector": "TX",
            "Configuration": {
                "QuestionDescriptionOption": "UseText",
                "LabelPosition": "BELOW"
            },            
            "Validation": {
                "Settings": {
                    "ForceResponse": "OFF",
                    "ForceResponseType": "ON",
                    "Type": "None"
                }
            },
            "Language": [],
            "DataVisibility": {
                "Private": false,
                "Hidden": false
            }
        })

        return questionJson;
                
    }

    const getTextEntryQuestionData = (questionTag,QID,refQID,numChoices,questionText="Please explain why.") => {

        console.log(`Getting text entry question data for ${QID} with ${numChoices} choices and text: ${questionText}`)

        const questionJson = JSON.stringify({
            "QuestionText": questionText,
            "QuestionText_Unsafe": questionText,

            "DataExportTag": questionTag + "_why",
            "QuestionID": QID,

            "DisplayLogic": {
                "0": {
                    "0": {
                        "LogicType": "Question",
                        "QuestionID": refQID,
                        "QuestionIsInLoop": "no",
                        "ChoiceLocator": `q://${refQID}/SelectableChoice/1`,
                        "Operator": "Selected",
                        "QuestionIDFromLocator": `${refQID}`,
                        "LeftOperand": `q://${refQID}/SelectableChoice/1`,
                        "Type": "Expression",
                    },
                    "1": {
                        "LogicType": "Question",
                        "QuestionID": refQID,
                        "QuestionIsInLoop": "no",
                        "ChoiceLocator": `q://${refQID}/SelectableChoice/${numChoices}`,
                        "Operator": "Selected",
                        "QuestionIDFromLocator": `${refQID}`,
                        "LeftOperand": `q://${refQID}/SelectableChoice/${numChoices}`,
                        "Type": "Expression",
                        "Conjuction": "Or"
                    },
                    "Type": "If"
                },
                "Type": "BooleanExpression",
                "inPage": false
            },
            "DefaultChoices": false,
            "QuestionType": "TE",
            "Selector": "SL",
            "Configuration": {
                "QuestionDescriptionOption": "UseText"
            },
            "QuestionDescription": "Please Explain why ",
            "Validation": {
                "Settings": {
                    "ForceResponse": "OFF",
                    "Type": "None"
                }
            },
            "GradingData": [],
            "Language": [],
            "SearchSource": {
                "AllowFreeResponse": "false"
            },

        })

        return questionJson;
    }


    const createQuestion = async (surveyID, questionObject) => {
        const options = {
            method: 'POST',
            headers: props.myHeaders,
            body: questionObject,
            redirect: 'follow'
        }

        await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyID}/questions`, options)
    }

    const updateQuestion = async (surveyID, questionObject) => {
        const options = {
            method: 'PUT',
            headers: props.myHeaders,
            body: questionObject,
            redirect: 'follow'
        }

        await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyID}/questions/${questionObject.QuestionID}`, options)
        console.log('question updated')
    }

    const createQuestionPair =  async (surveyID) =>{
        const ratingQuestion = getRatingQuestionData()
        const textEntryQuestion = getTextEntryQuestionData()

        await createQuestion(surveyID,ratingQuestion)
        await createQuestion(surveyID,textEntryQuestion)

        console.log('questions created')
    }

    const addQuestion = async (params) => { 

        const surveyID = props.surveyID  

        const getQuestionsDataRequestOptions = {
            method: 'GET',
            headers: props.myHeaders,
            redirect: 'follow'
        }

        //getting questionID's for survey
        const getQuestionsRes = await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyID}/questions`, getQuestionsDataRequestOptions)
        const getQuestionsObj = await getQuestionsRes.json()

        const questionMap = {}
        getQuestionsObj.result.elements.forEach((e)=>{
            questionMap[e.DataExportTag] = e
        })

        console.log('number of questions ', getQuestionsObj.result.elements.length, questionMap)

        let QID = questionMap[params.questionID]?.QuestionID
        let QID_why = questionMap[params.questionID+"_why"]?.QuestionID

        console.log(QID?`Question ${params.questionID} exists with QID ${QID}`:`Question ${params.questionID} doesn't exist`)
        console.log(QID_why?`Text Question for ${params.questionID} exists with QID_why ${QID_why}`:`Text Question for ${params.questionID} doesn't exist`)

        if(QID) { // update question
            let questionData = getRatingQuestionData(params.questionID,QID,params.numChoices,params.questionText)
            updateQuestion(props.surveyID,questionData)
        } else { // create question
            const qid_offset = 2 // QID's start at 2 after the placeholder question is deleted and trash emptied

            QID = "QID" + (Object.keys(questionMap).length + qid_offset)
            let questionData = getRatingQuestionData(params.questionID,QID,params.numChoices,params.questionText)
            await createQuestion(props.surveyID,questionData)

            QID_why = "QID" + (Object.keys(questionMap).length + qid_offset+1) // why is always the next QID
            let textQuestionData = getTextEntryQuestionData(params.questionID,QID_why,QID,params.numChoices)
            await createQuestion(props.surveyID,textQuestionData)
        }

    }

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