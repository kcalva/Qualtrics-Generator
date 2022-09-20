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

    const createQuestion =  async (surveyID, firstQuestionData, numQuestions) =>{

        const secondQuestionData = JSON.stringify({
            "QuestionText": "Please Explain why&nbsp;",
            "DefaultChoices": false,
            "DataExportTag": "Q" + (numQuestions + 2),
            "QuestionID": "QID" + (numQuestions + 2),
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
            "DisplayLogic": {
                "0": {
                    "0": {
                        "LogicType": "Question",
                        "QuestionID": "QID" + (numQuestions + 1),
                        "QuestionIsInLoop": "no",
                        "ChoiceLocator": `q://QID${ (numQuestions + 1)}/SelectableChoice/1`,
                        "Operator": "Selected",
                        "QuestionIDFromLocator": "QID" + (numQuestions + 1),
                        "LeftOperand": `q://QID${ (numQuestions + 1)}/SelectableChoice/1`,
                        "Type": "Expression",
                        "Description": "<span class=\"ConjDesc\">If</span> <span class=\"QuestionDesc\">is this working?</span> <span class=\"LeftOpDesc\">Strongly disagree</span> <span class=\"OpDesc\">Is Selected</span> "
                    },
                    "1": {
                        "LogicType": "Question",
                        "QuestionID": "QID" + (numQuestions + 1),
                        "QuestionIsInLoop": "no",
                        "ChoiceLocator": `q://QID${ (numQuestions + 1)}/SelectableChoice/5`,
                        "Operator": "Selected",
                        "QuestionIDFromLocator": "QID" + (numQuestions + 1),
                        "LeftOperand": `q://QID${ (numQuestions + 1)}/SelectableChoice/5`,
                        "Type": "Expression",
                        "Description": "<span class=\"ConjDesc\">Or</span> <span class=\"QuestionDesc\">is this working?</span> <span class=\"LeftOpDesc\">Strongly agree</span> <span class=\"OpDesc\">Is Selected</span> ",
                        "Conjuction": "Or"
                    },
                    "Type": "If"
                },
                "Type": "BooleanExpression",
                "inPage": false
            },
            "QuestionText_Unsafe": "Please Explain why&nbsp;"
        })

        const firstQuestionRequestOptions = {
            method: 'POST',
            headers: props.myHeaders,
            body: firstQuestionData,
            redirect: 'follow'
        }

        const secondQuestionRequestOptions = {
            method: 'POST',
            headers: props.myHeaders,
            body: secondQuestionData,
            redirect: 'follow'
        }

        //Creating the questions we want 
        await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyID}/questions`, firstQuestionRequestOptions)
        await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyID}/questions`, secondQuestionRequestOptions)

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

        const results = getQuestionsObj.result.elements.find((o)=>o.QuestionID === params.questionID)
        console.log('number of questions ', getQuestionsObj.result.elements.length)
        const qid = results?.QuestionID 

        const firstQuestionData = JSON.stringify({
            "QuestionText": params.questionText,
            "DataExportTag": "Q" + (getQuestionsObj.result.elements.length + 1),
            "QuestionType": "MC",
            "Selector": "SAHR",
            "SubSelector": "TX",
            "Configuration": {
                "QuestionDescriptionOption": "UseText",
                "LabelPosition": "BELOW"
            },
            "QuestionDescription": params.questionText,
            "Choices": params.numChoices === "4"?{
                "1": {
                    "Display": "Strongly disagree"
                },
                "2": {
                    "Display": "Disagree"
                },
                "3": {
                    "Display": "Agree"
                },
                "4": {
                    "Display": "Strongly agree"
                }
            }:params.numChoices === "7"?
            {
                "1": {
                    "Display": "Strongly disagree"
                },
                "2": {
                    "Display": "Disagree"
                },
                "3": {
                    "Display": "Somewhat disagree"
                },
                "4": {
                    "Display": "Neither agree nor disagree"
                },
                "5": {
                    "Display": "Somewhat agree"
                },
                "6": {
                    "Display": "Agree"
                },
                "7": {
                    "Display": "Strongly agree"
                }
            }:
            {
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
            "ChoiceOrder": params.numChoices === "4"?[1,2,3,4]:numChoices === "7"?[1,2,3,4,5,6,7]:[1,2,3,4,5],
            "Validation": {
                "Settings": {
                    "ForceResponse": "OFF",
                    "ForceResponseType": "ON",
                    "Type": "None"
                }
            },
            "Language": [],
            "QuestionID": "QID" + (getQuestionsObj.result.elements.length + 1),
            "DataVisibility": {
                "Private": false,
                "Hidden": false
            },
            "DisplayLogic": {
                "0": {
                    "0": {
                        "LogicType": "EmbeddedField",
                        "LeftOperand": "q" + (getQuestionsObj.result.elements.length + 1),
                        "Operator": "EqualTo",
                        "RightOperand": "1",
                        "Type": "Expression",
                        "Description": "<span class=\"ConjDesc\">If</span>  <span class=\"LeftOpDesc\">q"+ (getQuestionsObj.result.elements.length + 1) + "</span> <span class=\"OpDesc\">Is Equal to</span> <span class=\"RightOpDesc\"> 1 </span>"
                    },
                    "Type": "If"
                },
                "Type": "BooleanExpression",
                "inPage": false
            },
            "QuestionText_Unsafe": params.questionText
        })
        

        const updateRequestOptions = {
            method: 'PUT',
            headers: props.myHeaders,
            body: firstQuestionData,
            redirect: 'follow'
        }

        if(qid === undefined){
            createQuestion(surveyID,firstQuestionData, getQuestionsObj.result.elements.length)
        }
        else{
            await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyID}/questions/${qid}`, updateRequestOptions)
            console.log('question updated')
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