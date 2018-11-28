import React, {Component} from 'react';
import {Modal} from 'semantic-ui-react';
import {connect} from 'react-redux';

import LoginForm from '../auth/Login/LoginForm';
import {closeModal} from "./modalActions";
import { withRouter } from "react-router-dom";

const actions = {closeModal};

class LoginModal extends Component {
    handleCloseModal = () => {
        if (this.props.location.pathname.includes('/events')) {
            this.props.closeModal();
        }
        else {
        //   this.props.history.goBack();
          this.props.history.push("/events")
          this.props.closeModal();
        }
      }

    render() {
        return (
            <Modal
                size='mini'
                open={true}
                onClose={this.handleCloseModal}
            >
                <Modal.Header>
                    Login to Re-vents
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <LoginForm />
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        );
    }
}

export default withRouter(connect(null, actions)(LoginModal));