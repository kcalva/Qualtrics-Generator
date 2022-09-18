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

    const [linkText, setLinkText] = useState('')
    const [linkMetaData, setLinkMetaData] = useState('')
    const [fromEmail, setFromEmail] = useState('')
    const [replyToEmail, setReplyToEmail] = useState('')
    const [fromName, setFromName] = useState('')
    const [subject, setSubject] = useState()

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
    
        const linkWrapper = "<a href=${l://SurveyURL}&" + params.linkMetaData +">"+ params.linkText + "</a>"
    
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
            "fromEmail": params.fromEmail,
            "replyToEmail": params.replyToEmail,
            "fromName": params.fromName,
            "subject": params.subject
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
            <div className='SendUser-Container'>
                <div style={{display:"flex", flexDirection: "column"}}>
                    <label>MailingList Name</label>
                    <textarea value={mailingListName} onChange={(e)=>{setMailingListName(e.target.value)}}/>
                    <label>First Name</label>
                    <textarea value={firstName} onChange={(e)=>{setFirstName(e.target.value)}}/>
                    <label>Last Name</label>
                    <textarea value={lastName} onChange={(e)=>{setLastName(e.target.value)}}/>
                    <label>Email</label>
                    <textarea value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    <label>External Reference</label>
                    <textarea value={extRef} onChange={(e)=>{setExtRef(e.target.value)}}/>
                    <label>Embedded Data <br/>(must be in JSON form ex. {`{ showQ1 : "true" }`})</label>
                    <textarea value={embeddedData} onChange={(e)=>{setEmbeddedData(e.target.value)}}/>
                </div>
                <div style={{display:"flex", flexDirection: "column"}}>
                    <label>Link Description</label>
                    <textarea value={linkText} onChange={(e)=>{setLinkText(e.target.value)}}/>
                    <label>Link MetaData</label>
                    <textarea value={linkMetaData} onChange={(e)=>{setLinkMetaData(e.target.value)}}/>
                    <label>From Email</label>
                    <textarea value={fromEmail} onChange={(e)=>{setFromEmail(e.target.value)}}/>
                    <label>Reply To Email</label>
                    <textarea value={replyToEmail} onChange={(e)=>{setReplyToEmail(e.target.value)}}/>
                    <label>From</label>
                    <textarea value={fromName} onChange={(e)=>{setFromName(e.target.value)}}/>
                    <label>Subject</label>
                    <textarea value={subject} onChange={(e)=>{setSubject(e.target.value)}}/>
                </div>
            </div>
            <button onClick={()=>{sendUser({ mailingListName,firstName,lastName,email,extRef,embeddedData, linkText, linkMetaData, fromEmail, replyToEmail,fromName, subject })}} className='Button'>
                Click to send to user!
            </button>
        </>  
    )
}

export default SendUser