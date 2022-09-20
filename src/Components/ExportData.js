import React from 'react'
import { ids, headers } from '../constants'

const ExportData = () => {
    
    const exportingData = async () =>{

        //starting the response export
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
      
        const getExportProgressRes = await fetch(`https://iad1.qualtrics.com/API/v3/surveys/${ids.SURVEY_ID}/export-responses/${startExportObj.result.progressId}`, getExportProgressRequestOptions)
        const getExportProgressObj = await getExportProgressRes.json()


        //Get the export file
        const getExportFileRequestOptions = {
            method: 'GET',
            headers,
            redirect: 'follow'
        }
      
        const getExportFileRes = await fetch(`https://iad1.qualtrics.com/API/v3/surveys/${ids.SURVEY_ID}/export-responses/${getExportProgressObj.result.fileId}/file`, getExportFileRequestOptions)
        const getExportFileObj = await getExportFileRes.json()

        console.log('export file obj ', getExportFileObj)

    }

    return (
        <>
            <button onClick={()=>{exportingData()}} className='Button'>
                Click to Export Data
            </button>
        </>
    )
}

export default ExportData