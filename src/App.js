import './App.css';
import CreateQuestions from './Components/CreateQuestions';

const App = () => {

  const X_API_TOKEN = "S6Vip4gGnK5e42fPs6qHPLN1Qy3LCMi7MkFcZUKy"

  let myHeaders = new Headers()
  myHeaders.append("X-API-TOKEN", X_API_TOKEN)
  myHeaders.append("Content-Type", "application/json")
  
  return (
    <div className="App">
      <header className="App-header">
        <CreateQuestions myHeaders={myHeaders}/>
      </header>
    </div>
  );
}

export default App;
