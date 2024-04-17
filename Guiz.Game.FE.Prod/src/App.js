import React, { useEffect, useState } from "react";
import { getQuestion } from "./utils/database_query";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import StartGame from "./QuizGame/StartScreen";
import Game from "./QuizGame/GameScreen";
import PointsScreen from "./QuizGame/AddPoints";
import ScoreScreen from "./QuizGame/ScoreBoard";
import InfoPage from "./QuizGame/InfoPage";

import logo from "./logo.svg";
import "./App.css";
import QuizScreen from "./QuizGame/QuizScreen";

function App() {
  // // Variable of function output
  // const [data, setData] = useState(null);

  // // Execute function
  // useEffect(() => {
  //   async function fetchData() {
  //     const result = await getQuestion(1);
  //     setData(result);
  //     console.log(result);
  //   }
  //   fetchData();

  // }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuizScreen />} />
        <Route path="/game" element={<Game />} />
        <Route path="/points" element={<PointsScreen />} />
        <Route path="/score" element={<ScoreScreen />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>

    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //     {data && data.length > 0 && (
    //       <p>{data[0].question}</p>
    //     )}
    //   </header>
    // </div>
  );
}

export default App;
