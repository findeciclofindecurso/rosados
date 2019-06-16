import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, Button, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class AppNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logOut = () => {
    localStorage.setItem('auth', false)
    localStorage.removeItem('user')
    this.props.history.push('/login');
  }

  render() {
    return (
      <Navbar color="dark" dark expand="md">
        <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {localStorage.getItem('auth') !== 'true' ?
              (<NavItem>
                <Link to="/login">Login</Link>
              </NavItem>) :
              (<NavItem style={{ color: 'white' }}>
                Hola {JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).username : 'usuario'}
                <Button color='primary' onClick={() => this.logOut()}>Salir</Button>
              </NavItem>)
            }
            <NavItem >
              <Link to="/users">Usuarios</Link>
            </NavItem>
            <NavItem>
              <Link to="/admins">Administradores</Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    )
  }
}
