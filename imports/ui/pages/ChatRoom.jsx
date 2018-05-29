import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { FormControl, Button } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import UploadFileModal from '../components/UploadFileModal';
import '../css/ChatRoom.css';

const size = 280;
const paddingName = size / 2 - 10;
const styleNameOwner = {
  color:'red',
  fontWeight:'bold',
  display:'inline',
  float:'left'
};
const styleName = {
  color:'black',
  fontWeight:'bold',
  display:'inline',
  float:'left'
};
const styleNameOwnerImage = {
  color:'red',
  fontWeight:'bold',
  display:'inline',
  float:'left',
  padding: `${paddingName}px 0`
};
const styleNameImage = {
  color:'black',
  fontWeight:'bold',
  display:'inline',
  float:'left',
  padding: `${paddingName}px 0`
};

function getSpace(s) {
    for (let i = 0, n = s.length; i < n; ++i)
      if (s[i] == ' ') return i;
}

function getBase64(file, callback) {
  let result = '';
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    callback(reader.result)
  };
}

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beginRender: true
    }
  }
  logout() {
    document.getElementById('type-bar').value = '';
    Meteor.call('chat-upload', `${this.props.user.username} has just logged out!!!`, 'SYSTEM');
    Meteor.logout();
  }
  confirm() {
    let text = document.getElementById('type-bar').value;
    if (text != '') {
      if (text == '/logout') {
        this.logout();
        return;
      }
      if (text.slice(0,5) == '/kick') {
        let n = text.length;
        text = text.slice(6, n); //get the password and username
        let space = getSpace(text); //get the index of the space between <password> <username>
        let password = text.slice(0, space);
        let username = text.slice(space+1, n);
        Meteor.call('kick-user', password, this.props.user.username, username, (err, result) => {
          alert(result);
        });
        document.getElementById('type-bar').value = '';
        return;
      }
      Meteor.call('chat-upload', text, this.props.user.username, (err) => {});
      document.getElementById('type-bar').value = '';
      let box = document.getElementById('chat-outer');
      box.scrollTop = box.scrollHeight;
    }
  }
  type(event) {
    if (event.keyCode==13)
      this.confirm();
  }
  componentDidUpdate() {
    if (!this.props.loading) {
      let box = document.getElementById('chat-outer');
      if (box.scrollTop==0 && this.state.beginRender) {
        this.setState({
          beginRender: false
        }, () => {
          box.scrollTop = box.scrollHeight;
        });
      }
      if (box.scrollHeight - 1500 <= box.scrollTop)
        box.scrollTop = box.scrollHeight;
    }
  }
  onPaste(event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (index in items) {
      var item = items[index];
      if (item.kind === 'file' && item.type.slice(0,5)=='image') {
        let blob = item.getAsFile();
        let base = getBase64(blob, (result) => {
          Meteor.call('image-upload', this.props.user.username, result);
        });
      }
    }
  }
  render() {
    let Height = window.innerHeight - 150;

    return (
      <div>
        <NavigationBar
          logout={this.logout.bind(this)}
          user={this.props.user}
        />

        <div id='chat-outer' className='chat-outer' style={{height: `${Height}px`}}>
          <ul className='chat-box'>
            {this.props.list.map((value, index) =>
              <div key={index}>
                {value.user == 'SYSTEM' ?
                  <p className="system-log">
                    SYSTEM: {value.content}
                  </p>
                : this.props.user.username == value.user ?
                  <li key={index}>
                    <div style={value.type!='image' ? styleNameOwner : styleNameOwnerImage}>
                      {value.user}:&nbsp;
                    </div>
                    {value.type=='chat' &&
                      <div style={{display:'inline'}}>{value.content}</div>
                    }
                    {value.type=='file' &&
                      <a href={`/cfs/files/file/${value.fileId}`}
                        download={value.content}>
                        {value.content}
                      </a>
                    }
                    {value.type=='image' &&
                      <img style={{width: `${size}px`, height: `${size}px`}} src={value.content}></img>}

                  </li>
                : (this.props.user.username != value.user &&
                  <li key={index}>
                    <div style={value.type!='image' ? styleName : styleNameImage}>
                      {value.user}:&nbsp;
                    </div>
                    {value.type=='chat' &&
                      <div style={{display:'inline'}}>{value.content}</div>
                    }
                    {value.type=='file' &&
                      <a href={`/cfs/files/file/${value.fileId}`}
                        download={value.content}>
                        {value.content}
                      </a>
                    }
                    {value.type=='image' &&
                      <img style={{width: `${size}px`, height: `${size}px`}} src={value.content}></img>}
                  </li>)
                }
              </div>
            )}
          </ul>
        </div>
        <div className="type-group">
          <input onPaste={this.onPaste.bind(this)} type="text" onKeyDown={this.type.bind(this)}
            className="type-bar" id='type-bar'/>
        </div>

      </div>
    );
  }
}
