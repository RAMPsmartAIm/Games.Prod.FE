import React, {useState} from 'react';
import { Modal } from 'react-bootstrap';
import './Settings.css';
import share_pc from "../../img/share_pc.svg";
import SessionStore from "../../backend/SessionStore";
import RulesModal from "./RulesModal";


function SettingsModal(props) {
    const { showModal, handleCloseModal, handleEndGame } = props;

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
    //end session code

    // Modal handling RulesModal
    const [showModalRules, setShowModalRules] = useState(false);

    const handleShowModalRules = () => {
        setShowModalRules(true);
    };

    const handleCloseModalRules = () => {
        setShowModalRules(false);
    };
    //end of modal handling


    return(
        <>
        {props.type == "settings" && (
            <Modal show={props.showModal} onHide={props.handleCloseModal}>
                <Modal.Header className='custom_header_modal' closeButton>
                    <Modal.Title className='modal_question font_title_settings_modal'>Menu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <a onClick={handleShowModalRules} href="#" className="center_row center_row_modal">
                        <div className="score_row_settings score_row_settings_modal">
                        <div className="number_text_board number_text_board_modal">Rules</div>
                        <div className="">
                            <i className="fas fa-arrow-right"></i>
                        </div>
                        </div>
                    </a>
                    <RulesModal
                        showModal={showModalRules}
                        handleCloseModal={handleCloseModalRules}
                    />
                    <a href="#" className="center_row center_row_modal">
                        <div className="score_row_settings score_row_settings_modal">
                        <div className="number_text_board number_text_board_modal">About Us</div>
                        <div className="">
                            <i className="fas fa-arrow-right"></i>
                        </div>
                        </div>
                    </a>
                    {session.status !== "home" && (
                        <a onClick={props.handleEndGame} href="/" className="center_row center_row_modal">
                        <div className="score_row_settings score_row_settings_modal">
                            <div className="number_text_board red_text number_text_board_modal">Leave Game</div>
                            <div className="">
                            <i className="fas fa-arrow-right"></i>
                            </div>
                        </div>
                        </a>
                    )}
                </Modal.Body>
            </Modal>
        )}
        {props.type === "share" && (
            <Modal show={props.showModal} onHide={props.handleCloseModal}>
                <Modal.Header className='custom_header_modal' closeButton>
                    <Modal.Title className='modal_question font_title_settings_modal'>Share Screen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='share_container'>
                        <img src={share_pc} className='screen_icon'></img>
                        <p>Share your game on TV.</p>
                        <a href="" className="center_row center_row_modal link_share">
                            <div className="button_share">
                                <div className="number_text_board number_text_board_modal share_text">Share</div>
                            </div>
                        </a>
                    </div>
                </Modal.Body>
            </Modal>
        )}
        </>
    );

}

export default SettingsModal;