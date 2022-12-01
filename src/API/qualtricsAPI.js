import { ids, headers, BASE_URL } from "./constants";
import axios from "axios";

const restRequest = (url, options) => {

  return fetch(url, options).then((res) => res.json());

  // return ({
  //   url,
  //   ...options,
  //   data: options.body,
  // }).then((res) => res.data);
};

const publishSurvey = () => {
  const surveyMetaData = JSON.stringify({
    SurveyStatus: "Active",
  });

  const updateMetaDataRequestOptions = {
    method: "PUT",
    headers,
    body: surveyMetaData,
    redirect: "follow",
  };

  //Update metadata for Survey to set its status to active
  restRequest(
    `${BASE_URL}/API/v3/survey-definitions/${ids.SURVEY_ID}/metadata`,
    updateMetaDataRequestOptions
  );
};

const publishNewVersion = async () => {
  const versionOptions = {
    method: "POST",
    redirect: "follow",
    headers,
    body: JSON.stringify({
        "Description": "USSF API Interface",
        "Published": true
    })
  }

  await restRequest(
      `${BASE_URL}/API/v3/survey-definitions/${ids.SURVEY_ID}/versions`,
      versionOptions
  )

}



const getRatingQuestionData = (questionTag, qID, numChoices, questionText, answerText=[]) => {
  const questionJson = JSON.stringify({
    QuestionText: questionText,
    QuestionDescription: questionText,
    QuestionText_Unsafe: questionText,

    DataExportTag: questionTag,
    QuestionID: qID,

    DisplayLogic: {
      0: {
        0: {
          LogicType: "EmbeddedField",
          LeftOperand: `sf${questionTag}`,
          Operator: "EqualTo",
          RightOperand: "1",
          Type: "Expression",
        },
        Type: "If",
      },
      Type: "BooleanExpression",
      inPage: false,
    },

    Choices:
      numChoices === "4"
        ? {
            1: { Display: answerText[0]?answerText[0]:"Strongly disagree" },
            2: { Display: answerText[1]?answerText[1]:"Disagree" },
            3: { Display: answerText[2]?answerText[2]:"Agree" },
            4: { Display: answerText[3]?answerText[3]:"Strongly agree" },
          }
        : numChoices === "7"
        ? {
            1: { Display: answerText[0]?answerText[0]:"Strongly disagree" },
            2: { Display: answerText[1]?answerText[1]:"Disagree" },
            3: { Display: answerText[2]?answerText[2]:"Somewhat disagree" },
            4: { Display: answerText[3]?answerText[3]:"Neither agree nor disagree" },
            5: { Display: answerText[4]?answerText[4]:"Somewhat agree" },
            6: { Display: answerText[5]?answerText[5]:"Agree" },
            7: { Display: answerText[6]?answerText[6]:"Strongly agree" },
          }
        : {
            // default to 5
            1: { Display: answerText[0]?answerText[0]:"Strongly disagree" },
            2: { Display: answerText[1]?answerText[1]:"Disagree" },
            3: { Display: answerText[2]?answerText[2]:"Neither agree nor disagree" },
            4: { Display: answerText[3]?answerText[3]:"Agree" },
            5: { Display: answerText[4]?answerText[4]:"Strongly agree" },
          },
    ChoiceOrder:
      numChoices === "4"
        ? [1, 2, 3, 4]
        : numChoices === "7"
        ? [1, 2, 3, 4, 5, 6, 7]
        : [1, 2, 3, 4, 5], // default

    QuestionType: "MC",
    Selector: "SAHR",
    SubSelector: "TX",
    Configuration: {
      QuestionDescriptionOption: "UseText",
      LabelPosition: "BELOW",
    },
    Validation: {
      Settings: {
        ForceResponse: "OFF",
        ForceResponseType: "ON",
        Type: "None",
      },
    },
    Language: [],
    DataVisibility: {
      Private: false,
      Hidden: false,
    },
  });

  return questionJson;
};

