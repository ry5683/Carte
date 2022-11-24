import PropTypes from 'prop-types';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import debug from 'sabio-debug';

const _logger = debug.extend('BottomLink');

const BottomLink = ({ toggle, isRegisterOpen }) => {
    const navPath = useLocation().pathname;

    const toggleLogRegModals = () => {
        toggle();
    };

    const renderLoginOrReg = () => {
        if (navPath === '/login') {
            return (
                <p className="text-muted">
                    <span>{"Don't have account?"}</span>
                    <Link to={'/register'} className="text-muted ms-1">
                        <b>{'Register'}</b>
                    </Link>
                </p>
            );
        } else if (navPath === '/register') {
            return (
                <p className="text-muted">
                    <span>{'Already have an account?'}</span>
                    <Link to={'/login'} className="text-muted ms-1">
                        <b>{'Login'}</b>
                    </Link>
                </p>
            );
        } else if (navPath === '/cart' && isRegisterOpen === false) {
            return (
                <p className="text-muted" onClick={toggleLogRegModals}>
                    {_logger('this is firing off')}
                    <span>{"Don't have account?"}</span>
                    <b className="ms-1" style={{ cursor: 'pointer' }}>
                        {'Register'}
                    </b>
                </p>
            );
        } else {
            return (
                <p className="text-muted" onClick={toggleLogRegModals}>
                    {_logger('this is firing off')}
                    <span>{'Already have an account?'}</span>
                    <b className="ms-1" style={{ cursor: 'pointer' }}>
                        {'Login'}
                    </b>
                </p>
            );
        }
    };
    return <div className="card-footer">{renderLoginOrReg()}</div>;
};
BottomLink.propTypes = {
    toggle: PropTypes.func.isRequired,
    isRegisterOpen: PropTypes.bool.isRequired,
};
export default BottomLink;
