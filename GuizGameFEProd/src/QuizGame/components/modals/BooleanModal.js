import React from 'react';
import { Modal } from 'react-bootstrap';
import './BooleanModal.css';

function BolleanModal({ showModal, handleCloseModal }) {
    
    return(
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header className='custom_header_modal' closeButton>
                <Modal.Title className='modal_question'>Select the capitals of the following European countries</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h3 className='custom_modal_header'>TRUE / FALSE</h3>
                    <div>
                        <div className="row row_options_modal">
                            <div className="col-sm-6">
                                <button className="full-width-button custom_modal_button">True</button>
                            </div>
                            <div className="col-sm-6">
                                <button className="full-width-button custom_modal_button">False</button>
                            </div>
                        </div>
                    </div>
            </Modal.Body>
        </Modal>
    );

}

export default BolleanModal;