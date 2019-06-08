import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminList from './AdminList';
import AdminEdit from './AdminEdit';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/admins' exact={true} component={AdminList}/>
          <Route path='/admins/:id' component={AdminEdit}/>
        </Switch>
      </Router>
    )
  }
}

export default App;
