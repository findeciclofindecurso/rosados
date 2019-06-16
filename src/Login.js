import React, { Component } from 'react';
import { Button, Container, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class Login extends Component {

  emptyItem = {
    username: '',
    passwd: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      user: this.emptyItem,
      isLoading: true
    }
    this.changeState = this.changeState.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.setState({ isLoading: false })
    if (localStorage.getItem('auth') === 'true' && !!localStorage.getItem('user')) {
      this.props.history.push('/users');
    }
  }

  changeState(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let user = { ...this.state.user }
    user[name] = value;
    this.setState({ user });
  }

  async handleSubmit(event) {
    event.preventDefault()
    const { user } = this.state.user
    localStorage.setItem('auth', true)
    await fetch(`/rest/admin`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then((resp) => {
        resp.map((k) => {
          console.log(k.username === this.state.user.username && k.password === this.state.user.passwd)
          console.log(k.username, this.state.user.username, k.password, this.state.user.passwd)

          if (k.username === this.state.user.username && k.password === this.state.user.passwd) {
            localStorage.setItem('auth', true)
            localStorage.setItem('user', JSON.stringify(k))
            this.props.history.push('/users');
          }
        })
      })
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div>
        <AppNavbar />
        <Container fluid>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="username">
                Usuario
              </Label>
              <Input
                onChange={this.changeState}
                value={this.state.username}
                type="text"
                name="username"
                id="username"
                placeholder="Escriba su usuaripo" />
            </FormGroup>
            <FormGroup>
              <Label for="passwd">
                Contraseña
              </Label>
              <Input
                onChange={this.changeState}
                value={this.state.passwd}
                type="password"
                name="passwd"
                id="passwd"
                placeholder="Escriba su contraseña" />
            </FormGroup>
            <Button color='primary'>Ingresar</Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default Login;