import { ids, headers } from './constants'

const publishSurvey = () => {
    const surveyMetaData = JSON.stringify({
        "SurveyStatus": "Active",
    })
    
    const updateMetaDataRequestOptions = {
        method: 'PUT',
        headers,
        body: surveyMetaData,
        redirect: 'follow'
    }
    
    //Update metadata for Survey to set its status to active
    fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${ids.SURVEY_ID}/metadata`, updateMetaDataRequestOptions)
}

const getRatingQuestionData = (questionTag,qID,numChoices,questionText) => {

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

    const questionJson = JSON.stringify({
        "QuestionText": questionText,
        "QuestionText_Unsafe": questionText,

        "DataExportTag": questionTag + "_why",
        "QuestionID": QID,

        "InPageDisplayLogic": {
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
            "inPage": true
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
        headers: headers,
        body: questionObject,
        redirect: 'follow'
    }

    await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyID}/questions`, options)
}

const updateQuestion = async (surveyID, questionObject) => {
    const options = {
        method: 'PUT',
        headers: headers,
        body: questionObject,
        redirect: 'follow'
    }

    await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyID}/questions/${JSON.parse(questionObject).QuestionID}`, options)
}





export const addQuestion = async (params) => { 
    const {questionText, questionID, numChoices, expainQuestionText } = params

    const surveyID = ids.SURVEY_ID 

    const getQuestionsDataRequestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    }

    //getting questionID's for survey
    const getQuestionsRes = await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyID}/questions`, getQuestionsDataRequestOptions)
    const getQuestionsObj = await getQuestionsRes.json()

    const questionMap = {}
    getQuestionsObj.result.elements.forEach((e)=>{
        questionMap[e.DataExportTag] = e
    })

    let QID = questionMap[questionID]?.QuestionID
    let QID_why = questionMap[questionID+"_why"]?.QuestionID

    if(QID) { // update question
        let questionData = getRatingQuestionData(questionID,QID,numChoices,questionText)
        await updateQuestion(surveyID,questionData)
    } else { // create question
        const qid_offset = 2 // QID's start at 2 after the placeholder question is deleted and trash emptied

        QID = "QID" + (Object.keys(questionMap).length + qid_offset)
        let questionData = getRatingQuestionData(questionID,QID,numChoices,questionText)
        await createQuestion(surveyID,questionData)

        QID_why = "QID" + (Object.keys(questionMap).length + qid_offset+1) // the "why" is always the next QID
        let textQuestionData = getTextEntryQuestionData(questionID,QID_why,QID,numChoices,expainQuestionText)
        await createQuestion(surveyID,textQuestionData)
    }
    await publishSurvey()
}





