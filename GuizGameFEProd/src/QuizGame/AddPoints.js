import React, { useState } from "react";
import "./AddPoints.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Score from "./components/Score";
import PointsLadder from "./components/PointsLadder";
import SessionStore from "./backend/SessionStore";

function PointsScreen({ isLandscape }) {
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
        <div className="col-md-8 border-right left_container">
          <Score score={session.score} />
          <div className="wheel_container wheel_center point_container_media">
            <div>
              <PointsLadder points={session.pointChange} />
            </div>
          </div>
        </div>
      ) : (
        <div className="col-md-8 border-right left_container points_top_screen_mobile">
          <Score score={session.score} />
          <div className="wheel_container wheel_center point_container_media">
            <div>
              <PointsLadder points={session.pointChange} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PointsScreen;
