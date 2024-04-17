import React, { useState, useEffect } from "react";
import Wheel from "./components/Wheel";
import Navbar from "./components/Navbar";
import { Link } from "react-router-dom";
import "./StartScreen.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

function StartGame() {
  // Check if is landscape mode
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia("(orientation: landscape)").matches
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);
  //

  const [points, changePoints] = useState(100);
  const [timer, changeTimer] = useState("01");

  const handleArrow = (plus) => {
    var newTimerValue = parseInt(timer, 10);
    if (plus === true) newTimerValue++;
    else newTimerValue--;

    if (newTimerValue <= 0 || newTimerValue > 4) return;
    changeTimer("0" + newTimerValue);
  };

  const handleSelectionChange = (event) => {
    changePoints(event.target.value);
  };

  const [anim, changeAnim] = useState(false);
  const handleStartGame = (num, maxScore) => {
    changeAnim(true);
  };
  return (
    <div className="height_screen">
      {isLandscape ? (
        <div className="center_content_screen center_content_screen_start_page">
          <div className="container-fluid inh">
            <div className={"animation_cover" + (anim ? " show" : "")}>
              <div>
                <h3>Question 1</h3>
                <p>Hello</p>
              </div>
            </div>
            <div className="row inh">
              <div className="col-md-4 right_container right_container_start_screen">
                <Navbar />
                <div
                  className={
                    "row right_bot_container right_bot_container_start_screen" +
                    (anim ? " hider" : "")
                  }
                >
                  <div className="col-md-12">
                    <div className="right_content_up right_content_up_start_screen">
                      <div className="right_content">
                        <p className="play_text">We wish you a lot of fun!</p>
                        <button
                          onClick={() => handleStartGame(timer, points)}
                          className="play_button play_button_start_screen"
                        >
                          Play
                        </button>
                        {/*<Link className='link_margin' to={'/game' } state = {{ players: timer, points: points }}>
                                                <button className='play_button play_button_start_screen'>Play</button>
                                            </Link>*/}
                        {/*<a href='/game'><button className='play_button'>Play</button></a>*/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 border-right left_container left_container_start_screen">
                <h2 className="text-center title_players">Number of players</h2>
                <div className="center_wheel center_wheel_start_screen">
                  <div className="wheel_arrows">
                    <div onClick={() => handleArrow(false)} className="">
                      <i className="fas fa-arrow-left"></i>
                    </div>
                    <div className="wheel_container wheel_start">
                      <Wheel gameMode={false} timer={timer} />
                    </div>
                    <div onClick={() => handleArrow(true)} className="">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
                <div className="row right_top_container right_top_container_start_screen">
                  <div className="col-md-12 ">
                    <div className="right_content_up_points border_down">
                      <div className="right_content right_content_up_media right_content_points">
                        <p className="game_type_text">
                          Choose the number of points needed for win!
                        </p>
                        <select
                          className="select_game_type"
                          onChange={handleSelectionChange}
                        >
                          <option>100</option>
                          <option>200</option>
                          <option>500</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="inh">
          <Navbar />
          <div className="center_content_screen center_content_screen_start_mobile">
            <div className="container-fluid inh">
              <div className="row inh">
                <div className="col-md-8 border-right left_container left_container_start_screen_mobile">
                  <h2 className="text-center title_players">
                    Number of players
                  </h2>
                  <div className="center_wheel">
                    <div className="wheel_arrows">
                      <div onClick={() => handleArrow(false)} className="">
                        <i className="fas fa-arrow-left"></i>
                      </div>
                      <div className="wheel_container wheel_start">
                        <Wheel getIndex={null} gameMode={false} timer={timer} />
                      </div>
                      <div onClick={() => handleArrow(true)} className="">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 right_container">
                  <div className="row right_top_container right_top_container_start_mobile">
                    <div className="col-md-12 ">
                      <div className="right_content_up border_down_mobile">
                        <div className="right_content right_content_up_media">
                          <p className="game_type_text">
                            Choose the number of points needed for win!
                          </p>
                          <select
                            className="select_game_type"
                            onChange={handleSelectionChange}
                          >
                            <option>100</option>
                            <option>200</option>
                            <option>500</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row right_bot_container right_bot_container_start_mobile">
                    <div className="col-md-12">
                      <div className="right_content_up">
                        <div className="right_content">
                          <p className="play_text">We wish you a lot of fun!</p>
                          <Link
                            to={"/game"}
                            state={{ players: timer, points: points }}
                          >
                            <button className="play_button play_button_start_screen">
                              Play
                            </button>
                          </Link>
                          {/*<a href='/game'><button className='play_button'>Play</button></a>*/}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StartGame;

/*
import React, { useState, useEffect } from "react";
import { sendMessage } from "./backend/ClientSender";
import { useLocation } from "react-router-dom";
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

function Game() {
  // Check if is landscape mode
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia("(orientation: landscape)").matches
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);
  //

  //start game based on number of player from the last
  const location = useLocation();
  const [score, changeScore] = useState([]);
  useEffect(() => {
    sendMessage("start game", location.state.players);
    var initialScore = Array.from({ length: location.state.players }, () => 0);
    changeScore(initialScore);
  }, []); // Empty dependency array ensures it runs only once

  //store subquestion object and answer object
  const [storedQuestions, setStoredQuestions] = useState({});
  const [storedAnsweres, setstoredAnsweres] = useState({});

  //handle getting new question
  const [question, changeQuestion] = useState("");
  window.setQuestion = (text) => {
    changeQuestion(text);
    changeEndTurn("Skip turn");

    //reset the wheel
    for (let i = 0; i < crossOuts.length; i++) {
      changeInput(null);
      setTimeout(() => {
        changeInput(crossOuts[i]);
      }, i * 300);
    }
    setTimeout(() => {
      changeCrossOuts([]);
    }, crossOuts.length * 300);
  };

  //timer
  const [timer, changeTimer] = useState("00");
  const startTimer = () => {
    clearInterval(timerInterval);
    changeTimer("99");
    timerInterval = setInterval(() => {
      changeTimer((prevTimer) => {
        let timerInt = parseInt(prevTimer);
        timerInt -= 1;

        if (timerInt === 0) {
          clearInterval(timerInterval);
        }

        return timerInt < 10 ? "0" + timerInt : timerInt.toString();
      });
    }, 1000);
  };

  //handle subquestions
  const [subQuestions, changeSubquestions] = useState(["", "", "", "", "", ""]);
  window.setSubquestion = (array) => {
    setStoredQuestions(array);
    changeSubquestions(Object.values(array));
  };

  //handle options
  const [options, changeOptions] = useState(["", ""]);
  window.setOptions = (array) => {
    changeOptions(array);
    setstoredAnsweres({});
  };

  //handle turn announcement and button color
  const [active, changeActive] = useState(0);
  const [button_class, setButtonColor] = useState(0);
  window.turnAnnounce = (num) => {
    changeActive(num);
    changeButtonColor(num);
    startTimer();
  };

  const changeButtonColor = (player_id) => {
    if (player_id === 0) {
      setButtonColor("first_player_button");
    }
    if (player_id === 1) {
      setButtonColor("second_player_button");
    }
    if (player_id === 2) {
      setButtonColor("third_player_button");
    }
    if (player_id === 3) {
      setButtonColor("fourth_player_button");
    }
  };

  //handle correct answer announcement
  const [crossOuts, changeCrossOuts] = useState([]);
  const [incorrect, changeIncorrect] = useState([]);
  const [correct, changeCorrect] = useState([]);
  window.correct = (object) => {
    //get all answered objects
    var tmp = [...crossOuts];
    var tmpIncorrect = [];
    var tmpCorrect = [];
    //range question
    if (options.length === 0) {
      for (const key in storedAnsweres) {
        if (compareRange(storedAnsweres[key], object[key]) === false) {
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
      for (const key in storedAnsweres) {
        if (
          storedAnsweres[key].toString().toLowerCase() !==
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
    setTimeout(() => {
      changeCrossOuts(tmp); //crossout all options
      setstoredAnsweres({});
    }, 4000);
  };

  //handle selected option
  const [input, changeInput] = useState(null);
  const [endTurn, changeEndTurn] = useState("Skip turn");
  const [buttonFocus, changeButtonFocus] = useState([-1, -1, -1, -1, -1, -1]);
  const handleOptionSelection = (option, subquestion, focused, type) => {
    var key = findKeyByValue(storedQuestions, subquestion); //get correct subquestion

    //change color
    if (!(changeKey(key) in storedAnsweres)) {
      changeInput(null);
      setTimeout(() => {
        changeInput(parseInt(key.match(/\d+/)[0]) - 1);
      }, 10);
    }
    //save selected option
    const newStoredAnswers = { ...storedAnsweres };
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
    setstoredAnsweres(newStoredAnswers);
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
    if (Object.keys(newStoredAnswers).length === 0) changeEndTurn("Skip turn");
    else changeEndTurn("End turn");
  };

  //end or skip turn
  const EndTurn = () => {
    clearInterval(timerInterval);
    if (Object.keys(storedAnsweres).length > 0)
      sendMessage("answer", storedAnsweres); //send submit
    else sendMessage("skip"); //send skip
    // Reset saved values of selected options
    var resetArray = [-1, -1, -1, -1, -1, -1];
    changeButtonFocus(resetArray);
    changeEndTurn("Skip turn");
  };

  //handle score changes
  window.setScore = (array) => {
    changeScore(array);
  };

  return (
    <div className="height_screen">
      {isLandscape ? (
        <div className="center_content_screen mobile_content_screen inh">
          <div className="container-fluid whole_wheel">
            <div className="row row_wheel">
              <div
                className={`col-md-4 right_container right_container_game ${button_class}`}
              >
                <Navbar />
                <div className="row right_container_game">
                  <div className="right_content_up">
                    <div className="timer_line">
                      <div
                        style={{ width: timer + "%" }}
                        className="timer_representation"
                      ></div>
                    </div>
                    <div className="right_content_game">
                      <h4 className="question_text">QUESTION 1</h4>
                      <p className="play_text play_text_game_screen">
                        {question}
                      </p>
                      <button
                        onClick={EndTurn}
                        className={`play_button_game_screen play_button ${button_class}`}
                      >
                        {endTurn}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8 border-right left_container left_container_mobile wheel_media lines">
                <Score score={score} active={active} />
                <div class="mid_wheel">
                  <div className="wheel_container wheel_center">
                    <Wheel
                      getIndex={input}
                      gameMode={true}
                      questions={subQuestions}
                      timer={timer}
                      question={question}
                      options={options}
                      optionSelect={handleOptionSelection}
                      crossOut={crossOuts}
                      incorrect={incorrect}
                      focus={buttonFocus}
                      correct={correct}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="inh">
          <Navbar />
          <Score score={score} active={active} />
          <div className="center_content_screen mobile_content_screen center_content_game_screen_mobile inh">
            <div className="container-fluid inh">
              <div className="row inh">
                <div className="col-md-8 border-right left_container left_container_mobile wheel_media lines wheel_game_part_mobile">
                  <div className="wheel_container wheel_center">
                    <Wheel
                      getIndex={input}
                      gameMode={true}
                      questions={subQuestions}
                      timer={timer}
                      question={question}
                      options={options}
                      optionSelect={handleOptionSelection}
                      crossOut={crossOuts}
                      incorrect={incorrect}
                      focus={buttonFocus}
                      correct={correct}
                    />
                  </div>
                </div>
                <div className="timer_line">
                  <div
                    style={{ width: timer + "%" }}
                    className="timer_representation"
                  ></div>
                </div>
                <div
                  className={`col-md-4 right_container button_game_part_mobile ${button_class}`}
                >
                  <div className={`row right_container_game`}>
                    <div className="right_content_up">
                      <div className="right_content_game right_content_game_screen_mobile">
                        <p className="play_text play_text_question">
                          Question 1
                        </p>
                        <p className="play_text">{question}</p>
                        <button
                          onClick={EndTurn}
                          className={`play_button ${button_class}`}
                        >
                          {endTurn}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;


*/
