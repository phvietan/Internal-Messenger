import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Page from '../pages/Page';

export default withTracker(props => {
  return {
    user: Meteor.user()
  };
})(Page);
