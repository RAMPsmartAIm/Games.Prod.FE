import SessionStore from "../backend/SessionStore";
import { useState, useEffect } from "react";
import "./Menu.css";
function Menu(props) {
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
  //end session code

  //setting button class
  const [button_class, setButtonColor] = useState(0);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    //make sure animation does not run when starting the game
    if (button_class !== 0) setAnimate(true);
    //change background nad set color
    if (session.active === 0) {
      document.documentElement.style.setProperty("--end-color", "#6DD3FF");
      setTimeout(() => {
        setButtonColor("first_player_button");
        setAnimate(false);
      }, 1400);
    } else if (session.active === 1) {
      document.documentElement.style.setProperty("--end-color", "#FFA285");
      setTimeout(() => {
        setButtonColor("second_player_button");
        setAnimate(false);
      }, 1400);
    } else if (session.active === 2) {
      document.documentElement.style.setProperty("--end-color", "#FF92CD");
      setTimeout(() => {
        setButtonColor("third_player_button");
        setAnimate(false);
      }, 1400);
    } else if (session.active === 3) {
      document.documentElement.style.setProperty("--end-color", "#BFB49D");
      setTimeout(() => {
        setButtonColor("fourth_player_button");
        setAnimate(false);
      }, 1400);
    }
  }, [session.active]);

  //end turn function
  const EndTurn = () => {
    SessionStore.EndTurn();
  };

  return (
    <>
      {props.isLandscape ? (
        <>
          {(session.status === "in-game" ||
            session.status === "await_points" ||
            session.status === "await_final_points") && (
            <div className="right_content_up remove_padding right_content_up_mobile">
              <div className={animate ? "backgroundAnim" : "hidden"}></div>
              <div className="timer_line">
                <div
                  style={{ width: session.timer + "%" }}
                  className="timer_representation"
                ></div>
              </div>
              <div className={`right_content_game ${button_class}`}>
                <h4 className="question_text">
                  QUESTION {session.questionNum}
                </h4>
                <p className="play_text play_text_game_screen">
                  {session.question}
                </p>
                <button
                  onClick={EndTurn}
                  className={`play_button play_button_game_screen play_button_transparent`}
                >
                  {session.endTurn}
                </button>
              </div>
            </div>
          )}
          {session.status === "home" && (
            <div className="col-md-12">
              <div className="right_content_up right_content_up_start_screen">
                <div className="right_content right_content_start_screen">
                  <p className="play_text">We wish you a lot of fun!</p>
                  <button
                    onClick={() => props.handleStartGame()}
                    className="play_button play_button_start_screen"
                  >
                    Play
                  </button>
                </div>
              </div>
            </div>
          )}
          {session.status === "points" && (
            <div className="col-md-12">
              <div className="right_content_up">
                <div className="right_content_game right_content_game_points">
                  <p className="play_text player_text_points">
                    PLAYER {session.winner} WINS!
                  </p>
                  <button
                    onClick={() => props.handleNextQuestion()}
                    //onClick={() => handleScoreScreen()}
                    className="play_button play_button_points"
                  >
                    Next question
                  </button>
                </div>
              </div>
            </div>
          )}
          {session.status === "score" && (
            <div className="right_content_up">
              <div className="right_content_game right_content_score right_content_score_screen">
                <p className="play_text">
                  Go{" "}
                  <a
                    className="link_pointer"
                    onClick={() => props.handleGoHome()}
                  >
                    Home
                  </a>
                  , or
                </p>
                <a href="#">
                  <button
                    className="play_button play_button_game_screen play_button_score"
                    onClick={() => props.handlePlayAgain()}
                  >
                    Play again
                  </button>
                </a>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {session.status === "in-game" && (
            <div
              className={`col-md-4 zbig fixRow right_container button_game_part_mobile ${button_class} ${
                props.enteredClassName === " shower"
                  ? "enter_shower"
                  : props.enteredClassName
              }`}
            >
              <div className={animate ? "backgroundAnim2" : "hidden"}></div>
              <div>
                <div className="timer_line">
                  <div
                    style={{ width: session.timer + "%" }}
                    className="timer_representation"
                  ></div>
                </div>
                <div className={`row right_container_game fixRow`}>
                  <div className="right_content_up">
                    <div className="right_content_game right_content_game_screen_mobile">
                      <p className="play_text play_text_question">Question 1</p>
                      <p className="play_text">{session.question}</p>
                      <button
                        onClick={EndTurn}
                        className={`play_button play_button_transparent`}
                      >
                        {session.endTurn}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {session.status === "home" && (
            <div
              className={`col-md-4 zbig right_container ${
                props.enteredClassName === " shower"
                  ? "enter_shower"
                  : props.enteredClassName
              } `}
            >
              <div className="row right_bot_container right_bot_container_start_mobile">
                <div className="col-md-12">
                  <div className="right_content_up">
                    <div className="right_content">
                      <p className="play_text">We wish you a lot of fun!</p>
                      <button
                        onClick={() => props.handleStartGame()}
                        className="play_button play_button_start_screen"
                      >
                        Play
                      </button>
                      {/*<a href='/game'><button className='play_button'>Play</button></a>*/}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {session.status === "points" && (
            <div
              className={`col-md-12 zbig points_bot_mobile_screen ${
                props.enteredClassName === " shower"
                  ? "enter_shower"
                  : props.enteredClassName
              } `}
            >
              <div className="right_content_up">
                <div className="right_content_game right_content_game_points right_content_game_points_mobile">
                  <p className="play_text player_text_points player_text_points_mobile">
                    PLAYER {session.winner} WINS!
                  </p>
                  <button
                    onClick={() => props.handleNextQuestion()}
                    className="play_button play_button_points play_button_points_mobile"
                  >
                    Next question
                  </button>
                </div>
              </div>
            </div>
          )}
          {session.status === "score" && (
            <div
              className={`right_content_up zbig bot_score_screen ${
                props.enteredClassName === " shower"
                  ? "enter_shower"
                  : props.enteredClassName
              } `}
            >
              <div className="right_content_game right_content_score right_content_score_mobile">
                <p className="play_text play_text_mobile_score">
                  Go{" "}
                  <a
                    className="link_pointer"
                    onClick={() => props.handleGoHome()}
                  >
                    Home
                  </a>
                  , or
                </p>
                <a href="#">
                  <button
                    className="play_button play_button_game_screen play_button_score play_button_game_screen_mobile"
                    onClick={() => props.handlePlayAgain()}
                  >
                    Play again
                  </button>
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Menu;
