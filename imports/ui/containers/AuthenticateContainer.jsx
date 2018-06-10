import { withTracker } from 'meteor/react-meteor-data';
import Authenticate from '../pages/Authenticate';

export default withTracker(props => {
  let user = Meteor.user();
  if (user != null) {
    props.history.replace('/chat');
  }
  return {
    user,
    history: props.history
  };
})(Authenticate);
