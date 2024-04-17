import { sendMessage } from "./ClientSender";

class SessionStore {
  //variables needed to be present in data object
  static statusKey = "session_status";
  static questionKey = "session_annotating";
  static optionsKey = "session_options";
  static activeKey = "session_active";
  static scoreKey = "session_score";
  static questionNumKey = "session_question_num";
  static timerKey = "session_timer";
  static questionsKey = "session_questions";
  static storedQuestionsKey = "session_storedQuestions";
  static storedOptionsKey = "session_storedoptions";
  static endTurnKey = "session_endturn";
  static crosoutKey = "session_crosout";
  static disabledKey = "session_disabled";
  static pointChangeKey = "session_pointChange";
  static winnerKey = "session_winner";

  //static status = "home";
  static status = localStorage.getItem(SessionStore.statusKey) || "home";
  static question = localStorage.getItem(SessionStore.questionKey) || "";
  static winner = localStorage.getItem(SessionStore.winnerKey) || "1";
  static disableArray = localStorage.getItem(SessionStore.disabledKey)
    ? JSON.parse(localStorage.getItem(SessionStore.disabledKey))
    : [];
  static crossOut = localStorage.getItem(SessionStore.crosoutKey)
    ? JSON.parse(localStorage.getItem(SessionStore.crosoutKey))
    : [];
  static questionNum = localStorage.getItem(SessionStore.questionNumKey) || "0";
  static options = localStorage.getItem(SessionStore.optionsKey)
    ? JSON.parse(localStorage.getItem(SessionStore.optionsKey))
    : ["", ""];
  static active = parseInt(localStorage.getItem(SessionStore.activeKey)) || 0;
  static score = localStorage.getItem(SessionStore.scoreKey)
    ? JSON.parse(localStorage.getItem(SessionStore.scoreKey))
    : [0, 0];
  static pointChange = localStorage.getItem(SessionStore.pointChangeKey)
    ? JSON.parse(localStorage.getItem(SessionStore.pointChangeKey))
    : [0, 0];
  static timer = localStorage.getItem(SessionStore.timerKey) || "02";
  static questions = localStorage.getItem(SessionStore.questionsKey)
    ? JSON.parse(localStorage.getItem(SessionStore.questionsKey))
    : ["", "", "", "", "", ""];
  static storedQuestions = localStorage.getItem(SessionStore.storedQuestionsKey)
    ? JSON.parse(localStorage.getItem(SessionStore.storedQuestionsKey))
    : {};
  static storedOptions = localStorage.getItem(SessionStore.storedOptionsKey)
    ? JSON.parse(localStorage.getItem(SessionStore.storedOptionsKey))
    : {};

  static endTurn = localStorage.getItem(SessionStore.endTurnKey) || "Skip turn";
  static disableButton = false;
  static newQuestion = false;

  static getData() {
    return {
      status: this.status,
      question: this.question,
      questions: this.questions,
      storedQuestions: this.storedQuestions,
      options: this.options,
      active: this.active,
      score: this.score,
      questionNum: this.questionNum,
      timer: this.timer,
      storedOptions: this.storedOptions,
      endTurn: this.endTurn,
      crossOut: this.crossOut,
      disableArray: this.disableArray,
      pointChange: this.pointChange,
      winner: this.winner,
      disable: this.disableButton,
      newQuestion: this.newQuestion,
    };
  }

  static resetSession() {
    this.status = "home";
    this.question = "";
    this.winner = "1";
    this.disableArray = [];
    this.crossOut = [];
    this.questionNum = "0";
    this.options = ["", ""];
    this.active = 0;
    this.score = [0, 0];
    this.pointChange = [0, 0];
    this.timer = "02";
    this.questions = ["", "", "", "", "", ""];
    this.storedQuestions = {};
    this.storedOptions = {};
    this.players = 2;
    this.maxScore = 100;
    this.timerInterval = null;
    this.skipped = false;
    this.stopper = false;
    this.botTurnVar = false;
    this.notifyListeners();
  }

  static updateStatus(newStatus) {
    SessionStore.status = newStatus;
    localStorage.setItem(SessionStore.statusKey, newStatus);
    this.notifyListeners();
  }

