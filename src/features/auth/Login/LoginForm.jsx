import React, { Component } from 'react'
import { Form, Segment, Button, Label, Divider } from 'semantic-ui-react';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import { login, socialLogin } from '../authActions'
import SocialLogin from '../SocialLogin/SocialLogin'
import { withRouter } from "react-router-dom";

const actions = {
  login,
  socialLogin
}

class LoginForm extends Component {

  onFormSubmit = async values => {
    await this.props.login(values);
    this.props.history.push('/events');
  }

  render() {
    const { error, socialLogin} = this.props;
    return (
      <Form size="large" onSubmit={this.props.handleSubmit(this.onFormSubmit)} >
      <Segment>
        <Field
          name="email"
          component={TextInput}
          type="text"
          placeholder="Email Address"
        />
        <Field
          name="password" 
          component={TextInput}
          type="password"
          placeholder="password"
        />
        {error && <Label basic color='red'>{error}</Label>}
        <Button fluid size="large" color="teal" >
          Login
        </Button>
        <Divider horizontal>Or</Divider>
        <SocialLogin socialLogin={socialLogin}/>
      </Segment>
    </Form>
    )
  }
}


export default withRouter(connect(null, actions)(reduxForm({form: 'loginForm'})(LoginForm)));