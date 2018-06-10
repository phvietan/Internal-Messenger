import React, { Component } from 'react';
import Login from './Login';
import SignUp from './SignUp';

export default class Authenticate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: 'Login'
    }
  }
  changeToSignUp() {
    this.setState({
      show: 'Sign Up'
    });
  }
  changeToLogin() {
    this.setState({
      show: 'Login'
    });
  }
  render() {
    return (
      <div>
        {this.state.show == 'Login' &&
          <Login
            changeShow={this.changeToSignUp.bind(this)}
            history={this.props.history}
          />
        }
        {this.state.show == 'Sign Up' &&
          <SignUp
            changeShow={this.changeToLogin.bind(this)}
            history={this.props.history}
          />
        }
      </div>
    );
  }
}
