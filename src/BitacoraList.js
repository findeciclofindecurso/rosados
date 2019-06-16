
import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class BitacoraList extends Component {

  constructor(props) {
    super(props);
    this.state = {bitacoras: [], isLoading: true};
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('http://localhost:8080/rest/bitacora')
      .then(response => response.json())
      .then(data => this.setState({bitacoras: data, isLoading: false}));
  }



  render() {
    const {bitacoras, isLoading} = this.state;
    if (isLoading) {
      return <p>Loading...</p>;
    }
   const bitacoraList = bitacoras.map(bitacora => {
      return <tr key={bitacora.id}>
        <td>{bitacora.id}</td>
        <td>{bitacora.fecha}</td>
        <td>{bitacora.hora}</td>
        <td>{bitacora.ip}</td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <h3>Lista de bitacoras</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Id</th>
              <th width="20%">Fecha</th>
              <th>Hora</th>
              <th>Ip</th>
            </tr>
            </thead>
            <tbody>
            {bitacoraList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default BitacoraList;

