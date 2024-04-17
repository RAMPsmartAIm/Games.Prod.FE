/*
state of the game:
    0 - initialized, no game created
    1 - getting started with amount of players
    2 - error state, game can not cotinue
*/

import {
  compareObjectsRange,
  compareObjects,
  fillWithZeroes,
  getObjectWithKeys,
  getQuestionWithId,
  getQuestionsLength,
  getRandomKeys,
  getRandomNumberInRange,
  shuffle,
} from "../../utils/QuizGameUtils";
import { sendMessage } from "./ServerSender";

export class QuizGame {
  constructor() {
    this.state = 0;
    this.usedQuestions = [];
  }

  //serialize class so it can be used later
  serialize() {
    return JSON.stringify({
      state: this.state,
      usedQuestions: this.usedQuestions,
      playersNum: this.playersNum,
      useBot: this.useBot,
      activePlayer: this.activePlayer,
      roundScore: this.roundScore,
      scores: this.scores,
      playing: this.playing,
      answered: this.answered,
      currentQuestion: this.currentQuestion,
      answers: this.answers,
      range: this.range,
      goal: this.goal,
    });
  }
  //deserialize data from storage
  deserialize(json) {
    const data = JSON.parse(json);
    const game = new QuizGame();
    game.state = data.state;
    game.usedQuestions = data.usedQuestions;
    game.playersNum = data.playersNum;
    game.useBot = data.useBot;
    game.activePlayer = data.activePlayer;
    game.roundScore = data.roundScore;
    game.scores = data.scores;
    game.playing = data.playing;
    game.answered = data.answered;
    game.currentQuestion = data.currentQuestion;
    game.answers = data.answers;
    game.range = data.range;
    game.goal = data.goal;
    return game;
  }

  // Initialize new game started by the player
  startGame(numPlayers, goalScore) {
    if (numPlayers > 4) {
      sendMessage("error", "Too many players");
      return 0;
    } else if (numPlayers < 1) {
      sendMessage("error", "No players selected");
      return 0;
    } else if (numPlayers === 1) {
      this.playersNum = 2;
      this.useBot = true;
    } else {
      this.playersNum = numPlayers;
      this.useBot = false;
    }
    //set goal of the game, amount of points
    try {
      if (
        !(
          parseInt(goalScore) === 100 ||
          parseInt(goalScore) === 200 ||
          parseInt(goalScore) === 500
        )
      )
        return 0;
    } catch (e) {
      console.error(e);
    }

    this.state = 1;
    this.activePlayer = 0;
    this.roundScore = fillWithZeroes(this.playersNum);
    this.scores = fillWithZeroes(this.playersNum);
    this.playing = fillWithZeroes(this.playersNum);
    this.answered = [];
    this.goal = goalScore;

    this.handleQuestion();
  }

  // Currently active player skips turn
  // Marks player as not playing and proceeds to next turn
  skipTurn() {
    if (this.state !== 1) return -1;
    this.playing[this.activePlayer] = 1;
    this.nextTurn(false);
  }

  // Answer is submited, checks if correct and sends back the answere, moves to next player
  submit(input, bot = false) {
    if (this.state !== 1) return -1;
    //check if question have not yet been answered
    const keys = Object.keys(input);
    if (keys.some((element) => this.answered.includes(element))) {
      //check if any answer have been already answered
      sendMessage("error", "Answeres have already been answered");
      this.state = 2;
      return 0;
    }
    //fix first selection
    for (var i = 0; i < keys.length; i++) {
      if (input[keys[i]] === undefined) input[keys[i]] = 0;
    }
    //getting results for non range questions
    if (this.range == false) {
      //all answers are correct
      if (compareObjects(input, this.answers)) {
        this.roundScore[this.activePlayer] += keys.length * 10;
      }
      //some answer is not correct
      else {
        this.roundScore[this.activePlayer] = 0;
        this.playing[this.activePlayer] = 1;
      }
    }
    //getting results for range questions
    else {
      //all answers are correct
      if (compareObjectsRange(input, this.answers)) {
        this.roundScore[this.activePlayer] += keys.length * 10;
      }
      //some answer is not correct
      else {
        this.roundScore[this.activePlayer] = 0;
        this.playing[this.activePlayer] = 1;
      }
    }

    //send correct answers to the frontend
    const correctValues = {};
    Object.keys(input).forEach((key) => {
      if (this.answers.hasOwnProperty(key)) {
        correctValues[key] = this.answers[key];
      }
    });
    sendMessage("answered", correctValues);

    //add currently submited answers to the array of already answered questions
    this.answered.push(...keys);
    this.nextTurn(bot);
  }

