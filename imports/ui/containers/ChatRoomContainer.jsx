import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ChatRoom from '../pages/ChatRoom';

export default withTracker(props => {
  Meteor.subscribe('ChatDB');
  let listChat = Chat.find().fetch();
  return {
    user: Meteor.user(),
    list: listChat
  };
})(ChatRoom);
