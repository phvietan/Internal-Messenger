import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NotFoundPage from '../../ui/pages/NotFoundPage';
import AuthenticateContainer from '../../ui/containers/AuthenticateContainer';
import ChatRoomContainer from '../../ui/containers/ChatRoomContainer';

Meteor.startup(() => {
  render(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={AuthenticateContainer} />
        <Route exact path='/chat' component={ChatRoomContainer} />
        <Route path="/*" component={NotFoundPage} />
      </Switch>
    </BrowserRouter>,
    document.getElementById('render-target')
  );
});
