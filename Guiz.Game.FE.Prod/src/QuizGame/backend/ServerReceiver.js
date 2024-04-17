import { QuizGame } from "./GameEngine";

var game = new QuizGame();
if (localStorage.getItem("session_backend"))
  game = game.deserialize(localStorage.getItem("session_backend"));

export function getMessage(text) {
  switch (text) {
    case "start game":
      if (arguments.length === 2) game.startGame(arguments[1], 100);
      else if (arguments.length === 3)
        game.startGame(arguments[1], arguments[2]);
      else game.startGame(1, 100);
      break;
    case "skip":
      game.skipTurn();
      break;
    case "answer":
      if (arguments.length === 2) game.submit(arguments[1]);
      break;
    case "next question":
      game.nextQuestion();

    default:
      break;
  }
  setTimeout(() => {
    localStorage.setItem("session_backend", game.serialize());
  }, 100);
}
