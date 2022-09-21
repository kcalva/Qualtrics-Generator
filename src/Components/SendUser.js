import React, { useState } from 'react'
import { sendUser } from '../API/qualtricsAPI'

const SendUser = () => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [extRef, setExtRef] = useState('')
    const [embeddedData, setEmbeddedData] = useState()

    const [linkMetaData, setLinkMetaData] = useState('')
    const [fromEmail, setFromEmail] = useState('')
    const [replyToEmail, setReplyToEmail] = useState('')
    const [fromName, setFromName] = useState('')
    const [subject, setSubject] = useState('')


    return (
        <>
            <div className='SendUser-Container'>
                <div style={{display:"flex", flexDirection: "column"}}>
                    <label>firstName</label>
                    <textarea value={firstName} onChange={(e)=>{setFirstName(e.target.value)}}/>
                    <label>lastName</label>
                    <textarea value={lastName} onChange={(e)=>{setLastName(e.target.value)}}/>
                    <label>email</label>
                    <textarea value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                    <label>extRef</label>
                    <textarea value={extRef} onChange={(e)=>{setExtRef(e.target.value)}}/>
                    <label>embeddedData</label>
                    <textarea value={embeddedData} onChange={(e)=>{setEmbeddedData(e.target.value)}}/>
                </div>
                <div style={{display:"flex", flexDirection: "column"}}>
                    <label>linkMetaData</label>
                    <textarea value={linkMetaData} onChange={(e)=>{setLinkMetaData(e.target.value)}}/>
                    <label>fromEmail</label>
                    <textarea value={fromEmail} onChange={(e)=>{setFromEmail(e.target.value)}}/>
                    <label>replyToEmail</label>
                    <textarea value={replyToEmail} onChange={(e)=>{setReplyToEmail(e.target.value)}}/>
                    <label>fromName</label>
                    <textarea value={fromName} onChange={(e)=>{setFromName(e.target.value)}}/>
                    <label>subject</label>
                    <textarea value={subject} onChange={(e)=>{setSubject(e.target.value)}}/>
                </div>
            </div>
            <button onClick={()=>{sendUser({ firstName, lastName, email, extRef, embeddedData, linkMetaData, fromEmail, replyToEmail,fromName, subject })}} className='Button'>
                sendUser
            </button>
        </>  
    )
}

export default SendUser