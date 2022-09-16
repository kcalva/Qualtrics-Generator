import React from 'react'

const ExportData = (props) => {
    
    const exportingData = async () =>{

        //starting the response export
        const startExportData = JSON.stringify({
            "format": "json"
        })

        const startExportRequestOptions = {
            method: 'POST',
            headers: props.myHeaders,
            body: startExportData,
            redirect: 'follow'
        }
      
        const startExportRes = await fetch(`https://iad1.qualtrics.com/API/v3/surveys/${props.surveyID}/export-responses`, startExportRequestOptions)
        const startExportObj = await startExportRes.json()

        //Get the progress of the export
        const getExportProgressRequestOptions = {
            method: 'GET',
            headers: props.myHeaders,
            redirect: 'follow'
        }
      
        const getExportProgressRes = await fetch(`https://iad1.qualtrics.com/API/v3/surveys/${props.surveyID}/export-responses/${startExportObj.result.progressId}`, getExportProgressRequestOptions)
        const getExportProgressObj = await getExportProgressRes.json()


        //Get the export file
        const getExportFileRequestOptions = {
            method: 'GET',
            headers: props.myHeaders,
            redirect: 'follow'
        }
      
        const getExportFileRes = await fetch(`https://iad1.qualtrics.com/API/v3/surveys/${props.surveyID}/export-responses/${getExportProgressObj.result.fileId}/file`, getExportFileRequestOptions)
        const getExportFileObj = await getExportFileRes.json()

        console.log('export file obj ', getExportFileObj)

    }

    return (
        <>
            <button onClick={()=>{exportingData()}} className='button'>
                Click to Export Data
            </button>
        </>
    )
}

export default ExportData