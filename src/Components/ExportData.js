import React from 'react'
import { ids, headers } from '../API/constants'

const ExportData = () => {
    
    const exportingData = async () =>{

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
        console.log(questionMap)
    
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
            console.log(`Progress ${getExportProgressObj.result.percentComplete}%`)
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
            console.log(response)
            if(response.values.finished!=1) {
                console.log("ignoring")
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

        console.log("Transformed data",results)
        return results
    }

    return (
        <>
            <button onClick={()=>{exportingData()}} className='Button'>
                exportingData
            </button>
        </>
    )
}

export default ExportData