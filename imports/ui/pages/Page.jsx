import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import ChatRoomContainer from '../containers/ChatRoomContainer';
import NavigationBar from '../components/NavigationBar';

export default class Page extends Component {
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
        {this.state.show == 'Login' && this.props.user == null &&
          <Login changeShow={this.changeToSignUp.bind(this)}/>
        }
        {this.state.show == 'Sign Up' && this.props.user==null &&
          <SignUp changeShow={this.changeToLogin.bind(this)}/>
        }
        {this.props.user!=null &&
          <ChatRoomContainer/>
        }
      </div>
    );
  }
}
