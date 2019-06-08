# Frontend con REACT

## Instalación de node JS

```bash
$ apt-get update && apt-get install nodejs
```

## Instalación global de react

Intalamos los paquetes necesarios:

```bash
$ npm install -g yarn
$ npm install -g create-react-app
```

## Creación de la aplicación React

```bash
$ yarn create react-app inventario-frontend
$ cd inventario-frontend
$ yarn add bootstrap@4.1.3 react-cookie@3.0.4 react-router-dom@4.3.1 reactstrap@6.5.0
# o bien...
$ yarn add bootstrap react-cookie react-router-dom reactstrap
```

## Lanzar la APP en modo DEBUG

```bash
$ yarn start
```

## Configurando para conectar al backend

En el fichero package.json del raíz de mi proyecto, añado:

```javascript
// debajo de los scripts, pego esta línea:
/* "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },*/
  "proxy": "http://localhost:8080",

```

## Añadiendo los componentes necesarios

### Navbar

**Fichero AppNavbar**:

```javascript
import React, { Component } from 'react';
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

export default class AppNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return <Navbar color="dark" dark expand="md">
      <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
      <NavbarToggler onClick={this.toggle}/>
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link to="/admins">Gestión de administradores</Link>
           </NavItem>
        </Nav>
      </Collapse>
    </Navbar>;
  }
}
```

### Listado/borrado

Fichero **AdminList.js**:

```javascript
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

    fetch('api/admin')
      .then(response => response.json())
      .then(data => this.setState({admins: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`/api/admin/${id}`, {
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
          <h3>Lista de usuarios</h3>
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
```


### Editar/crear

Fichero **AdminEdit.js**:

```javascript
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
      item: this.emptyItem
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const admin = await (await fetch(`/api/admin/${this.props.match.params.id}`)).json();
      this.setState({item: admin});
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    await fetch('/api/admin', {
      method: (item.username) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/admins');
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.username ? 'Edit Admin' : 'Add Admin'}</h2>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input type="text" name="username" id="username" value={item.username || ''}
                   onChange={this.handleChange} autoComplete="username"/>
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="text" name="email" id="email" value={item.email || ''}
                   onChange={this.handleChange} autoComplete="email"/>
          </FormGroup>
          <FormGroup>
            <Label for="telefono">telefono</Label>
            <Input type="number" name="telefono" id="telefono" value={item.telefono || ''}
                   onChange={this.handleChange} autoComplete="telefono"/>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="text" name="password" id="password" value={item.password || ''}
                   onChange={this.handleChange} autoComplete="password"/>
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
```

### Home

Fichero **Home.js**:

```javascript
import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

class Home extends Component {
  render() {
    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <Button color="link"><Link to="/admins">Admin Management</Link></Button>
        </Container>
      </div>
    );
  }
}

export default Home;
```

### Actualizando App.js

```javascript
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
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
