import React, { useState, useEffect, useRef } from "react";
import OptionModal from "./modals/OptionModal";
import RangeModal from "./modals/RangeModal";
import SessionStore from "../backend/SessionStore";
import "./Wheel.css";
import circle_black from "../img/Circle_black.svg";
import circle_white from "../img/Circle_white.svg";
import circle_red from "../img/Circle_red.svg";
import circle_green from "../img/Circle_green.svg";
import ellipse_black from "../img/Ellipse_black.svg";

function Wheel({
  getIndex,
  gameMode,
  optionSelect,
  incorrect,
  focus,
  correct,
}) {
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

  //Array of colors of circle parts
  const circleSrc = [
    circle_black,
    circle_black,
    circle_black,
    circle_black,
    circle_black,
    circle_black,
  ];

  //make sure options are not required
  useEffect(() => {
    if (gameMode === false) {
      incorrect = [];
      correct = [];
    }
  }, []);

  // Modal handling OptionModal
  const [showModal1, setShowModal1] = useState(false);
  const [modalText, setModalText] = useState("");
  const [disabled, disableModal] = useState(false);

  const handleShowModal1 = (text, id) => {
    if (disabled == true) return;
    if (session.disableArray.includes(id)) return;
    setShowModal1(true);
    setModalText(text);
  };

  const handleCloseModal1 = () => {
    setShowModal1(false);
  };

  //crossing out and deactivating already answered questions
  useEffect(() => {
    var tmp = [...session.disableArray];
    tmp = tmp.concat(session.crossOut);
    const elements = document.getElementsByClassName("textSize");
    SessionStore.updateDisableArray(tmp);

    //reset crossouts
    if (session.crossOut.length === 0) {
      for (let i = 0; i < elements.length; i++) {
        const questionElement = elements[i];
        if (questionElement) {
          questionElement.classList.remove("crossed");
        }
      }
    }
    for (let i = 0; i < session.crossOut.length; i++) {
      const questionElement = elements[session.crossOut[i]];
      if (questionElement) {
        questionElement.classList.add("crossed");
      }
    }
  }, [session.crossOut]);

  //handle crossout after page refresh
  useEffect(() => {
    const elements = document.getElementsByClassName("textSize");
    console.log(session.disableArray);
    console.log(session.newQuestion + " newQuestion");
    if (session.newQuestion === true) return;
    for (let i = 0; i < session.disableArray.length; i++) {
      const questionElement = elements[session.disableArray[i]];
      if (questionElement) {
        questionElement.classList.add("crossed");
        setTimeout(() => {
          console.log("Refresh2");
          updateColors(session.disableArray[i]);
        }, 1000 * (i + 1));
      }
    }
  }, []);

  //handle animation of showing incorrect answers
  useEffect(() => {
    if (incorrect.length !== 0) {
      disableModal(true);
      const newCircle = [...input];
      const redCircle = [...input];
      for (let i = 0; i < incorrect.length; i++) {
        redCircle[incorrect[i]] = circle_red;
        if (newCircle[incorrect[i]] !== circle_white) {
          //fixing for bot play, should not act in case of player play
          newCircle[incorrect[i]] = circle_white;
          console.log("incorrect");
          updateColors(incorrect[i]);
        }
      }
      changeColor(redCircle);
      setTimeout(() => {
        changeColor(newCircle);
      }, 300);
      setTimeout(() => {
        changeColor(redCircle);
      }, 600);
      setTimeout(() => {
        changeColor(newCircle);
      }, 900);
      setTimeout(() => {
        changeColor(redCircle);
      }, 1200);
      setTimeout(() => {
        changeColor(newCircle);
        disableModal(false);
      }, 4000);
    }
  }, [incorrect]);

  //handle animation of showing correct answers
  useEffect(() => {
    if (correct.length !== 0) {
      disableModal(true);
      const newCircle = [...input];
      const redCircle = [...input];
      for (let i = 0; i < correct.length; i++) {
        redCircle[correct[i]] = circle_green;
        if (newCircle[correct[i]] !== circle_white) {
          //fixing for bot play, should not act in case of player play
          newCircle[correct[i]] = circle_white;
          console.log("correct");
          updateColors(correct[i]);
        }
      }
      changeColor(redCircle);
      setTimeout(() => {
        changeColor(newCircle);
      }, 300);
      setTimeout(() => {
        changeColor(redCircle);
      }, 600);
      setTimeout(() => {
        changeColor(newCircle);
      }, 900);
      setTimeout(() => {
        changeColor(redCircle);
      }, 1200);
      setTimeout(() => {
        changeColor(newCircle);
        disableModal(false);
      }, 4000);
    }
  }, [correct]);

  //saving state and updating it (so updating colors) when getIndex changes
  const [input, changeColor] = useState(circleSrc);
  const [textColor, changeTextColor] = useState([
    "white",
    "white",
    "white",
    "white",
    "white",
    "white",
  ]);
  const [fader, changeFader] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  useEffect(() => {
    console.log("getIndex");
    updateColors(getIndex);
  }, [getIndex]);
  //change colors after refresh
  useEffect(() => {
    const lastCharacters = Object.keys(session.storedOptions).map((value) =>
      value.slice(-1)
    );
    for (let i = 0; i < lastCharacters.length; i++) {
      setTimeout(() => {
        console.log("refresh");
        updateColors(parseInt(lastCharacters[i]) - 1);
      }, 300 * (i + 1));
    }
  }, []);

  //color changing logic
  const updateColors = (index) => {
    const newColors = [...input]; //big circle src
    const newTextColor = [...textColor]; //text color inside the circle
    const newFader = [...fader]; //disapear of small circle animation
    if (index != null) {
      disableModal(true);
      if (newColors[index] == circle_black) {
        newColors[index] = circle_white;
        newTextColor[index] = "black";
        newFader[index] = true;
        changeFader(newFader);
        setTimeout(() => {
          newFader[index] = false;
          changeFader(newFader);
          changeColor(newColors);
          disableModal(false);
        }, 300);
      } else {
        newColors[index] = circle_black;
        newTextColor[index] = "white";
        newFader[index] = true;
        changeFader(newFader);
        setTimeout(() => {
          newFader[index] = false;
          changeFader(newFader);
          changeColor(newColors);
          disableModal(false);
        }, 200);
      }

      changeTextColor(newTextColor);
    }
  };
  return (
    <div className="parent">
      {gameMode && (
        <div className="f_width">
          <p
            onClick={() => handleShowModal1(session.questions[0], 0)}
            className="textSize p1"
          >
            {session.questions[0]}
          </p>
          <p
            onClick={() => handleShowModal1(session.questions[1], 1)}
            className="textSize p2"
          >
            {session.questions[1]}
          </p>
          <p
            onClick={() => handleShowModal1(session.questions[2], 2)}
            className="textSize p3"
          >
            {session.questions[2]}
          </p>
          <p
            onClick={() => handleShowModal1(session.questions[3], 3)}
            className="textSize p4"
          >
            {session.questions[3]}
          </p>
          <p
            onClick={() => handleShowModal1(session.questions[4], 4)}
            className="textSize p5"
          >
            {session.questions[4]}
          </p>
          <p
            onClick={() => handleShowModal1(session.questions[5], 5)}
            className="textSize p6"
          >
            {session.questions[5]}
          </p>
        </div>
      )}
      {gameMode && (
        <div className="f_width">
          <div
            onClick={() => handleShowModal1(session.questions[0], 0)}
            className="first_count counter_div"
          >
            <p className={`counter_text ${textColor[0]}`}>1</p>
          </div>
          <div
            onClick={() => handleShowModal1(session.questions[1], 1)}
            className="second_count counter_div"
          >
            <p className={`counter_text ${textColor[1]}`}>2</p>
          </div>
          <div
            onClick={() => handleShowModal1(session.questions[2], 2)}
            className="third_count counter_div"
          >
            <p className={`counter_text ${textColor[2]}`}>3</p>
          </div>
          <div
            onClick={() => handleShowModal1(session.questions[3], 3)}
            className="fourth_count counter_div"
          >
            <p className={`counter_text ${textColor[3]}`}>4</p>
          </div>
          <div
            onClick={() => handleShowModal1(session.questions[4], 4)}
            className="fifth_count counter_div"
          >
            <p className={`counter_text ${textColor[4]}`}>5</p>
          </div>
          <div
            onClick={() => handleShowModal1(session.questions[5], 5)}
            className="sixth_count counter_div"
          >
            <p className={`counter_text ${textColor[5]}`}>6</p>
          </div>
        </div>
      )}
      <div className="circle_div">
        <img
          src={input[5]}
          alt="Circle"
          className={`rotate-300 size ${fader[5] ? "opacity-0" : ""}`}
        />
        <img
          src={input[1]}
          alt="Circle"
          className={`rotate-60 size ${fader[1] ? "opacity-0" : ""}`}
        />
        <img
          src={input[2]}
          alt="Circle"
          className={`rotate-120 size ${fader[2] ? "opacity-0" : ""}`}
        />
        <img
          src={input[4]}
          alt="Circle"
          className={`rotate-240 size ${fader[4] ? "opacity-0" : ""}`}
        />
        <img
          src={input[0]}
          alt="Circle"
          className={`rotate-0 size ${fader[0] ? "opacity-0" : ""}`}
        />
        <img
          src={input[3]}
          alt="Circle"
          className={`rotate-180 size ${fader[3] ? "opacity-0" : ""}`}
        />
        <img src={ellipse_black} alt="Eclipse" className="center" />
      </div>
      <div className="f_width">
        <p className="timer">{session.timer}</p>
      </div>
      {session.options && session.options.length !== 0 && (
        <OptionModal
          showModal={showModal1}
          handleCloseModal={handleCloseModal1}
          subQuestion={modalText}
          optionSelected={optionSelect}
          focused={focus}
        />
      )}
      {session.options && session.options.length === 0 && (
        <RangeModal
          showModal={showModal1}
          handleCloseModal={handleCloseModal1}
          subQuestion={modalText}
          optionSelected={optionSelect}
          valueSelected={focus}
        />
      )}
    </div>
  );
}

export default Wheel;
