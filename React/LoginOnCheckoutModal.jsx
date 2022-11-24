import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Login from '../../components/user/Login';
import Register from '../../components/user/Register';

const LoginOnCheckOutModal = ({ toggle, isOpen }) => {
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const togglAuthModals = () => {
        setIsRegisterOpen(!isRegisterOpen);
    };
    return (
        <React.Fragment>
            <Modal show={isOpen} onHide={toggle} className="sm-1">
                <Modal.Body>
                    {!isRegisterOpen && (
                        <Login toggle={toggle} toggleLogin={togglAuthModals} isRegisterOpen={isRegisterOpen} />
                    )}
                    {isRegisterOpen && (
                        <Register toggle={toggle} toggleLogin={togglAuthModals} isRegisterOpen={isRegisterOpen} />
                    )}
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};
LoginOnCheckOutModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
};
export default LoginOnCheckOutModal;