const getTextEntryQuestionData = (
  questionTag,
  QID,
  refQID,
  numChoices,
  questionText = "Please explain why."
) => {
  const questionJson = JSON.stringify({
    QuestionText: questionText,
    QuestionText_Unsafe: questionText,

    DataExportTag: questionTag + "_why",
    QuestionID: QID,

    InPageDisplayLogic: {
      0: {
        0: {
          LogicType: "Question",
          QuestionID: refQID,
          QuestionIsInLoop: "no",
          ChoiceLocator: `q://${refQID}/SelectableChoice/1`,
          Operator: "Selected",
          QuestionIDFromLocator: `${refQID}`,
          LeftOperand: `q://${refQID}/SelectableChoice/1`,
          Type: "Expression",
        },
        1: {
          LogicType: "Question",
          QuestionID: refQID,
          QuestionIsInLoop: "no",
          ChoiceLocator: `q://${refQID}/SelectableChoice/${
            numChoices === "4" || numChoices === "7" ? numChoices : "5"
          }`,
          Operator: "Selected",
          QuestionIDFromLocator: `${refQID}`,
          LeftOperand: `q://${refQID}/SelectableChoice/${
            numChoices === "4" || numChoices === "7" ? numChoices : "5"
          }`,
          Type: "Expression",
          Conjuction: "Or",
        },
        Type: "If",
      },
      Type: "BooleanExpression",
      inPage: true,
    },
    DefaultChoices: false,
    QuestionType: "TE",
    Selector: "SL",
    Configuration: {
      QuestionDescriptionOption: "UseText",
    },
    QuestionDescription: "Please Explain why ",
    Validation: {
      Settings: {
        ForceResponse: "OFF",
        Type: "None",
      },
    },
    GradingData: [],
    Language: [],
    SearchSource: {
      AllowFreeResponse: "false",
    },
  });

  return questionJson;
};

const getTextGraphicQuestionData = (questionTag, qID, questionText) =>{
  let question= {}
  if(questionText === "&nbsp;"){
    question.DisplayLogic ={
      0: {
          0: {
              LogicType: "BooleanValue",
              Value: "False",
              Type: "Expression",
              Description: "<span class=\"ConjDesc\">If</span><span> False</span>"
          },
          Type: "If"
      },
      Type: "BooleanExpression",
      inPage: false
    }
  }
  const questionJson = JSON.stringify({
      QuestionText: questionText,
      DefaultChoices: false,
      DataExportTag: questionTag,
      QuestionType: "DB",
      Selector: "TB",
      Configuration: {
          "QuestionDescriptionOption": "UseText"
      },
      QuestionDescription: questionText === "&nbsp;"?" ":questionText,
      ChoiceOrder: [],
      Validation: {
          Settings: {
              Type: "None"
          }
      },
      GradingData: [],
      Language: [],
      NextChoiceId: 4,
      NextAnswerId: 1,
      QuestionID: qID,
      QuestionText_Unsafe: questionText,
      ...question
  })
  return questionJson
}

const createQuestion = async (surveyID, questionObject) => {
  const options = {
    method: "POST",
    headers: headers,
    body: questionObject,
    redirect: "follow",
  };

  await restRequest(
    `${BASE_URL}/API/v3/survey-definitions/${surveyID}/questions`,
    options
  );
};

const updateQuestion = async (surveyID, questionObject) => {
  const options = {
    method: "PUT",
    headers: headers,
    body: questionObject,
    redirect: "follow",
  };

  await restRequest(
    `${BASE_URL}/API/v3/survey-definitions/${surveyID}/questions/${
      JSON.parse(questionObject).QuestionID
    }`,
    options
  );
};

const getQuestionMap = (questions) => { 
  let questionMap = {}
  questions.forEach((e) => {
    questionMap[e.DataExportTag] = e;
  })
  return questionMap
}

