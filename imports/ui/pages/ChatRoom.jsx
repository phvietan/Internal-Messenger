import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { FormControl, Button } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import UploadFileModal from '../components/UploadFileModal';
import '../css/ChatRoom.css';

function getSpace(s) {
    for (let i = 0, n = s.length; i < n; ++i)
      if (s[i] == ' ') return i;
}

// document.onpaste = function(event){
//   var items = (event.clipboardData || event.originalEvent.clipboardData).items;
//   console.log(JSON.stringify(items)); // will give you the mime types
//   for (index in items) {
//     var item = items[index];
//     if (item.kind === 'file') {
//       console.log(item);
//       console.log('haha');
//     }
//   }
// }

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
  uploadFile() {
    console.log('haha');
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
                    <div style={{color:'red', fontWeight:'bold', display:'inline', float:'left'}}>{value.user}</div>
                    {value.type=='chat' &&
                      <div style={{display:'inline'}}>:&nbsp;{value.content}</div>
                    }
                    {value.type=='file' &&
                      <a href={`/cfs/files/file/${value.fileId}`}
                        download={value.content}>
                        {value.content}
                      </a>
                    }

                  </li>
                : (this.props.user.username != value.user &&
                  <li key={index}>
                    <div style={{color:'black', fontWeight:'bold', display:'inline', float:'left'}}>{value.user}</div>
                    {value.type=='chat' &&
                      <div style={{display:'inline'}}>:&nbsp;{value.content}</div>
                    }
                    {value.type=='file' &&
                      <a href={`/cfs/files/file/${value.fileId}`}
                        download={value.content}>
                        {value.content}
                      </a>
                    }
                  </li>)
                }
              </div>
            )}
          </ul>
        </div>
        <div className="type-group">
          <input type="text" onKeyDown={this.type.bind(this)} className="type-bar" id='type-bar'/>
        </div>

      </div>
    );
  }
}
