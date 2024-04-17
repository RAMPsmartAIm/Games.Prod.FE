import { useState, useEffect } from "react";
import "./ScoreLadder.css";

function ScoreLadder(props) {
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
    <div>
      <div
        className={`score_row first_row ${getKeyByValue(
          array[0],
          0
        )}_player_row`}
      >
        <div className="player_board">1</div>
        <div className="score_text_board winner_score">{array[0]}</div>
        <div className="number_text_board">🏆</div>
      </div>
      <p className="text-center">Winner</p>
      <div className={`score_row ${getKeyByValue(array[1], 1)}_player_row`}>
        <div className="player_board">2</div>
        <div className="score_text_board">{array[1]}</div>
        <div className="number_text_board"></div>
      </div>
      {array.length >= 3 && (
        <div className={`score_row ${getKeyByValue(array[2], 2)}_player_row`}>
          <div className="player_board">3</div>
          <div className="score_text_board">{array[2]}</div>
          <div className="number_text_board"></div>
        </div>
      )}
      {array.length === 4 && (
        <div className={`score_row ${getKeyByValue(array[3], 3)}_player_row`}>
          <div className="player_board">4</div>
          <div className="score_text_board">{array[3]}</div>
          <div className="number_text_board"></div>
        </div>
      )}
    </div>
  );
}

export default ScoreLadder;