export const reorderQuestions = async (params) => {
  let { order } = params

  const surveyID = ids.SURVEY_ID
  const getSurveyOptions = {
    method: 'GET',
    headers,
    redirect: 'follow'
  }
  const getSurveyRes = await restRequest(
    `${BASE_URL}/API/v3/survey-definitions/${surveyID}`,
    getSurveyOptions
  )

  const blockID = getSurveyRes.result.SurveyFlow.Flow[0].ID
  const block = getSurveyRes.result.Blocks[blockID]
  const questions = getSurveyRes.result.Questions
  const questionMap = getQuestionMap(Object.values(questions))
  let questionIDs = Object.keys(questionMap)
  let blockElements = block.BlockElements

  blockElements.forEach((e)=>{
    e.sfid = questions[e.QuestionID].DataExportTag
  })

  let newOrder = []
  order.forEach((sfid)=>{
    newOrder.push(sfid)
    newOrder.push(sfid+"_why")
  })

  let unreferenced = []
  questionIDs.forEach((key)=>{
    if(newOrder.indexOf(key)==-1)
      unreferenced.push(key)
  })

  let topOrder = []
  blockElements.forEach((e)=>{
    if(unreferenced.indexOf(e.sfid)>=0){
      topOrder.push(e.sfid)
    }
  })

  newOrder = [...topOrder,...newOrder]
  let sortedKeys = questionIDs.sort((a,b)=>{
    return newOrder.indexOf(a)-newOrder.indexOf(b)
  })

  let newBlockElements = []
  sortedKeys.forEach((key)=>{
    let questionData = questionMap[key]
    let q = {Type:'Question','QuestionID':questionData.QuestionID}
    newBlockElements.push(q)
  })
  
  const blockData = JSON.stringify({
    Type: block.Type,
    Description: block.Description,
    ID: blockID,
    BlockElements: newBlockElements
  })

  const updateBlockOptions = {
    method: 'PUT',
    headers,
    body: blockData,
    redirect: 'follow'
  }

  await restRequest(
    `${BASE_URL}/API/v3/survey-definitions/${surveyID}/blocks/${blockID}`,
    updateBlockOptions
  )

  await publishNewVersion()

}

export const addQuestion = async (params) => {
  // questionType = choice requires all params
  // questionType = text only requires questionText and questionID
  const { questionText, questionID, numChoices, expainQuestionText, questionType="choice" } = params;

  const surveyID = ids.SURVEY_ID;

  const getQuestionsDataRequestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  //getting questionID's for survey
  const getQuestionsRes = await restRequest(
    `${BASE_URL}/API/v3/survey-definitions/${surveyID}/questions`,
    getQuestionsDataRequestOptions
  );

  const questionMap = getQuestionMap(getQuestionsRes.result.elements)

  let QID = questionMap[questionID]?.QuestionID;
  let QID_why = questionMap[questionID + "_why"]?.QuestionID;

  if (QID) {
    // update question
    if(questionType ==="choice"){  
      let questionData = getRatingQuestionData(
        questionID,
        QID,
        numChoices,
        questionText
      );
      await updateQuestion(surveyID, questionData);
      let textQuestionData = getTextEntryQuestionData(
        params.questionID,
        QID_why,
        QID,
        params.numChoices,
        params.expainQuestionText
      );
      await updateQuestion(surveyID, textQuestionData);
    }
    else if(questionType === "text"){
      let textGraphicData = getTextGraphicQuestionData(questionID,QID,questionText)
      await updateQuestion(surveyID, textGraphicData)
    }
  } else {
    // create question
    const qid_offset = 2; // QID's start at 2 after the placeholder question is deleted and trash emptied

    QID = "QID" + (Object.keys(questionMap).length + qid_offset);

    if(questionType ==="choice"){  
      let questionData = getRatingQuestionData(
        questionID,
        QID,
        numChoices,
        questionText
      );
      await createQuestion(surveyID, questionData)

      QID_why = "QID" + (Object.keys(questionMap).length + qid_offset + 1); // the "why" is always the next QID
      let textQuestionData = getTextEntryQuestionData(
        questionID,
        QID_why,
        QID,
        numChoices,
        expainQuestionText
      );
      await createQuestion(surveyID, textQuestionData)
    }
    else if(questionType === "text"){
      let textGraphicData = getTextGraphicQuestionData(questionID,QID,questionText)
      await createQuestion(surveyID, textGraphicData);
      QID_why = "QID" + (Object.keys(questionMap).length + qid_offset + 1) // the "why" is always the next QID
      let blankData = getTextGraphicQuestionData(questionID + "_why",QID_why,"&nbsp;")
      await createQuestion(surveyID, blankData);
    }
  }
  await publishNewVersion()
};

