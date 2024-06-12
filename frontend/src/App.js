import './App.css';
import MyApi from './MyApi';

function App() {
  return (
    <div className="App">
        <header className="App-header">
            <h1>Data from API:</h1>
            <MyApi/>
        </header>
    </div>
  );
}

export default App;
