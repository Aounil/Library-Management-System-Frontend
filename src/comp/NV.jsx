import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import { useNavigate } from "react-router-dom";

function NV() {
  const navigate = useNavigate();
  const { name, setName } = useContext(UserContext);

  const logout = () => {
    localStorage.removeItem("authToken");
    setName(null);
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">FAST-BOOK⚡</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/books">Books</Nav.Link>
            <Nav.Link href='/Favorite'>Fav</Nav.Link>
          </Nav>
          <Navbar.Text>
            Signed in as: <a href="#login">{name ? name : "Guest"}</a>
          </Navbar.Text>
          <Nav>
            <Nav.Link>
              <button onClick={logout} className="btn btn-danger mx-5">
                Log out
              </button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NV;
