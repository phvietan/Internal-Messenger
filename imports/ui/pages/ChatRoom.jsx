import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { FormControl, Button } from 'react-bootstrap';
import NavigationBar from '../components/NavigationBar';
import UploadFileModal from '../components/UploadFileModal';
import PictureModal from '../components/PictureModal';
import HelpModal from '../components/HelpModal';
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
      beginRender: true,  //Render list chat
      showPicture: false, //Modal Show Picture
      imgSrc: null,       //Image source for modal Show picture
      showUpload: false,  //Modal show upload
      showHelp: false     //Modal show help
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
      if (text == '/logout') this.logout();
      else if (text.slice(0,5) == '/kick') {
        let n = text.length;
        text = text.slice(6, n); //get the password and username
        let space = getSpace(text); //get the index of the space between <password> <username>
        let password = text.slice(0, space);
        let username = text.slice(space+1, n);
        Meteor.call('kick-user', password, this.props.user.username, username, (err, result) => {
          alert(result);
        });
        document.getElementById('type-bar').value = '';
      }
      else if (text.slice(0,7) == '/upload') {
        this.showUpload();
      }
      else if (text.slice(0,5) == '/help') {
        this.showHelp();
      }
      else {
        Meteor.call('chat-upload', text, this.props.user.username, (err) => {});
        document.getElementById('type-bar').value = '';
        let box = document.getElementById('chat-outer');
        box.scrollTop = box.scrollHeight;
      }
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
  imageClick(index) {
    let imageId = `${index}image`;
    let image = document.getElementById(imageId);

    this.setState({
      imgSrc: image.src,
      showPicture: true
    });
  }
  hidePicture() {
    this.setState({
      imgSrc: null,
      showPicture: false
    });
  }
  hideUpload() {this.setState({ showUpload: false });}
  showUpload() {this.setState({ showUpload: true });}
  hideHelp() {this.setState({ showHelp: false });}
  showHelp() {this.setState({ showHelp: true });}

  render() {
    let Height = window.innerHeight - 150;
    return (
      <div>
        {/*Modal*/}
        <PictureModal
          showPicture={this.state.showPicture}
          onHidePicture={this.hidePicture.bind(this)}
          src={this.state.imgSrc}
        />
        <HelpModal
          showHelp={this.state.showHelp}
          onHideHelp={this.hideHelp.bind(this)}
        />
        <UploadFileModal
          showUpload={this.state.showUpload}
          onHideUpload={this.hideUpload.bind(this)}
          user={this.props.user}
        />
        {/*Modal*/}
        <NavigationBar
          logout={this.logout.bind(this)}
          user={this.props.user}
          showHelp={this.showHelp.bind(this)}
          showUpload={this.showUpload.bind(this)}
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
                      <img
                        id={`${index}image`}
                        onClick={this.imageClick.bind(this, index)}
                        style={{width: `${size}px`, height: `${size}px`, cursor: 'pointer'}}
                        src={value.content}>
                      </img>
                    }
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
                      <img
                        id={`${index}image`}
                        onClick={this.imageClick.bind(this, index)}
                        style={{width: `${size}px`, height: `${size}px`, cursor: 'pointer'}}
                        src={value.content}>
                      </img>
                    }
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
