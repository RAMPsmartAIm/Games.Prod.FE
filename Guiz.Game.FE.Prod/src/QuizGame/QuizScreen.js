import React, { useState, useEffect, useMemo } from "react";
import StartScreen from "./StartScreen";
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import SessionStore from "./backend/SessionStore";
import "./StartScreen.css";
import Game from "./GameScreen";
import Score from "./components/Score";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PointsScreen from "./AddPoints";
import ScoreScreen from "./ScoreBoard";

function QuizScreen() {
  //code needed for session to work
  const [session, setSession] = useState(SessionStore.getData());
  const updateData = () => {
    setSession(SessionStore.getData());
  };
  useState(() => {
    SessionStore.addListener(updateData);

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      const index = SessionStore.listeners.indexOf(updateData);
      if (index !== -1) {
        SessionStore.listeners.splice(index, 1);
      }
    };
  }, []);
  //end of session code

  // Check if is landscape mode
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia("(orientation: landscape)").matches
  );
  // const [isLandscape, setIsLandscape] = useState(
  //   window.matchMedia("(orientation: landscape) and (max-device-width: 1948px)").matches
  // );

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
    };

    const handleResize = () => {
      // Update landscape mode on resize
      handleOrientationChange();
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleResize); // Add resize event listener

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleResize); // Remove resize event listener on cleanup
    };
  }, []);
  //

  const [anim, changeAnim] = useState(false);
  const handleStartGame = () => {
    if (session.disable === true) return;
    changeAnim(true);
    SessionStore.startGame();
    setTimeout(() => {
      changeAnim(false);
      SessionStore.updateStatus("in-game");
    }, 4000);
  };
  //last screen buttons
  const handleGoHome = () => {
    changeAnim2(true);
    setTimeout(() => {
      localStorage.clear();
      SessionStore.resetSession();
      changeAnim2(false);
    }, 1500);
  };
  const handlePlayAgain = () => {
    if (session.disable === true) return;
    changeAnim(true);
    changeAnim2(true);
    setTimeout(() => {
      SessionStore.resetSession();
      SessionStore.startGame();
    }, 1500);
    setTimeout(() => {
      changeAnim(false);
      changeAnim2(false);
      SessionStore.updateStatus("in-game");
    }, 4000);
  };
  //game buttons
  const handleNextQuestion = () => {
    if (session.disable === true) return;
    changeAnim(true);
    SessionStore.nextQuestion();
    setTimeout(() => {
      changeAnim(false);
      SessionStore.updateStatus("in-game");
    }, 4000);
  };

  //getting correct points
  const [noTextAnim, changeAnim2] = useState(false);
  useEffect(() => {
    if (session.status === "await_points") {
      changeAnim2(true);
      setTimeout(() => {
        SessionStore.updateStatus("points");
        changeAnim2(false);
      }, 1500);
    } else if (session.status === "await_final_points") {
      changeAnim2(true);
      setTimeout(() => {
        SessionStore.updateStatus("score");
        changeAnim2(false);
      }, 1500);
    }
  }, [session.status]);

  return (
    <div className="height_screen">
      {isLandscape ? (
        <div className="center_content_screen center_content_screen_start_page">
          <div className="container-fluid inh">
            <div className={"animation_cover"}>
              <div
                className={
                  "animation_actor" + (anim || noTextAnim ? " show-anim" : "")
                }
              ></div>
            </div>
            {anim && (
              <div className="animation_text">
                <h3>Question {session.questionNum}</h3>
                <p>{session.question}</p>
              </div>
            )}
            <div className="row inh">
              <div className="col-md-4 right_container right_container_start_screen inh zbig">
                <Navbar />
                <div
                  className={
                    "row right_bot_container" +
                    (noTextAnim
                      ? " hide-anim-fast"
                      : anim
                      ? " hider"
                      : " shower")
                  }
                >
                  <Menu
                    isLandscape={isLandscape}
                    handleStartGame={handleStartGame}
                    handleNextQuestion={handleNextQuestion}
                    handlePlayAgain={handlePlayAgain}
                    handleGoHome={handleGoHome}
                  />
                </div>
              </div>
              {session.status === "home" && (
                <StartScreen isLandscape={isLandscape} />
              )}
              {(session.status === "in-game" ||
                session.status === "await_points" ||
                session.status === "await_final_points") && (
                <Game isLandscape={isLandscape} />
              )}
              {session.status === "points" && (
                <PointsScreen isLandscape={isLandscape} />
              )}
              {session.status === "score" && (
                <ScoreScreen isLandscape={isLandscape} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="inh">
          <Navbar />
          {(session.status === "in-game" ||
            session.status === "await_points" ||
            session.status === "await_final_points") && (
            <Score score={session.score} active={session.active} />
          )}
          <div className={"animation_cover"}>
            <div
              className={
                "animation_actor" + (anim || noTextAnim ? " show-anim" : "")
              }
            ></div>
          </div>
          {anim && (
            <div className="animation_text">
              <h3>Question {session.questionNum}</h3>
              <p>{session.question}</p>
            </div>
          )}
          <div className="center_content_screen center_content_screen_start_mobile">
            <div className="container-fluid inh">
              <div className="row inh">
                {session.status === "home" && (
                  <StartScreen isLandscape={isLandscape} />
                )}
                {(session.status === "in-game" ||
                  session.status === "await_points" ||
                  session.status === "await_final_points") && (
                  <Game isLandscape={isLandscape} />
                )}
                {session.status === "points" && (
                  <PointsScreen isLandscape={isLandscape} />
                )}
                {session.status === "score" && (
                  <ScoreScreen isLandscape={isLandscape} />
                )}
                <Menu
                  enteredClassName={
                    noTextAnim ? " hide-anim-fast" : anim ? " hider" : " shower"
                  }
                  isLandscape={isLandscape}
                  handleStartGame={handleStartGame}
                  handleNextQuestion={handleNextQuestion}
                  handlePlayAgain={handlePlayAgain}
                  handleGoHome={handleGoHome}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizScreen;
