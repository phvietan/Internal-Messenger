import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ChatRoom from '../pages/ChatRoom';

export default withTracker(props => {
  let subscription = Meteor.subscribe('ChatDB');
  let loading = !subscription.ready();
  let listChat = Chat.find().fetch();
  return {
    user: Meteor.user(),
    list: listChat,
    loading
  };
})(ChatRoom);
