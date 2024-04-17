import React, { useState } from "react";
import SessionStore from "../../backend/SessionStore";
import { Modal, Button } from "react-bootstrap";
import "./RangeModal.css";

function RangeModal({
  showModal,
  handleCloseModal,
  subQuestion,
  optionSelected,
  valueSelected = 0,
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

  const [inputValue, setInputValue] = useState(
    valueSelected[session.questions.indexOf(subQuestion)]
  );

  // Function to handle changes in the input field
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Check value
  function check_value(value){
    var number = 0;
    if (value == -1) {
      number = 0;
    } else {
      number = value;
    }
    return number;
  }

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header className="custom_header_modal" closeButton>
        <Modal.Title className="modal_question">{session.question}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3 className="custom_modal_header">{subQuestion}</h3>
        <div className="range_modal_input_box">
          <input
            type="number"
            className="range_modal_input"
            defaultValue={check_value(valueSelected[session.questions.indexOf(subQuestion)])}
            onChange={handleInputChange}
          />
          <button
            className="range_modal_button"
            onClick={() => {
              optionSelected(inputValue, subQuestion, 0, 2);
              handleCloseModal();
            }}
          >
            Confirm
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default RangeModal;
