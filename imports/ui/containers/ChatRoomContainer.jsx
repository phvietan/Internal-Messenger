import { withTracker } from 'meteor/react-meteor-data';
import ChatRoom from '../pages/ChatRoom';

export default withTracker(props => {
  let user = Meteor.user();
  if (user == null) {
    props.history.replace('/');
  }
  let subscription = Meteor.subscribe('ChatDB');
  let loading = !subscription.ready();
  let listChat = Chat.find().fetch();
  return {
    user,
    list: listChat,
    loading,
    history: props.history
  };
})(ChatRoom);
