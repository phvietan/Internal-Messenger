import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import '../css/PictureModal.css';

export default class PictureModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: true,
      padTop: null,
      padLeft: null
    }
  }
  modalClick(event) {
    let modal = document.getElementById('modal-div');
    if (event.target == modal)
      this.props.onHidePicture();
  }
  componentDidMount(){
    document.addEventListener("keydown", ()=> {
      if(event.keyCode === 27) {
        this.props.onHidePicture();
      }
    });
  }
  componentWillReceiveProps(props) {
    let src = props.src;
    if (src != null) {
      let screenWidth = window.innerWidth;
      let screenHeight = window.innerHeight;

      var i = new Image();
      i.onload = () => {
        this.setState({
          load: false,
          padTop: (screenHeight-i.height)/2 - 10,
          padLeft: (screenWidth-i.width)/2 - 10
        });
      };
      i.src = src;
    }
  }
  render() {
    let divStyle = {
      display: this.props.showPicture ? 'block' : 'none'
    };
    let imgStyle = {
      display: this.state.load ? 'none' : 'block',
      marginTop: this.state.load ? '0px' : `${this.state.padTop}px`,
      marginLeft: this.state.load ? '0px' : `${this.state.padLeft}px`
    };
    return (
      <div id='modal-div' style={divStyle} onClick={this.modalClick.bind(this)}>
        <img src={this.props.src} style={imgStyle}></img>
      </div>
    );
  }
}
