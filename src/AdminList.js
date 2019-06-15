import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class AdminList extends Component {

  constructor(props) {
    super(props);
    this.state = {admins: [], isLoading: true};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('http://localhost:8080/rest/admin')
      .then(response => response.json())
      .then(data => this.setState({admins: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`http://localhost:8080/rest/admin/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedAdmins = [...this.state.admins].filter(i => i.username !== id);
      this.setState({admins: updatedAdmins});
    });
  }

  render() {
    const {admins, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const adminList = admins.map(admin => {
      return <tr key={admin.username}>
        <td>{admin.username}</td>
        <td>{admin.email}</td>
        <td>{admin.telefono}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/admins/" + admin.username}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(admin.username)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/admins/new">Añadir admin</Button>
          </div>
          <h3>Lista de administradores</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Usuario</th>
              <th width="20%">email</th>
              <th>teléfono</th>
            </tr>
            </thead>
            <tbody>
            {adminList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default AdminList;