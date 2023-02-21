import logo from './logo.svg';
import './App.css';
import Main from './components/Main';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Main></Main>
      </Router>
    </div>
  );
}

export default App;
