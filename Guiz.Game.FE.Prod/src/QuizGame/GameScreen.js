import React, { useState, useEffect } from "react";
import SessionStore from "./backend/SessionStore";
import {
  findKeyByValue,
  changeKey,
  compareRange,
} from "../utils/QuizGameUtils";
import "./GameScreen.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Wheel from "./components/Wheel";
import Navbar from "./components/Navbar";
import Score from "./components/Score";

var timerInterval;

function Game({ isLandscape }) {
  //code needed for session to work
  const [session, setSession] = useState(SessionStore.getData());
  const updateData = () => {
    setSession(SessionStore.getData());
  };
  useState(() => {
    SessionStore.addListener(updateData);

    //resume timer
    if (session.timerInterval == null) {
      SessionStore.resumeTimer();
    }
    // Cleanup function to unsubscribe when component unmounts
    return () => {
      const index = SessionStore.listeners.indexOf(updateData);
      if (index !== -1) {
        SessionStore.listeners.splice(index, 1);
      }
    };
  }, []);

  //handle getting new question

  useEffect(() => {
    console.log(session.newQuestion);
    if (session.newQuestion === false) return;
    setTimeout(() => {
      SessionStore.updateCrossouts([]);
      SessionStore.updateDisableArray([]);
      var resetArray = [-1, -1, -1, -1, -1, -1];
      changeButtonFocus(resetArray);
    }, session.crossOut.length * 300);
  }, [session.question]);

  //handle correct answer announcement
  const [incorrect, changeIncorrect] = useState([]);
  const [correct, changeCorrect] = useState([]);
  const [isCorrect, changeIsCorrect] = useState(false); //inform if bot played correct or incorrect turn
  const [isBot, changeBot] = useState(false); //inform if currently submited turn is bot turn or not
  const [delay, changeDelay] = useState(0); //delay bot correct/incorrect animation
  window.isCorrect = (bool) => {
    //corect decision of bot
    changeIsCorrect(bool);
  };
  window.botTurn = (bool) => {
    //alert that bot is playing
    SessionStore.botTurn(bool);
    changeBot(bool);
  };
  window.correct = (object) => {
    var tmp = [...session.crossOut];
    //case of bot turn
    if (isBot) {
      var tmpCorrect = [];
      for (const key in object) {
        tmp.push(parseInt(key.match(/\d+/)[0]) - 1);
        tmpCorrect.push(parseInt(key.match(/\d+/)[0]) - 1);
      }
      if (!isCorrect)
        setTimeout(() => {
          changeIncorrect(tmpCorrect); //inform about incorrect
        }, delay);
      else
        setTimeout(() => {
          changeCorrect(tmpCorrect); //infrom about correct answeres
        }, delay);
    } else {
      //get all answered objects
      var tmpIncorrect = [];
      var tmpCorrect = [];
      //range question
      if (session.options.length === 0) {
        for (const key in session.storedOptions) {
          if (compareRange(session.storedOptions[key], object[key]) === false) {
            tmpIncorrect.push(parseInt(key.match(/\d+/)[0]) - 1);
          }
          tmp.push(parseInt(key.match(/\d+/)[0]) - 1);
          tmpCorrect.push(parseInt(key.match(/\d+/)[0]) - 1);
        }
        if (tmpIncorrect.length !== 0)
          changeIncorrect(tmpIncorrect); //inform about incorrect
        else changeCorrect(tmpCorrect); //infrom about correct answeres
      }
      //boolean string or order question
      else {
        for (const key in session.storedOptions) {
          if (
            session.storedOptions[key].toString().toLowerCase() !==
            object[key].toString().toLowerCase()
          ) {
            tmpIncorrect.push(parseInt(key.match(/\d+/)[0]) - 1);
          }
          tmp.push(parseInt(key.match(/\d+/)[0]) - 1);
          tmpCorrect.push(parseInt(key.match(/\d+/)[0]) - 1);
        }
        if (tmpIncorrect.length !== 0)
          changeIncorrect(tmpIncorrect); //inform about incorrect
        else changeCorrect(tmpCorrect); //infrom about correct answeres
      }
      //delay for bot animation
      changeDelay(4500);
      setTimeout(() => {
        changeDelay(0);
      }, 4500);
    }
    setTimeout(() => {
      SessionStore.updateCrossouts(tmp); //crossout all options
      SessionStore.updateStoredOptions({});
    }, 4000);
  };

  //handle selected option
  const [input, changeInput] = useState(null);
  const [buttonFocus, changeButtonFocus] = useState([-1, -1, -1, -1, -1, -1]);
  const handleOptionSelection = (option, subquestion, focused, type) => {
    var key = findKeyByValue(session.storedQuestions, subquestion); //get correct subquestion

    //change color
    if (!(changeKey(key) in session.storedOptions)) {
      changeInput(null);
      setTimeout(() => {
        changeInput(parseInt(key.match(/\d+/)[0]) - 1);
      }, 10);
    }
    //save selected option
    const newStoredAnswers = { ...session.storedOptions };
    var newKey = changeKey(key);
    if (newStoredAnswers.hasOwnProperty(newKey)) {
      if (newStoredAnswers[newKey] === option) {
        delete newStoredAnswers[newKey];
        changeInput(null);
        setTimeout(() => {
          changeInput(parseInt(key.match(/\d+/)[0]) - 1);
        }, 10);
      } else newStoredAnswers[newKey] = option;
    } else {
      newStoredAnswers[newKey] = option;
    }
    SessionStore.updateStoredOptions(newStoredAnswers);
    // ak budeš tlakovat že som ti to tu menil len pri tom range modaly tak som pridal type
    // argument, ten ak je 1 (option modal) 2 (range)
    // save id of selected button
    if (type === 1) {
      var subquestionNumber = key.charAt(key.length - 1);
      const newButtonFocus = [...buttonFocus];
      // unselect option
      if (newButtonFocus[subquestionNumber - 1] === focused) {
        newButtonFocus[subquestionNumber - 1] = -1;
        changeButtonFocus(newButtonFocus);
      } else {
        newButtonFocus[subquestionNumber - 1] = focused;
        changeButtonFocus(newButtonFocus);
      }
    }
    // save range input select
    if (type === 2) {
      var subquestionNumber = key.charAt(key.length - 1);
      const newButtonFocus = [...buttonFocus];
      newButtonFocus[subquestionNumber - 1] = option;
      changeButtonFocus(newButtonFocus);
    }

    //change skip turn to end turn and other way around
    if (Object.keys(newStoredAnswers).length === 0)
      SessionStore.updateEndTurn("Skip turn");
    else SessionStore.updateEndTurn("End turn");
  };

  return (
    <>
      {isLandscape ? (
        <div className="col-md-8 border-right left_container left_container_mobile wheel_media lines">
          <Score score={session.score} active={session.active} />
          <div className="mid_wheel">
            <div className="wheel_container wheel_center">
              <Wheel
                getIndex={input}
                gameMode={true}
                optionSelect={handleOptionSelection}
                incorrect={incorrect}
                focus={buttonFocus}
                correct={correct}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="col-md-8 border-right left_container left_container_mobile wheel_media lines wheel_game_part_mobile">
          <div className="wheel_container wheel_center">
            <Wheel
              getIndex={input}
              gameMode={true}
              timer={session.timer}
              optionSelect={handleOptionSelection}
              incorrect={incorrect}
              focus={buttonFocus}
              correct={correct}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Game;
