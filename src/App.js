import React, { Component } from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminList from './AdminList';
import AdminEdit from './AdminEdit';
import UsuarioList from './UsuarioList';
import UsuarioEdit from './UsuarioEdit';


class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' exact={true} component={Home}/>
          <Route path='/admins' exact={true} component={AdminList}/>
          <Route path='/admins/:id' component={AdminEdit}/>
          <Route path='/users' exact={true} component={UsuarioList}/>
          <Route path='/users/:username' component={UsuarioEdit}/>
        </Switch>
      </Router>
    )
  }
}

export default App;
