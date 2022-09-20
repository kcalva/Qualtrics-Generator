import './App.css'
import CreateQuestions from './Components/CreateQuestions'
import SendUser from './Components/SendUser'
import ExportData from './Components/ExportData'

const X_API_TOKEN = "S6Vip4gGnK5e42fPs6qHPLN1Qy3LCMi7MkFcZUKy"
const SURVEY_ID = "SV_bfruEir8oft3iWa"
const DEFAULT_DIRECTORY = "POOL_28S50Seuo8J1WU8"
const MAILINGLIST_ID = "CG_1IinPnnXNsd3fxT"

const App = () => {
  let myHeaders = new Headers()
  myHeaders.append("X-API-TOKEN", X_API_TOKEN)
  myHeaders.append("Content-Type", "application/json")
  
  return (
    <div className="App">
      <header className="App-header">
        <CreateQuestions myHeaders={myHeaders} surveyID={SURVEY_ID}/>
        <SendUser myHeaders={myHeaders} surveyID={SURVEY_ID} directory={DEFAULT_DIRECTORY} mailingListID={MAILINGLIST_ID}/>
        <ExportData myHeaders={myHeaders} surveyID={SURVEY_ID}/>
      </header>
    </div>
  );
}

export default App;