export const sendToUser = async (params) => {

  // {{reviewerFirstName}}
  // {{reviewerLastName}}
  // {{revieweeFirstName}}
  // {{revieweeLastName}}
  // {{surveyURL}}

  let {
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
    emailBody
  } = params;

  console.log(params)

  const mailingListId = ids.MAILINGLIST_ID;

  const surveyURL = "${l://SurveyURL}&sf" +
    itemList.split(",").join("=1&sf") +
    "=1&revieweeFirstName=" +
    encodeURIComponent(revieweeFirstName) +
    "&revieweeLastName=" +
    encodeURIComponent(revieweeLastName) +
    "&revieweeID=" +
    encodeURIComponent(revieweeID);  

    console.log(surveyURL)

  const addContactData = JSON.stringify({
    firstName: reviewerFirstName,
    lastName: reviewerLastName,
    email: reviewerEmail,
    extRef: reviewerID,
    embeddedData: {
      revieweeFirstName: revieweeFirstName,
      revieweeLastName: revieweeLastName,
      revieweeID: revieweeID,
    },
    language: "en",
  });

  const addContactRequestOptions = {
    method: "POST",
    headers,
    body: addContactData,
    redirect: "follow",
  };

  const addContactRes = await restRequest(
    `${BASE_URL}/API/v3/directories/${ids.DEFAULT_DIRECTORY}/mailinglists/${mailingListId}/contacts`,
    addContactRequestOptions
  );

  if(!emailBody) {
    emailBody = `Hello {{reviewerFirstName}} {{reviewerLastName}}, 
      <p>Please click <a href="{{surveyURL}}">here</a> to complete a brief review of {{revieweeFirstName}} {{revieweeLastName}}.</p>
      <p>Thank you for participating in the USSF Guardian Review Program.</p>
      `;
  }

  emailBody = emailBody.replaceAll("{{surveyURL}}",surveyURL)
  emailBody = emailBody.replaceAll("{{reviewerFirstName}}",reviewerFirstName)
  emailBody = emailBody.replaceAll("{{reviewerLastName}}",reviewerLastName)
  emailBody = emailBody.replaceAll("{{revieweeFirstName}}",revieweeFirstName)
  emailBody = emailBody.replaceAll("{{revieweeLastName}}",revieweeLastName)
  emailSubject = emailSubject.replaceAll("{{reviewerFirstName}}",reviewerFirstName)
  emailSubject = emailSubject.replaceAll("{{reviewerLastName}}",reviewerLastName)
  emailSubject = emailSubject.replaceAll("{{revieweeFirstName}}",revieweeFirstName)
  emailSubject = emailSubject.replaceAll("{{revieweeLastName}}",revieweeLastName)

  const timeElapsed = Date.now();  
  const today = new Date(timeElapsed);

  emailBody += `</br><p style="display:none">Sent on ${today.toDateString()} at ${today.toTimeString()}</p>`

  const sendToUserData = JSON.stringify({
    message: {
      messageText: emailBody,
    },
    recipients: {
      mailingListId: mailingListId,
      contactId: addContactRes.result.contactLookupId,
    },
    header: {
      fromEmail: "noreply@qemailserver.com",
      replyToEmail: emailFromAddress,
      fromName: emailFromName,
      subject: emailSubject,
    },
    surveyLink: {
      surveyId: ids.SURVEY_ID,
      type: "Individual",
    },
    sendDate: today.toISOString(),
  });

  const sendToUserRequestOptions = {
    method: "POST",
    headers,
    body: sendToUserData,
    redirect: "follow",
  };

  await restRequest(
    `${BASE_URL}/API/v3/distributions`,
    sendToUserRequestOptions
  );
};

