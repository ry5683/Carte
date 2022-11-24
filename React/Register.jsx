import { ErrorMessage, Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import ReactGa from 'react-ga4';
import { BiUser } from 'react-icons/bi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import debug from 'sabio-debug';
import Swal from 'sweetalert2';
import registerSchema from '../../schemas/registerSchema';
import userService from '../../services/userService';
import AccountLayout from './AccountLayout';
import BottomLink from './BottomLink';
import './user.css';

const _logger = debug.extend('Register');

const Register = ({ toggleLogin, isRegisterOpen }) => {
    const [payload] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        isRestaurantOrg: false,
        dialogBoxValue: '',
    });
    const [inviteInfo, setCurrentInvite] = useState({
        firstname: '',
        middleInitial: '',
        lastName: '',
        email: '',
        inviteTypeId: '',
        orgId: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [dialogBox, setDialogBox] = useState({
        showDialogBox: false,
        dialogBox: null,
    });
    const [referenceValues, setReferenceValues] = useState({
        referenceType: 0,
        otherSource: null,
    });

    const nav = useNavigate();
    const invite = useLocation();

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });

    useEffect(() => {
        if (invite.state === null) {
        } else if (invite?.state.type === 'CONFIRMED_INVITE') {
            setCurrentInvite((prevState) => {
                _logger('invite', invite);
                const newEmployee = { ...prevState };
                newEmployee.firstname = invite.state.info.firstname;
                newEmployee.middleInitial = invite.state.info.middleInitial;
                newEmployee.lastname = invite.state.info.lastname;
                newEmployee.email = invite.state.info.email;
                newEmployee.inviteTypeId = invite.state.info.inviteTypeId;
                newEmployee.orgId = invite.state.info.orgId;
                return newEmployee;
            });
            payload.email = invite.state.info.email;
            payload.inviteTypeId = invite.state.info.inviteTypeId;
        }
        setDialogBox((prev) => {
            let newState = { ...prev };
            newState.showDialogBox = false;
            newState.dialogBox = dialogComponent();
            return newState;
        });
    }, []);

    const dialogComponent = () => {
        return (
            <>
                <Row className="mb-2">
                    <label>input reference information</label>
                    <Field name="dialogBoxValue" className="form-control" placeholder="input reference information" />
                </Row>
            </>
        );
    };

    const onSignUp = (values) => {
        _logger('values', values);
        let otherSource = null;
        if (values.dialogBoxValue !== '') {
            otherSource = values.dialogBoxValue;
        }
        let payload = {
            userInfo: values,
            siteReference: {
                referenceType: referenceValues.referenceType,
                otherSource: otherSource,
            },
        };
        userService.register(payload).then(onRegisterSuccess).catch(onRegisterError);
        ReactGa.event({
            action: 'register_action',
            category: 'register_category',
            label: 'register_label',
            value: 'xxxxx',
        });
    };
    const onRegisterError = (err) => {
        _logger('Register User Error ->', err.response);
        if (err.response?.data.errors[0].includes('unique_Email')) {
            Swal.fire({
                title: 'Email Already Exists',
                text: 'Go to login page to sign in or reset password',
                icon: 'warning',
                button: 'Close',
            });
        } else {
            Swal.fire({
                title: 'Registration Failed!',
                text: 'Check if all fields are correct',
                icon: 'error',
                button: 'Close',
            });
        }
    };

    const onRegisterSuccess = (response) => {
        _logger('Register Success ->', response);
        let newUserId = response.item;
        if (!payload.inviteTypeId) {
            Swal.fire({
                title: 'Registered New User!',
                text: 'Please confirm email before logging in',
                icon: 'success',
                button: 'close',
            }).then(nav('/confirm'));
        } else {
            userService.addUserOrgs(newUserId, inviteInfo.orgId).then(onUserOrgSuccess).catch(onUserOrgError);
            Swal.fire({
                title: 'Registered New User!',
                text: 'Please confirm email before logging in',
                icon: 'success',
                button: 'close',
            }).then(nav('/confirm'));
        }
    };

    const onUserOrgSuccess = (response) => {
        Toast.fire({
            icon: 'success',
            title: 'User added to the organization!',
        });
        _logger('UserOrg success', response);
    };

    const onUserOrgError = (error) => {
        Toast.fire({
            icon: 'error',
            title: 'There was a problem adding this user.',
        });
        _logger('UserOrg Error ->', error);
    };

    const onPasswordEyeClicked = () => {
        setShowPassword(!showPassword);
    };
    const openOtherDialog = (e) => {
        const refType = Number(e.target.value);
        if (refType === 7) {
            setDialogBox((prev) => {
                let dialogState = { ...prev };
                dialogState.showDialogBox = true;
                return dialogState;
            });
        } else {
            setDialogBox((prev) => {
                let dialogState = { ...prev };
                dialogState.showDialogBox = false;
                return dialogState;
            });
        }
        setReferenceValues((prev) => {
            let refState = { ...prev };
            refState.referenceType = refType;
            return refState;
        });
    };

    return (
        <AccountLayout bottomLinks={<BottomLink toggle={toggleLogin} isRegisterOpen={isRegisterOpen} />}>
            <>
                <h4 className="mt-0" style={{ paddingTop: '80px' }}>
                    {'Welcome to Carte'}
                </h4>
                {invite.pathname !== '/cart' ? (
                    <p className="text-muted mb-4">
                        {"Don't have an account? Create one below, it takes less than a minute."}
                    </p>
                ) : undefined}

                <Formik
                    enableReinitialize={true}
                    initialValues={payload}
                    onSubmit={onSignUp}
                    validationSchema={registerSchema}>
                    {({ values }) => (
                        <Form>
                            <div className="mb-3">
                                <label className="form-label" name="email">
                                    Email Address
                                </label>
                                <Field
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                />
                                <ErrorMessage name="email" component="div" className="has-error" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <div className="d-flex">
                                    <Field
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        type={showPassword ? 'text' : 'password'}
                                    />
                                    <div
                                        className="show-password input-group-text input-group-password"
                                        data-password={showPassword ? 'true' : 'false'}>
                                        {!showPassword ? (
                                            <BsEye onClick={onPasswordEyeClicked} />
                                        ) : (
                                            <BsEyeSlash onClick={onPasswordEyeClicked} />
                                        )}
                                    </div>
                                </div>
                                <ErrorMessage name="password" component="div" className="has-error" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <div className="d-flex">
                                    <Field
                                        name="confirmPassword"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        type={showPassword ? 'text' : 'password'}
                                    />
                                    <div
                                        className="show-password input-group-text input-group-password"
                                        data-password={showPassword ? 'true' : 'false'}>
                                        {!showPassword ? (
                                            <BsEye onClick={onPasswordEyeClicked} />
                                        ) : (
                                            <BsEyeSlash onClick={onPasswordEyeClicked} />
                                        )}
                                    </div>
                                </div>
                                <ErrorMessage name="confirmPassword" component="div" className="has-error" />
                            </div>
                            <div className="d-flex m-1">
                                <Field type="checkbox" name="isRestaurantOrg" />
                                <label className="form-check-label m-1">
                                    {values.isRestaurantOrg}Check here if you are signing up as a restaurant
                                </label>
                            </div>
                            <div className="radio-buttons mb-2">
                                <label htmlFor="referenceValues">Where did you hear about Carte</label>
                                <Row>
                                    <label>
                                        <input
                                            type="radio"
                                            name="referenceValues3"
                                            value="1"
                                            onChange={openOtherDialog}
                                        />
                                        Search Engine
                                    </label>
                                </Row>
                                <Row>
                                    <label>
                                        <input
                                            type="radio"
                                            name="referenceValues3"
                                            value="2"
                                            onChange={openOtherDialog}
                                        />
                                        Google Ads
                                    </label>
                                </Row>
                                <Row>
                                    <label>
                                        <input
                                            type="radio"
                                            name="referenceValues3"
                                            value="3"
                                            onChange={openOtherDialog}
                                        />
                                        Facebook Ads
                                    </label>
                                </Row>
                                <Row>
                                    <label>
                                        <input
                                            type="radio"
                                            name="referenceValues3"
                                            value="5"
                                            onChange={openOtherDialog}
                                        />
                                        Email
                                    </label>
                                </Row>
                                <Row>
                                    <label>
                                        <input
                                            type="radio"
                                            name="referenceValues3"
                                            value="6"
                                            onChange={openOtherDialog}
                                        />
                                        Word Of Mouth
                                    </label>
                                </Row>
                                <Row>
                                    <label>
                                        <input
                                            type="radio"
                                            name="referenceValues3"
                                            value="7"
                                            onChange={openOtherDialog}
                                        />
                                        Other
                                    </label>
                                </Row>
                                {dialogBox.showDialogBox && dialogBox.dialogBox}
                            </div>
                            <ErrorMessage name="checked" component="div" className="has-error" />
                            <div className="mb-0 d-grid text-center">
                                <Button type="submit" className="user-btn">
                                    <BiUser className="m-1" />
                                    {'Sign Up'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        </AccountLayout>
    );
};
Register.propTypes = {
    toggleLogin: PropTypes.func.isRequired,
    isRegisterOpen: PropTypes.bool.isRequired,
};

export default Register;
