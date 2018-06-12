import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import '../css/PictureModal.css';

function minimum(x, y) {
  if (x < y) return x;
  return y;
}

export default class PictureModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: true,
      padTop: null,
      padLeft: null,
      width: null,
      height: null
    }
  }
  modalClick(event) {
    let modal = document.getElementById('modal-div');
    if (event.target == modal) {
      this.setState({
        load: true
      });
      this.props.onHidePicture();
    }
  }
  componentDidMount(){
    document.addEventListener("keydown", ()=> {
      if(event.keyCode === 27 && this.state.load == false) {
        this.setState({
          load: true
        });
        this.props.onHidePicture();
      }
    });
  }
  componentWillReceiveProps(props) {
    let src = props.src;
    if (src != null) {
      let screenWidth = window.innerWidth;
      let screenHeight = window.innerHeight;

      let maxWidth = screenWidth / 3 * 2;
      let maxHeight = screenHeight / 3 * 2;

      if (props.width <= maxWidth && props.height <= maxHeight) {
        this.setState({
          load: false,
          padTop: (screenHeight-props.height)/2 - 10,
          padLeft: (screenWidth-props.width)/2 - 10,
          width: props.width,
          height: props.height
        });
        return;
      }

      let k = minimum(maxWidth / props.width, maxHeight / props.height);
      this.setState({
        load: false,
        padTop: (screenHeight-props.height * k)/2 - 10,
        padLeft: (screenWidth-props.width * k)/2 - 10,
        width: props.width * k,
        height: props.height * k
      });
    }
  }
  render() {
    let divStyle = {
      display: this.props.showPicture ? 'block' : 'none'
    };
    let imgStyle = {
      display: this.state.load ? 'none' : 'block',
      marginTop: this.state.load ? '0px' : `${this.state.padTop}px`,
      marginLeft: this.state.load ? '0px' : `${this.state.padLeft}px`,
      width: this.state.load ? '0px' : `${this.state.width}px`,
      height: this.state.load ? '0px' : `${this.state.height}px`,
      border: '2px solid rgb(66, 66, 67)'
    };
    return (
      <div id='modal-div' style={divStyle} onClick={this.modalClick.bind(this)}>
        <img src={this.props.src} style={imgStyle}></img>
      </div>
    );
  }
}
