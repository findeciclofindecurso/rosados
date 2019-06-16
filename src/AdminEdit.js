import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

class AdminEdit extends Component {

  emptyItem = {
    username: '',
    email: '',
    password: '',
    telefono: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      new: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.password.indexOf('ad') === 0) {
      if (this.props.match.params.id !== 'new') {
        const admin = await (await fetch(`/rest/admin/${this.props.match.params.id}`)).json();
        this.setState({ item: admin });
      } else {
        this.setState({ new: true })
      }
    } else {
      window.history.back()
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = { ...this.state.item };
    item[name] = value;
    this.setState({ item });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { item } = this.state;

    await fetch(`/rest/admin${this.state.new ? '' : '/' + item.username}`, {
      method: (this.state.new) ? 'POST' : 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/admins');
  }

  render() {
    const { item } = this.state;
    const title = <h2>{item.username ? 'Edit Admin' : 'Add Admin'}</h2>;

    return <div>
      <AppNavbar />
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input type="text" name="username" id="username" value={item.username || ''}
              onChange={this.handleChange} autoComplete="username" />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="text" name="email" id="email" value={item.email || ''}
              onChange={this.handleChange} autoComplete="email" />
          </FormGroup>
          <FormGroup>
            <Label for="telefono">telefono</Label>
            <Input type="number" name="telefono" id="telefono" value={item.telefono || ''}
              onChange={this.handleChange} autoComplete="telefono" />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="text" name="password" id="password" value={item.password || ''}
              onChange={this.handleChange} autoComplete="password" />
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/admins">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(AdminEdit);
