import React, { useState, useEffect } from "react";
import Wheel from "./components/Wheel";
import "./StartScreen.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SessionStore from "./backend/SessionStore";

function StartGame({ isLandscape }) {
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

  const handleArrow = (plus) => {
    var newTimerValue = parseInt(session.timer, 10);
    if (plus === true) newTimerValue++;
    else newTimerValue--;

    if (newTimerValue <= 0 || newTimerValue > 4) return;
    SessionStore.updateTimer("0" + newTimerValue);
    SessionStore.setPlayers(newTimerValue);
  };

  const handleSelectionChange = (event) => {
    SessionStore.setMaxScore(event.target.value);
  };

  return (
    <>
      {isLandscape ? (
        <div className="col-md-8 border-right left_container left_container_start_screen">
          <h2 className="text-center title_players">Number of players</h2>
          <div className="center_wheel center_wheel_start_screen">
            <div className="wheel_arrows">
              <div onClick={() => handleArrow(false)} className="">
                <i className="fas fa-arrow-left"></i>
              </div>
              <div className="wheel_container wheel_start">
                <Wheel gameMode={false} />
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
      ) : (
        <div>
          <div className="col-md-8 border-right left_container left_container_start_screen_mobile">
            <h2 className="text-center title_players">Number of players</h2>
            <div className="center_wheel">
              <div className="wheel_arrows">
                <div onClick={() => handleArrow(false)} className="">
                  <i className="fas fa-arrow-left"></i>
                </div>
                <div className="wheel_container wheel_start">
                  <Wheel gameMode={false} />
                </div>
                <div onClick={() => handleArrow(true)} className="">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
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
        </div>
      )}
    </>
  );
}

export default StartGame;