  static updateDisable(newValue) {
    SessionStore.disableButton = newValue;
    this.notifyListeners();
  }

  static updateQuestion(newValue) {
    SessionStore.question = newValue;
    localStorage.setItem(SessionStore.questionKey, newValue);
    this.notifyListeners();
  }

  static updateDisableArray(newValue) {
    SessionStore.disableArray = newValue;
    localStorage.setItem(SessionStore.disabledKey, JSON.stringify(newValue));
    console.log(SessionStore.disableArray);
    this.notifyListeners();
  }

  static updateCrossouts(newValue) {
    SessionStore.crossOut = newValue;
    localStorage.setItem(SessionStore.crossOut, JSON.stringify(newValue));
    this.notifyListeners();
  }

  static updateOptions(newOptions) {
    SessionStore.options = newOptions;
    localStorage.setItem(SessionStore.optionsKey, JSON.stringify(newOptions));
    this.notifyListeners();
  }

  static updateStoredOptions(newValue) {
    SessionStore.storedOptions = newValue;
    localStorage.setItem(
      SessionStore.storedOptionsKey,
      JSON.stringify(newValue)
    );
    this.notifyListeners();
  }

  //handling timouts must take place
  static updateActive(newActive) {
    localStorage.setItem(SessionStore.activeKey, newActive);
    var tm = 0;
    if (this.botTurnVar === true) tm = 4500;
    if (this.skipped) {
      setTimeout(() => {
        SessionStore.active = newActive;
        this.notifyListeners();
        this.startTimer();
        this.skipped = false;
      }, tm);
    } else {
      setTimeout(() => {
        SessionStore.active = newActive;
        this.notifyListeners();
        this.startTimer();
      }, tm + 4500);
    }
  }

  static updateScore(newScore) {
    var oldScore = this.score;
    var tm = 0;
    if (this.botTurnVar === true) tm = 4500;
    if (this.stopper === false) {
      if (this.skipped === true) {
        //last turn has been skipped
        this.calculateRoundEnd(oldScore, newScore);
        setTimeout(() => {
          this.updateStatus("await_points");
        }, tm + 100);
      } else {
        this.calculateRoundEnd(oldScore, newScore);
        setTimeout(() => {
          this.updateStatus("await_points");
        }, tm + 4500);
      }
    } else this.stopper = false;
    localStorage.setItem(SessionStore.scoreKey, JSON.stringify(newScore));
    setTimeout(() => {
      this.score = [...newScore];
      this.notifyListeners();
    }, tm + 1500);
  }

  static updateQuestionNumber(newValue) {
    SessionStore.questionNum = newValue;
    localStorage.setItem(SessionStore.questionNumKey, newValue);
    this.notifyListeners();
  }

  static updateNewQuestion(newValue) {
    SessionStore.newQuestion = newValue;
    this.notifyListeners();
  }

  static updateTimer(newValue) {
    SessionStore.timer = newValue;
    localStorage.setItem(SessionStore.timerKey, newValue);
    this.notifyListeners();
  }

  static updateEndTurn(newValue) {
    SessionStore.endTurn = newValue;
    localStorage.setItem(SessionStore.endTurnKey, newValue);
    this.notifyListeners();
  }

  static updateWinner(newValue) {
    SessionStore.winner = newValue;
    localStorage.setItem(SessionStore.winnerKey, newValue);
    this.notifyListeners();
  }

  static updatePointsChange(newValue) {
    SessionStore.pointChange = Object.values(newValue);
    localStorage.setItem(
      SessionStore.pointChangeKey,
      JSON.stringify(Object.values(newValue))
    );
    this.notifyListeners();
  }

  static updateQuestions(newValue) {
    SessionStore.questions = Object.values(newValue);
    localStorage.setItem(
      SessionStore.questionsKey,
      JSON.stringify(Object.values(newValue))
    );
    this.notifyListeners();
    this.updateQuestionNumber(parseInt(this.questionNum) + 1);
  }

