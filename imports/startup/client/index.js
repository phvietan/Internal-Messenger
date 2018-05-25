import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import NotFoundPage from '../../ui/pages/NotFoundPage';
import PageContainer from '../../ui/containers/PageContainer';

Meteor.startup(() => {
  render(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={PageContainer} />
        <Route path="/*" component={NotFoundPage} />
      </Switch>
    </BrowserRouter>,
    document.getElementById('render-target')
  );
});
