import React, { Component } from 'react';
import NavigationBar from '../components/NavigationBar';
import UploadFileModal from '../components/UploadFileModal';
import PictureModal from '../components/PictureModal';
import HelpModal from '../components/HelpModal';
import '../css/ChatRoom.css';

const size = 400;

function getSpace(s) {
    for (let i = 0, n = s.length; i < n; ++i)
      if (s[i] == ' ') return i;
}

function minimum(x, y) {
  if (x < y) return x;
  return y;
}

function getSize(size, x, y) {
  if (size >= x && size >= y) return x;
  let k = minimum(size / x, size / y);
  return x * k;
}

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beginRender: true,  //Render list chat
      showPicture: false, //Modal Show Picture
      imgSrc: null,       //Image source for modal Show picture
      imgWidth: null,
      imgHeight: null,
      isClickImage: false,
      showUpload: false,  //Modal show upload
      showHelp: false     //Modal show help
    }
  }
  logout() {
    if (this.props.user != null) {
      document.getElementById('type-bar').value = '';
      Meteor.call('chat-upload', `${this.props.user.username} has just logged out!!!`, 'SYSTEM');
      Meteor.logout(() => {
      });
    }
    this.props.history.replace('/');

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
    if (!this.props.loading && this.state.isClickImage == false) {
      let box = document.getElementById('chat-outer');
      if (box.scrollTop==0 && this.state.beginRender) {
        this.setState({
          beginRender: false
        }, () => {
          box.scrollTop = box.scrollHeight;
        });
      }
      if (box.scrollHeight - 1000 <= box.scrollTop)
        box.scrollTop = box.scrollHeight;
    }
  }
  onPaste(event) {
    let items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let user = this.props.user;
    for (index in items) {
      var item = items[index];
      if (item.kind === 'file' && item.type.slice(0,5)=='image') {
        let file = item.getAsFile();
        FileS.insert(file, function(err, fileObj) {
          let id = fileObj._id;
          //This code is pasted online
          //It will catch the event when the file is fully uploaded onto server
          var cursor = FileS.find(id);
          var liveQuery = cursor.observe({
            changed: function(newFile) {
              if (newFile.isUploaded()) {
                liveQuery.stop();
                // After file fully uploaded on server, update the documents of mongodb
                var img = new Image;
                img.onload = function() {
                  Meteor.call('file-upload', user.username, id, 'From Clipboard', 'image', img.width, img.height);
                };
                img.src = `/cfs/files/file/${id}`;
              }
            }
          });
        });
      }
    }
  }
  imageClick(index) {
    let imageId = `${index}image`;
    let image = document.getElementById(imageId);
    let n = image.src.length;
    let fileId = image.src.slice(37, n);
    let mess = Chat.findOne({fileId: fileId});
    this.setState({
      imgSrc: image.src,
      showPicture: true,
      imgWidth: mess.width,
      imgHeight: mess.height,
      isClickImage: true
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
    this.state.isClickImage = false;
    let Height = window.innerHeight - 150;
    return (
      <div>
        {/*Modal*/}
        <PictureModal
          showPicture={this.state.showPicture}
          onHidePicture={this.hidePicture.bind(this)}
          src={this.state.imgSrc}
          width={this.state.imgWidth}
          height={this.state.imgHeight}
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

      {this.props.user != null &&
        <div>
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
                  :
                    <li key={index}>
                      <div style={{
                          color: value.user == this.props.user.username ? 'red' : 'black',
                          fontWeight:'bold',
                          display:'inline',
                          float:'left',
                          paddingTop: value.type=='image' ? `${getSize(size,value.height,value.width)/2 - 15}px` : '0px'
                        }}>
                        {value.user}:&nbsp;
                      </div>
                      {value.type=='chat' &&
                        <div style={{display:'inline'}}>
                          {value.content}
                        </div>
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
                          style={
                            {width: `${getSize(size,value.width,value.height)}px`,
                            height: `${getSize(size,value.height,value.width)}px`,
                            cursor: 'pointer',
                            borderRadius: '40px'}
                          }
                          src={`/cfs/files/file/${value.fileId}`}>
                        </img>
                      }
                    </li>
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
      }
      </div>
    );
  }
}
