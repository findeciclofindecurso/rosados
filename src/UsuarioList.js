import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class UsuarioList extends Component {

  constructor(props) {
    super(props);
    this.state = { users: [], isLoading: true };
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const auth = localStorage.getItem('auth')
    if (auth === 'false') {
      this.setState({ isLoading: false });
      localStorage.setItem('auth', false)
      localStorage.removeItem('user')
      this.props.history.push('/login');
    } else {
      fetch('/rest/usuario')
        .then(response => response.json())
        .then(data => this.setState({ users: data, isLoading: false }));
    }
  }

  async remove(id) {
    await fetch(`/rest/usuario/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedUsers = [...this.state.users].filter(i => i.username !== id);
      this.setState({ users: updatedUsers });
    });
  }

  render() {
    const { users, isLoading } = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const user = JSON.parse(localStorage.getItem('user'))

    const usuarioList = users.map(usuario => {
      return <tr key={usuario.username}>
        <td>{usuario.username}</td>
        <td>{usuario.email}</td>
        <td>{usuario.passwd}</td>
        <td>
          {user && user.password.indexOf('ad') === 0 ?
            (
              <ButtonGroup>
                <Button size="sm" color="primary" tag={Link} to={"/users/" + usuario.username}>Edit</Button>
                <Button size="sm" color="danger" onClick={() => this.remove(usuario.username)}>Delete</Button>
                <Button size="sm" color="secondary" tag={Link} to={"/bitacora/" + usuario.username}>Bitacoras</Button>
              </ButtonGroup>
            ) :
            (
              <ButtonGroup>
                <Button size="sm" color="secondary" tag={Link} to={"/bitacora/" + usuario.username}>Bitacoras</Button>
              </ButtonGroup>
            )
          }
        </td>
      </tr>
    });
    return (
      <div>
        <AppNavbar />
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/users/new">Añadir usuario</Button>
          </div>
          <h3>Lista de usuarios</h3>
          <Table className="mt-4">
            <thead>
              <tr>
                <th width="20%">Usuario</th>
                <th width="20%">Email</th>
                <th>Passwd</th>
              </tr>
            </thead>
            <tbody>
              {usuarioList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default UsuarioList;