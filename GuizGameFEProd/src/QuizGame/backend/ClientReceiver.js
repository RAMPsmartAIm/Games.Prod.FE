import SessionStore from "./SessionStore";

export function getMessage(text) {
  if (arguments.length === 2) {
    var param = text;
    text = arguments[1];
    if (param === "question")
      // sends text of an question
      SessionStore.updateQuestion(text);
    if (param === "error")
      // sends error message
      console.log(text);
    if (param === "options") {
      // sends object of all options, randomly distributed or ordered as necessary
      SessionStore.updateOptions(text);
      SessionStore.updateStoredOptions({});
    }
    if (param === "botTurn")
      //inform about bot turn
      window.botTurn(text);

    if (param === "subquestions") {
      // sends object of all subquestions
      SessionStore.updateStoredQuestions(text);
      SessionStore.updateQuestions(text);
    }
    if (param === "turn")
      //sends information about currently active player
      SessionStore.updateActive(text);
    if (param === "leaderboard")
      //sends state of an leaderboard in an array, index represents player number (index 0 = player 1)
      SessionStore.updateScore(text);
    if (param === "finalLeaderboard")
      //sends final score of the game
      SessionStore.finalScore(text);
    if (param === "correct")
      // sends response to submited answere, true or false
      window.isCorrect(text);
    if (param === "answered")
      // sends object of correct answers for an question, apears after submiting answer
      window.correct(text);
  }
}
