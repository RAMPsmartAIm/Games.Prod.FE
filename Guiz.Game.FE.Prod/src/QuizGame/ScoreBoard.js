import React, { useState } from "react";
import "./ScoreBoard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import ScoreLadder from "./components/ScoreLadder";
import SessionStore from "./backend/SessionStore";

function ScoreScreen({ isLandscape }) {
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

  return (
    <>
      {isLandscape ? (
        <div className="col-md-8 border-right left_container left_container_score ">
          <h2 className="text-center title_players">Score</h2>
          <div className="wrapper_scoreboard">
            <div className="wheel_container wheel_center score_center">
              <ScoreLadder points={session.score} />
            </div>
          </div>
        </div>
      ) : (
        <div className="col-md-8 border-right left_container left_container_score top_score_screen">
          <h2 className="text-center title_players">Score</h2>
          <div>
            <div className="wheel_container wheel_center score_center">
              <ScoreLadder points={session.score} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ScoreScreen;