  // Moves to another player within same question
  nextTurn(bot) {
    if (this.state !== 1) return -1;
    this.activePlayer++;
    if (this.activePlayer >= this.playersNum) {
      this.activePlayer = 0;
    }
    //stop if all players are inactive
    if (this.playing.includes(0) === false) {
      this.nextRound();
      return 0;
    }
    //stop if all answers have been answered

    if (this.answered.length === Object.keys(this.answers).length) {
      this.nextRound();
      return 0;
    }
    //find next active player
    var counter = 10; //save code
    while (this.playing[this.activePlayer] !== 0) {
      if (this.activePlayer >= this.playersNum) {
        this.activePlayer = 0;
      }
      this.activePlayer++;
      if (counter === 0) break;
      else counter--;
    }

    if (this.useBot === true && this.activePlayer === 1) {
      if (bot === false) this.makeBotTurn();
      else this.nextRound();
    } else {
      sendMessage("turn", this.activePlayer);
    }
  }

  // Moves to a new round, gets new question and start round anew
  nextRound() {
    console.log(this.roundScore);
    if (this.state !== 1) return -1;
    if (this.useBot === true) {
      this.activePlayer = 0;
      sendMessage("turn", this.activePlayer);
    }
    for (let i = 0; i < this.roundScore.length; i++) {
      this.scores[i] += this.roundScore[i];
    }
    if (this.scores.some((element) => element >= this.goal))
      sendMessage("finalLeaderboard", this.scores);
    else sendMessage("leaderboard", this.scores);
    this.roundScore = fillWithZeroes(this.playersNum);
    this.playing = fillWithZeroes(this.playersNum);
    this.answered = [];
  }

  // Moves to the next round
  nextQuestion() {
    this.handleQuestion();
  }

  // Handle question gathering, including new random question from range
  // Saves question data to the object and sends to frontend
  handleQuestion() {
    // Retrieve number of questions
    getQuestionsLength().then((result) => {
      //get random question and save it
      var questionId = getRandomNumberInRange(
        1,
        result[0].len,
        this.usedQuestions
      ); //need to replace second with actual number of rows
      if (questionId === -1) {
        //case all question have been used
        this.usedQuestions = [];
        questionId = getRandomNumberInRange(
          1,
          result[0].len,
          this.usedQuestions
        );
      }
      this.usedQuestions.push(questionId);
      getQuestionWithId(questionId) //waiting for async function to complete
        .then((result) => {
          this.currentQuestion = result[0].question;
          sendMessage("question", this.currentQuestion); //send question
          this.answers = JSON.parse(result[0].answers); //save answers to object
          sendMessage("subquestions", JSON.parse(result[0].subquestions)); //send subquestions in form of JSON
          //send message based on the question type
          this.range = false; //set question type to other than range
          if (result[0].question_type_id === 1)
            //boolean
            sendMessage("options", ["True", "False"]);
          else if (result[0].question_type_id === 2)
            //order
            sendMessage("options", [1, 2, 3, 4, 5, 6]);
          else if (result[0].question_type_id === 3) {
            //range
            sendMessage("options", []); //empty array represents that answer should be inputed
            this.range = true; //set question type to range
          } else if (result[0].question_type_id === 4)
            //string
            sendMessage(
              "options",
              shuffle(Object.values(JSON.parse(result[0].answers)))
            );
          sendMessage("turn", this.activePlayer);
        })
        .catch((error) => {
          this.currentQuestion = "";
          console.log(error);
          sendMessage("error", "Problem with connection");
        });
    });
  }

  // Handle bot desicion making
  // Based on statistical, adjusting values will change bot difficulty level
  makeBotTurn() {
    sendMessage("botTurn", true);
    const answer1 = 3,
      answer2 = 7,
      answer3 = 8,
      answer4 = 9; //set these values as threshold for deciding amount of answers
    const answerCorrectly = 7; //set these values for chance of correct answer
    var submit = 0;

    const answerNum = Math.floor(Math.random() * 10);
    if (answerNum >= answer4) {
      submit = 4;
    } else if (answerNum >= answer3) {
      submit = 3;
    } else if (answerNum >= answer2) {
      submit = 2;
    } else if (answerNum >= answer1) {
      submit = 1;
    } else {
      submit = 1;
    }

    var answerObject = getObjectWithKeys(
      this.answers,
      getRandomKeys(this.answers, submit, this.answered)
    ); // object with correct answers

    if (answerCorrectly <= Math.floor(Math.random() * 10)) {
      sendMessage("correct", true);
      setTimeout(() => {
        this.submit(answerObject, true);
      }, 20);
    } else {
      answerObject[getRandomKeys(answerObject, 1, [])[0]] = "";
      sendMessage("correct", false);
      setTimeout(() => {
        this.submit(answerObject, true);
      }, 20);
    }
    setTimeout(() => {
      sendMessage("botTurn", false);
    }, 40);
  }
}
