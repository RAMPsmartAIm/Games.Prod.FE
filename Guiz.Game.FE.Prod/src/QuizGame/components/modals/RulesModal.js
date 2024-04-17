import React from 'react';
import { Modal } from 'react-bootstrap';
import './RulesModal.css';

function RulesModal({ showModal, handleCloseModal }) {
    
    return(
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header className='custom_header_modal' closeButton>
                <Modal.Title className='modal_question font_title_settings_modal'><b>Rules</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h3 className='custom_modal_header'>How to play?</h3>
                <p>
                    The game starts on a screen with a play button and the option to select the number of players (1-4). If more than one player is selected, they will take turns during the game. If only one player is selected, their opponent will be a bot (1v1). Finally, the player selects the game mode, which determines the desired number of points for the winner: Short (10 points), Medium (20 points), Long (30 points).
                </p>
                <p>
                    The game screen will feature the main question and 6 sub-questions derived from the main question, each of which can be interacted with in various ways:
                </p>
                <ol>
                    <li>The option to mark as true or false based on the main question.</li>
                    <li>Options will need to be arranged in order based on the main question.</li>
                    <li>The answer will be a numerical range from to.</li>
                    <li>The correct text option must be selected.</li>
                </ol>
                <p>
                    Players can skip a question or mark any number of options, with the selection of answers being limited by time.
                    After completing their turn, the program evaluates all questions. If any are incorrect, the player loses all points for that question and cannot continue with it; otherwise, they earn points based on the number of correct answers (1 point per correct answer).
                    The next player continues. The game continues until all players skip their turn or until all questions have been answered.
                    After each question, a scoreboard will display the points of each player. If no one reaches the winning point total, there will be a button to proceed to new game; otherwise, the score is final, and the user can return to the main screen
                </p>
            </Modal.Body>
        </Modal>
    );

}

export default RulesModal;