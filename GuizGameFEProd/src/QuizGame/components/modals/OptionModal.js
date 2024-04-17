import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import SessionStore from "../../backend/SessionStore";

import "./OptionModal.css";

function OptionModal({
  showModal,
  handleCloseModal,
  subQuestion,
  optionSelected,
  focused = 0,
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
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header className="custom_header_modal" closeButton>
        {/* <Modal.Title className="modal_question">{session.question}</Modal.Title> */}
      </Modal.Header>
      <Modal.Body>
        <h3 className="custom_modal_header">{subQuestion}</h3>
        <div>
          <div className="row row_options_modal">
            <div className="col-sm-6">
              <button
                onClick={() => {
                  optionSelected(session.options[0], subQuestion, 1, 1);
                  handleCloseModal();
                }}
                className={`full-width-button custom_modal_button ${
                  focused[session.questions.indexOf(subQuestion)] === 1
                    ? "focused_option"
                    : ""
                }`}
              >
                {session.options[0]}
              </button>
            </div>
            <div className="col-sm-6">
              <button
                onClick={() => {
                  optionSelected(session.options[1], subQuestion, 2, 1);
                  handleCloseModal();
                }}
                className={`full-width-button custom_modal_button ${
                  focused[session.questions.indexOf(subQuestion)] === 2
                    ? "focused_option"
                    : ""
                }`}
              >
                {session.options[1]}
              </button>
            </div>
          </div>
          {session.options.length > 2 && (
            <div className="row row_options_modal">
              <div className="col-sm-6">
                <button
                  onClick={() => {
                    optionSelected(session.options[2], subQuestion, 3, 1);
                    handleCloseModal();
                  }}
                  className={`full-width-button custom_modal_button ${
                    focused[session.questions.indexOf(subQuestion)] === 3
                      ? "focused_option"
                      : ""
                  }`}
                >
                  {session.options[2]}
                </button>
              </div>
              <div className="col-sm-6">
                <button
                  onClick={() => {
                    optionSelected(session.options[3], subQuestion, 4, 1);
                    handleCloseModal();
                  }}
                  className={`full-width-button custom_modal_button ${
                    focused[session.questions.indexOf(subQuestion)] === 4
                      ? "focused_option"
                      : ""
                  }`}
                >
                  {session.options[3]}
                </button>
              </div>
            </div>
          )}
          {session.options.length > 4 && (
            <div className="row row_options_modal">
              <div className="col-sm-6">
                <button
                  onClick={() => {
                    optionSelected(session.options[4], subQuestion, 5, 1);
                    handleCloseModal();
                  }}
                  className={`full-width-button custom_modal_button ${
                    focused[session.questions.indexOf(subQuestion)] === 5
                      ? "focused_option"
                      : ""
                  }`}
                >
                  {session.options[4]}
                </button>
              </div>
              <div className="col-sm-6">
                <button
                  onClick={() => {
                    optionSelected(session.options[5], subQuestion, 6, 1);
                    handleCloseModal();
                  }}
                  className={`full-width-button custom_modal_button ${
                    focused[session.questions.indexOf(subQuestion)] === 6
                      ? "focused_option"
                      : ""
                  }`}
                >
                  {session.options[5]}
                </button>
              </div>
            </div>
          )}

          {session.options.length > 6 && (
            <div className="row row_options_modal">
              <div className="col-sm-6">
                <button
                  onClick={() => {
                    optionSelected(session.options[6], subQuestion, 7, 1);
                    handleCloseModal();
                  }}
                  className={`full-width-button custom_modal_button ${
                    focused[session.questions.indexOf(subQuestion)] === 7
                      ? "focused_option"
                      : ""
                  }`}
                >
                  {session.options[6]}
                </button>
              </div>
              <div className="col-sm-6">
                <button
                  onClick={() => {
                    optionSelected(session.options[7], subQuestion, 8, 1);
                    handleCloseModal();
                  }}
                  className={`full-width-button custom_modal_button ${
                    focused[session.questions.indexOf(subQuestion)] === 8
                      ? "focused_option"
                      : ""
                  }`}
                >
                  {session.options[7]}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default OptionModal;
