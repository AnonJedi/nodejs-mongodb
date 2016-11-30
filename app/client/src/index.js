const React = require('react');
const render = require('react-dom').render;
const Router = require('react-router').Router;
const Route = require('react-router').Route;
const browserHistory = require('react-router').browserHistory;
const Provider = require('react-redux').Provider;
const store = require('./store');
const App = require('./components/app');

render(
  <Provider store={store()}>
    <Router history={browserHistory}>
      <Route path="/" component={App}/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
