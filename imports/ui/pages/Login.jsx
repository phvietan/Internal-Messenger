import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { FormControl, Button } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import '../css/StartUp.css';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  login() {
    Meteor.loginWithPassword(this.state.username, this.state.password, (err) => {
      if (err) {
        alert(err);
        return;
      }
      Meteor.call('chat-upload', `${this.state.username} has just logged in!!!`, 'SYSTEM');
    });
  }

  changeUsername(event) {
    if (event.keyCode==13) {
      this.login();
      return;
    }
    this.setState({
      username: event.target.value
    });
  }

  changePassword(event) {
    if (event.keyCode==13) {
      this.login();
      return;
    }
    this.setState({
      password: event.target.value
    });
  }

  render() {
    return (
      <div>
        
        {/*<NavigationBar/>*/}
        <div className="group">
          <h1>Login</h1>
          <div className="form">
              <span>Username</span>
              <FormControl type="text" onKeyUp={this.changeUsername.bind(this)} />
          </div>
          <div className="form">
              <span>Password</span>
              <FormControl type="password" onKeyUp={this.changePassword.bind(this)} />
          </div>

          <Button className="button button1" onClick={this.login.bind(this)}>{"Go <3"}</Button>
          <Button className="button2 button3" onClick={this.props.changeShow}>{"I want to sign up"}</Button>

        </div>
      </div>
    );
  }
}