export const exportData = async (filterId = null) => {
  // get question meta data
  const getQuestionsDataRequestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };
  const getQuestionsRes = await restRequest(
    `${BASE_URL}/API/v3/survey-definitions/${ids.SURVEY_ID}/questions`,
    getQuestionsDataRequestOptions
  );
  const questionMap = {};
  getQuestionsRes.result.elements.forEach((e) => {
    questionMap[e.QuestionID] = e;
  });

  let exportDataObj = {
    format: "json",
    compress: false,
  };

  if(filterId) {
    // Qualtrics doesn't like null filters, so we leave it out if it's not there
    exportDataObj.filterId = filterId;
  }
 
  // starting the response export
  const startExportData = JSON.stringify(exportDataObj);
  const startExportRequestOptions = {
    method: "POST",
    headers,
    body: startExportData,
    redirect: "follow",
  };
  const startExportRes = await restRequest(
    `${BASE_URL}/API/v3/surveys/${ids.SURVEY_ID}/export-responses`,
    startExportRequestOptions
  );
  console.log(startExportRes)

  //Get the progress of the export
  const getExportProgressRequestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };

  let getExportProgressRes = await restRequest(
    `${BASE_URL}/API/v3/surveys/${ids.SURVEY_ID}/export-responses/${startExportRes.result.progressId}`,
    getExportProgressRequestOptions
  );
  if (getExportProgressRes.result.status != "complete") {
    getExportProgressRes = await restRequest(
      `${BASE_URL}/API/v3/surveys/${ids.SURVEY_ID}/export-responses/${startExportRes.result.progressId}`,
      getExportProgressRequestOptions
    );
  }

  //Get the export file
  const getExportFileRequestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };
  const getExportFileRes = await restRequest(
    `${BASE_URL}/API/v3/surveys/${ids.SURVEY_ID}/export-responses/${getExportProgressRes.result.fileId}/file`,
    getExportFileRequestOptions
  );

  // Transform file
  let results = [];
  getExportFileRes.responses.forEach((response) => {
    if (response.values.finished != 1) {
      return; // ignore unfinished respones
    }

    let values = response.values;
    let row = { items: {}, responseID: response.responseId };

    Object.keys(values).forEach((key) => {
      let qid = key.split("_")[0];
      if (questionMap[qid]) {
        let sfidparts = questionMap[qid].DataExportTag.split("_");
        let sfid = sfidparts[0]; // first part is the sf ID
        let isText = sfidparts.length == 2; // if second part exists, then it's the text part of the question
        if (isText) {
          if (!row.items[sfid]) row.items[sfid] = {};
          row.items[sfid].text = values[key];
        } else {
          if (!row.items[sfid]) row.items[sfid] = {};
          row.items[sfid].sfid = sfid;
          row.items[sfid].value = values[key];
          row.items[sfid].label = questionMap[qid].Choices[values[key]].Display;
        }
      } else {
        let metaList = [
          "externalDataReference", // this is recipientID
          "recipientEmail",
          "recipientFirstName",
          "recipientLastName",
          "recordedDate",
          "responseId",
          "revieweeID",
          "revieweeFirstName",
          "revieweeLastName",
        ];
        if (metaList.includes(key)) {
          if(key==="externalDataReference"){
            row["recipientID"] = values[key];
          } else {
            row[key] = values[key];
          }          
        }
      }
    });
    results.push(row);
  });

  console.log(results)
  return results;
};