  static updateStoredQuestions(newValue) {
    SessionStore.storedQuestions = newValue;
    localStorage.setItem(
      SessionStore.storedQuestionsKey,
      JSON.stringify(newValue)
    );
    this.notifyListeners();
  }

  //helpful variables, not needed for UI
  static players = 2;
  static maxScore = 100;
  static timerInterval = null;
  static skipped = false;
  static stopper = false;
  static botTurnVar = false;

  static startGame() {
    sendMessage("start game", this.players, this.maxScore);
    this.stopper = true;
    this.updateScore(
      Array.from({ length: this.players === 1 ? 2 : this.players }, () => 0)
    );
    this.updateDisable(true); //disables another clicking
    setTimeout(() => {
      this.updateDisable(false);
    }, 2000);
  }

  static nextQuestion() {
    if (this.disableButton == true) return;
    sendMessage("next question");
    this.updateDisable(true); //disables another clicking
    this.updateNewQuestion(true);
    setTimeout(() => {
      this.updateDisable(false);
      this.updateNewQuestion(true);
    }, 4000);
  }

  static setPlayers(num) {
    this.players = num;
  }

  static setMaxScore(num) {
    this.maxScore = num;
  }

  static startTimer() {
    clearInterval(this.timerInterval);
    this.updateTimer("99");
    this.timerInterval = setInterval(() => {
      let timerInt = parseInt(this.timer);
      timerInt -= 1;

      if (timerInt === 0) {
        SessionStore.EndTurn();
        clearInterval(this.timerInterval);
      }

      let result = timerInt < 10 ? "0" + timerInt : timerInt.toString();
      this.updateTimer(result);
    }, 1000);
  }

  //call for final score of the game
  static finalScore(score) {
    if (this.skipped === true) {
      setTimeout(() => {
        this.updateStatus("await_final_points");
      }, 100);
      setTimeout(() => {
        this.score = [...score];
        localStorage.setItem(SessionStore.scoreKey, JSON.stringify(score));
        this.notifyListeners();
      }, 1500);
    } else {
      setTimeout(() => {
        this.updateStatus("await_final_points");
      }, 4500);
      setTimeout(() => {
        this.score = [...score];
        localStorage.setItem(SessionStore.scoreKey, JSON.stringify(score));
        this.notifyListeners();
      }, 6000);
    }
  }

  static resumeTimer() {
    clearInterval(this.timerInterval);
    if (this.timer !== "00")
      this.timerInterval = setInterval(() => {
        let timerInt = parseInt(this.timer);
        timerInt -= 1;

        if (timerInt === 0) {
          clearInterval(this.timerInterval);
        }

        let result = timerInt < 10 ? "0" + timerInt : timerInt.toString();
        this.updateTimer(result);
      }, 1000);
  }

  static EndTurn() {
    if (this.disableButton === true) return;
    clearInterval(this.timerInterval);
    if (Object.keys(this.storedOptions).length > 0) {
      sendMessage("answer", this.storedOptions); //send submit
      setTimeout(() => {
        this.updateEndTurn("Skip turn");
      }, 4500);
      this.updateDisable(true); //disables another clicking
      setTimeout(() => {
        if (this.botTurnVar === false) this.updateDisable(false);
        else
          setTimeout(() => {
            this.updateDisable(false);
          }, 4500);
      }, 6000);
    } else {
      this.skipped = true;
      sendMessage("skip"); //send skip
      this.updateDisable(true); //disables another clicking
      setTimeout(() => {
        if (this.botTurnVar === false) this.updateDisable(false);
        else
          setTimeout(() => {
            this.updateDisable(false);
          }, 4500);
      }, 1500);
    }
  }

  static calculateRoundEnd(old, newData) {
    var result = [];
    for (let i = 0; i < old.length; i++) {
      result.push(newData[i] - old[i]);
    }
    this.updatePointsChange(result);
    this.updateWinner(result.indexOf(Math.max(...result)) + 1);
  }

  static botTurn(isBotTurn) {
    this.botTurnVar = isBotTurn;
  }

  //hangle observers
  static listeners = [];
  static addListener(fun) {
    this.listeners.push(fun);
  }
  static notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export default SessionStore;
