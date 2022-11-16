import React, { useState } from 'react'
import { sendToUser } from '../API/qualtricsAPI'

const SendUser = () => {

    const [reviewerFirstName, setreviewerFirstName] = useState('')
    const [reviewerLastName, setReviewerLastName] = useState('')
    const [reviewerEmail, setReviewerEmail] = useState('')
    const [reviewerID, setReviewerID] = useState('')
    const [revieweeFirstName, setRevieweeFirstName] = useState('')
    const [revieweeLastName, setRevieweeLastName] = useState('')
    const [revieweeID, setRevieweeID] = useState('')

    const [itemList, setItemList] = useState('')
    const [emailFromAddress, setEmailFromAddress] = useState('')
    const [emailFromName, setEmailFromName] = useState('')
    const [emailSubject, setEmailSubject] = useState('')

    let revieweeList = [{revieweeFirstName:"John",revieweeLastName:"Doe",revieweeID:"john1"},{revieweeFirstName:"Jane",revieweeLastName:"Doe",revieweeID:"jane1"}]


    return (
        <div>
            <div className='SendUser-Container'>
                <div style={{display:"flex", flexDirection: "column"}}>
                    <label>reviewerID</label>
                    <textarea value={reviewerID} onChange={(e)=>{setReviewerID(e.target.value)}}/>
                    <label>reviewerFirstName</label>
                    <textarea value={reviewerFirstName} onChange={(e)=>{setreviewerFirstName(e.target.value)}}/>
                    <label>reviewerLastName</label>
                    <textarea value={reviewerLastName} onChange={(e)=>{setReviewerLastName(e.target.value)}}/>
                    <label>reviewerEmail</label>
                    <textarea value={reviewerEmail} onChange={(e)=>{setReviewerEmail(e.target.value)}}/>
                </div>
                <div style={{display:"flex", flexDirection: "column"}}>
                    <label>revieweeID</label>
                    <textarea value={revieweeID} onChange={(e)=>{setRevieweeID(e.target.value)}}/>
                    <label>revieweeFirstName</label>
                    <textarea value={revieweeFirstName} onChange={(e)=>{setRevieweeFirstName(e.target.value)}}/>
                    <label>revieweeLastName</label>
                    <textarea value={revieweeLastName} onChange={(e)=>{setRevieweeLastName(e.target.value)}}/>
                </div>
                <div style={{display:"flex", flexDirection: "column"}}>
                    <label>itemList</label>
                    <textarea value={itemList} onChange={(e)=>{setItemList(e.target.value)}}/>
                    <label>emailSubject</label>
                    <textarea value={emailSubject} onChange={(e)=>{setEmailSubject(e.target.value)}}/>
                    <label>emailFromAddress</label>
                    <textarea value={emailFromAddress} onChange={(e)=>{setEmailFromAddress(e.target.value)}}/>
                    <label>emailFromName</label>
                    <textarea value={emailFromName} onChange={(e)=>{setEmailFromName(e.target.value)}}/>
                </div>
            </div>
            <button onClick={()=>{sendToUser({ 
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
                })}} className='Button'>
                    sendToUser
                </button>

        </div>  
    )
}

export default SendUser