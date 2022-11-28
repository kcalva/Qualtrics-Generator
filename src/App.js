import './App.css'
import CreateQuestions from './Components/CreateQuestions'
import SendUser from './Components/SendUser'
import ExportData from './Components/ExportData'
import ReorderQuestions from './Components/ReorderQuestions'

const App = () => {
  
  return (
    <div className="App">
      <header className="App-header">
        <CreateQuestions/>
        <SendUser/>
        <ExportData/>

        <ReorderQuestions/>


      </header>
    </div>
  )
}

export default App
