import React from 'react'
import { exportData } from '../API/qualtricsAPI'

const ExportData = () => {
    
    return (
        <>
            <button onClick={()=>{exportData()}} className='Button'>
                exportData
            </button>
        </>
    )
}

export default ExportData