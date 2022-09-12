import './App.css';

const App = () => {

  const X_API_TOKEN = "S6Vip4gGnK5e42fPs6qHPLN1Qy3LCMi7MkFcZUKy"

  const DEFAULT_DIRECTORY = "POOL_28S50Seuo8J1WU8"

  let myHeaders = new Headers();
  myHeaders.append("X-API-TOKEN", X_API_TOKEN);
  myHeaders.append("Content-Type", "application/json");
  
  let surveyResults
  let questionResults

  const createSurvey = async () => {

    const surveyData = JSON.stringify({
      "SurveyName": "USSF Project",
      "Language": "EN",
      "ProjectCategory": "EX"
    });

    const surveyRequestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: surveyData,
      redirect: 'follow'
    };

    //Creating the survey
    const res = await fetch("https://iad1.qualtrics.com/API/v3/survey-definitions", surveyRequestOptions)
    const surveyObj =  await res.json()
    surveyResults = surveyObj.result
    console.log('survey results: ', surveyResults)
  }


  const createQuestions = async () => {
    let questionData = JSON.stringify({
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
      headers: myHeaders,
      body: questionData,
      redirect: 'follow'
    };
  

    //Creating the questions we want 
    const res = await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyResults.SurveyID}/questions?blockId=${surveyResults.DefaultBlockID}`, questionRequestOptions)
    const questionObj =  await res.json()
    questionResults = questionObj.result

    console.log('question results: ', questionResults)

  }

  const updateQuestions = async () => {

    let updatedQuestionData = JSON.stringify({
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
                  "LeftOperand": "Q2",
                  "Operator": "EqualTo",
                  "RightOperand": "1",
                  "Type": "Expression",
                  "Description": "<span class=\"ConjDesc\">If</span>  <span class=\"LeftOpDesc\">Q2</span> <span class=\"OpDesc\">Is Equal to</span> <span class=\"RightOpDesc\"> 1 </span>"
              },
              "Type": "If"
          },
          "Type": "BooleanExpression",
          "inPage": false
      },
      "QuestionText_Unsafe": "I am treated with respect at work"
    })

    const updateRequestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: updatedQuestionData,
      redirect: 'follow'
    };

    console.log('surveyResults ', surveyResults)
    const res = await fetch(`https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyResults.SurveyID}/questions/${questionResults.QuestionID}`, updateRequestOptions)
    const updateObj = await res.json()
    console.log('updateObj ', updateObj)

  }

  const sendUser = async () => {

    const mailingListData = JSON.stringify({
      "name": "USSF mailing list",
    })

    const addContactData = JSON.stringify({
        "firstName": "Kevin",
        "lastName": "Calva",
        "email": "kevin.calva@us.isobar.com",
        "phone": "123-123-1234",
        "extRef": "something",
        "embeddedData": {},
        "language": "en",
        "unsubscribed": false
    })

    const mailingListRequestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: mailingListData,
      redirect: 'follow'
    }

    const addContactRequestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: addContactData,
      redirect: 'follow'
    }

    const mailingListRes = await fetch(`https://iad1.qualtrics.com/API/v3/directories/${DEFAULT_DIRECTORY}/mailinglists`, mailingListRequestOptions)
    const mailingListObj = await mailingListRes.json()
    console.log('mailingListObj ', mailingListObj)

    const addContactRes = await fetch(`https://iad1.qualtrics.com/API/v3/directories/${DEFAULT_DIRECTORY}/mailinglists/${mailingListObj.result.id}/contacts`, addContactRequestOptions)
    const addContactObj = await addContactRes.json()
    console.log('adding contacts to mailing list obj ',addContactObj)

    const linkWrapper = "<a href=${l://SurveyURL}&Q1=1&Q2=1>click here</a>"

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    const sendToUserData = JSON.stringify({
      "message": {
        "messageText": linkWrapper
      },
      "recipients": {
        "mailingListId": mailingListObj.result.id,
        "contactId": addContactObj.result.contactLookupId     
      },
      "header": {
        "fromEmail": "apiexample@qualtrics.com",
        "replyToEmail": "apiexample@qualtrics.com",
        "fromName": "Test Name",
        "subject": "Example Subject"
      },
      "surveyLink": {
        "surveyId": surveyResults.SurveyID,
        "type": "Individual"
      },
      "sendDate": today.toISOString()
    })

    const sendToUserRequestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: sendToUserData,
      redirect: 'follow'
    }

    const sendToUserRes = await fetch("https://iad1.qualtrics.com/API/v3/distributions", sendToUserRequestOptions)
    const sendToUserObj = await sendToUserRes.json()

    console.log('sendToUserObj ', sendToUserObj)

  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={createSurvey} className='button'>
          Click to add survey
        </button>
        <button onClick={createQuestions} className='button'>
          Click to add questions
        </button>
        <button onClick={updateQuestions} className='button'>
          Click to update question
        </button>
        <button onClick={sendUser} className='button'>
          Click to send to user!
        </button>
      </header>
    </div>
  );
}

export default App;
