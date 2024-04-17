import { useState, useEffect } from "react";
import "./PointsLadder.css";

function PointsLadder(props) {
  const [leaderboard, setLeaderboard] = useState({
    first: null,
    second: null,
    third: null,
    fourth: null,
  });
  const [array, setPoints] = useState([...props.points]);
  useEffect(() => {
    if (!props.points || props.points.length === 0) return; // Handle empty points array

    const sortedPoints = props.points; // Sorted copy to avoid mutation
    const newLeaderboard = {
      first: sortedPoints[0],
      second: sortedPoints[1],
      third: sortedPoints.length >= 3 ? sortedPoints[2] : null,
      fourth: sortedPoints.length >= 4 ? sortedPoints[3] : null,
    };
    setLeaderboard(newLeaderboard);
    setPoints(array.sort((a, b) => b - a));
  }, []);
  const getKeysByValue = (value) => {
    const foundKeys = [];
    for (const key of Object.keys(leaderboard)) {
      if (leaderboard[key] === value) {
        foundKeys.push(key); // Add the key to the array
      }
    }
    return foundKeys; // Return the array of all matching keys
  };
  const getKeyByValue = (value, order) => {
    if (array.filter((item) => item === value).length > 1) {
      var tmp = array.indexOf(value);
      var playerOrder = order - tmp;
      return getKeysByValue(value)[playerOrder];
    }
    return Object.keys(leaderboard).find((key) => leaderboard[key] === value);
  };
  return (
    <div className="points_container">
      <div className={`points_row ${getKeyByValue(array[0], 0)}_player_row`}>
        <div className="score_text_board_points">+ {array[0]}</div>
      </div>
      <div className={`points_row ${getKeyByValue(array[1], 1)}_player_row`}>
        <div className="score_text_board_points">+ {array[1]}</div>
      </div>
      {props.points.length > 2 && (
        <div className={`points_row ${getKeyByValue(array[2], 2)}_player_row`}>
          <div className="score_text_board_points">+ {array[2]}</div>
        </div>
      )}
      {props.points.length > 3 && (
        <div className={`points_row ${getKeyByValue(array[3], 3)}_player_row`}>
          <div className="score_text_board_points">+ {array[3]}</div>
        </div>
      )}
    </div>
  );
}

export default PointsLadder;