export const sendToUser = async (params) => {

    const {
        reviewerFirstName,
        reviewerLastName,
        reviewerEmail,
        reviewerID,
        revieweeFirstName,
        revieweeLastName,
        revieweeID,
        itemList,
        emailFromAddress,
        emailFromName,
        emailSubject,
    } = params

    const  mailingListId = ids.MAILINGLIST_ID

    const addContactData = JSON.stringify({
        "firstName": reviewerFirstName,
        "lastName": reviewerLastName,
        "email": reviewerEmail,
        "extRef": reviewerID,
        "embeddedData":{
            "revieweeFirstName": revieweeFirstName,
            "revieweeLastName": revieweeLastName,
            "revieweeID": revieweeID
        },
        "language": "en",
    })

    const addContactRequestOptions = {
      method: 'POST',
      headers,
      body: addContactData,
      redirect: 'follow'
    }

    const addContactRes = await fetch(`https://iad1.qualtrics.com/API/v3/directories/${ids.DEFAULT_DIRECTORY}/mailinglists/${mailingListId}/contacts`, addContactRequestOptions)
    const addContactObj = await addContactRes.json()

    const linkWrapper = "<a href=${l://SurveyURL}&sf" + itemList.split(",").join("=1&sf") + "=1&revieweeFirstName=" + revieweeFirstName + "&revieweeLastName=" + revieweeLastName + "&revieweeID=" + revieweeID + ">Click Here for Survey</a>"

    const timeElapsed = Date.now()
    const today = new Date(timeElapsed)

    const sendToUserData = JSON.stringify({
      "message": {
        "messageText": linkWrapper
      },
      "recipients": {
        "mailingListId": mailingListId,
        "contactId": addContactObj.result.contactLookupId     
      },
      "header": {
        "fromEmail": emailFromAddress,
        "replyToEmail": emailFromAddress,
        "fromName": emailFromName,
        "subject": emailSubject
      },
      "surveyLink": {
        "surveyId": ids.SURVEY_ID,
        "type": "Individual"
      },
      "sendDate": today.toISOString()
    })

    const sendToUserRequestOptions = {
      method: 'POST',
      headers,
      body: sendToUserData,
      redirect: 'follow'
    }

    await fetch("https://iad1.qualtrics.com/API/v3/distributions", sendToUserRequestOptions)
  }






  export const exportData = async () =>{

    // get question meta data
    const getQuestionsDataRequestOptions = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    }    
    const getQuestionsRes = await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${ids.SURVEY_ID}/questions`, getQuestionsDataRequestOptions)
    const getQuestionsObj = await getQuestionsRes.json()
    const questionMap = {}
    getQuestionsObj.result.elements.forEach((e)=>{
        questionMap[e.QuestionID] = e
    })

    // starting the response export
    const startExportData = JSON.stringify({
        "format": "json",
        "compress" : false
    })
    const startExportRequestOptions = {
        method: 'POST',
        headers,
        body: startExportData,
        redirect: 'follow'
    }
    const startExportRes = await fetch(`https://iad1.qualtrics.com/API/v3/surveys/${ids.SURVEY_ID}/export-responses`, startExportRequestOptions)
    const startExportObj = await startExportRes.json()


    //Get the progress of the export
    const getExportProgressRequestOptions = {
        method: 'GET',
        headers,
        redirect: 'follow'
    }
  
    let getExportProgressRes = await fetch(`https://iad1.qualtrics.com/API/v3/surveys/${ids.SURVEY_ID}/export-responses/${startExportObj.result.progressId}`, getExportProgressRequestOptions)
    let getExportProgressObj = await getExportProgressRes.json()
    if(getExportProgressObj.result.status != "complete") {
        getExportProgressRes = await fetch(`https://iad1.qualtrics.com/API/v3/surveys/${ids.SURVEY_ID}/export-responses/${startExportObj.result.progressId}`, getExportProgressRequestOptions)
        getExportProgressObj = await getExportProgressRes.json()
    }

    //Get the export file
    const getExportFileRequestOptions = {
        method: 'GET',
        headers,
        redirect: 'follow'
    }      
    const getExportFileRes = await fetch(`https://iad1.qualtrics.com/API/v3/surveys/${ids.SURVEY_ID}/export-responses/${getExportProgressObj.result.fileId}/file`, getExportFileRequestOptions)
    const getExportFileObj = await getExportFileRes.json()

    // Transform file
    let results = []
    getExportFileObj.responses.forEach((response)=>{
        if(response.values.finished!=1) {
            return // ignore unfinished respones
        }

        let values = response.values
        let row = {items:{}}

        Object.keys(values).forEach((key)=>{
            let qid = key.split("_")[0]                
            if(questionMap[qid]) {
                let sfidparts = questionMap[qid].DataExportTag.split("_")
                let sfid = sfidparts[0] // first part is the sf ID
                let isText = (sfidparts.length==2) // if second part exists, then it's the text part of the question
                if(isText){
                    if(!row.items[sfid]) row.items[sfid]={}
                    row.items[sfid].text = values[key]
                } else {
                    if(!row.items[sfid]) row.items[sfid]={}
                    row.items[sfid].sfid = sfid
                    row.items[sfid].value = values[key]
                    row.items[sfid].label = questionMap[qid].Choices[values[key]].Display
                }
            } else {
                let metaList = ["externalDataReference","recipientEmail","recipientFirstName","recipientLastName","recordedDate","responseId",
                        "revieweeID","revieweeFirstName","revieweeLastName"]
                if(metaList.includes(key)) {
                    row[key] = values[key]
                }
            }

        })
        results.push(row)
    })

    return results
}