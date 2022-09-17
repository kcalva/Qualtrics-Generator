import React from 'react'
import { useState } from 'react'

const SendUser = (props) => {

    const DEFAULT_DIRECTORY = "POOL_28S50Seuo8J1WU8"

    const [mailingListName, setMailingListName] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [extRef, setExtRef] = useState('')
    const [embeddedData, setEmbeddedData] = useState()

    let mailingListId

    const createMailingList = async (params) => {
        const mailingListData = JSON.stringify({
          "name": params.mailingListName,
        })
    
        const mailingListRequestOptions = {
          method: 'POST',
          headers: props.myHeaders,
          body: mailingListData,
          redirect: 'follow'
        }
    
        const mailingListRes = await fetch(`https://iad1.qualtrics.com/API/v3/directories/${DEFAULT_DIRECTORY}/mailinglists`, mailingListRequestOptions)
        const mailingListObj = await mailingListRes.json()
        mailingListId = mailingListObj.result.id
    
        return mailingListId
    }

    const getMailingListId = async (params) => {

        if(mailingListId === undefined){
          console.log('mailingListId not found: creating mailingList... ')
          mailingListId = createMailingList(params)
        }
       
        return mailingListId
      }

    const sendUser = async (params) => {
        console.log('surveyID on send User function ', props.surveyID)
        mailingListId = await getMailingListId(params)
    
    
        const addContactData = JSON.stringify({
            "firstName": params.firstName,
            "lastName": params.lastName,
            "email": params.email,
            "extRef": params.extRef,
            "embeddedData": JSON.parse(params.embeddedData),
            "language": "en",
        })
    
        const addContactRequestOptions = {
          method: 'POST',
          headers: props.myHeaders,
          body: addContactData,
          redirect: 'follow'
        }
    
        const addContactRes = await fetch(`https://iad1.qualtrics.com/API/v3/directories/${DEFAULT_DIRECTORY}/mailinglists/${mailingListId}/contacts`, addContactRequestOptions)
        const addContactObj = await addContactRes.json()
        console.log('adding contacts to mailing list obj ',addContactObj)
    
        const linkWrapper = "<a href=${l://SurveyURL}&Q1=1>click here</a>"
    
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
            "fromEmail": "apiexample@qualtrics.com",
            "replyToEmail": "apiexample@qualtrics.com",
            "fromName": "Test Name",
            "subject": "Example Subject"
          },
          "surveyLink": {
            "surveyId": props.surveyID,
            "type": "Individual"
          },
          "sendDate": today.toISOString()
        })
    
        const sendToUserRequestOptions = {
          method: 'POST',
          headers: props.myHeaders,
          body: sendToUserData,
          redirect: 'follow'
        }
    
        const sendToUserRes = await fetch("https://iad1.qualtrics.com/API/v3/distributions", sendToUserRequestOptions)
        const sendToUserObj = await sendToUserRes.json()
    
        console.log('sendToUserObj ', sendToUserObj)
    
      }
    return (
        <>
            <textarea value={mailingListName} onChange={(e)=>{setMailingListName(e.target.value)}}/>
            <textarea value={firstName} onChange={(e)=>{setFirstName(e.target.value)}}/>
            <textarea value={lastName} onChange={(e)=>{setLastName(e.target.value)}}/>
            <textarea value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
            <textarea value={extRef} onChange={(e)=>{setExtRef(e.target.value)}}/>
            <textarea value={embeddedData} onChange={(e)=>{setEmbeddedData(e.target.value)}}/>
            <button onClick={()=>{sendUser({ mailingListName,firstName,lastName,email,extRef,embeddedData })}} className='button'>
                Click to send to user!
            </button>
        </>  
    )
}

export default SendUser