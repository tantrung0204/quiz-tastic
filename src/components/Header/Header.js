import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = () => {

    const navigate = useNavigate();

    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const account = useSelector(state => state.user.account);

    const handleLogin = () => {
        navigate('/login');
    }

    const handleRegister = () => {
        navigate('/register');
    }

    return (
        <Navbar expand="lg" bg='light' className="bg-body-tertiary">
            <Container>
                {/* <Navbar.Brand href="/">NewVerse</Navbar.Brand> */}
                <NavLink to={"/"} className="navbar-brand">JunNguyen</NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink to={"/"} className="nav-link">Home</NavLink>
                        <NavLink to={"/users"} className="nav-link">Users</NavLink>
                        <NavLink to={"/admins"} className="nav-link">Admin</NavLink>
                        {/* <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/users">Users</Nav.Link>
                        <Nav.Link href="/admins">Admin</Nav.Link> */}
                    </Nav>

                    <Nav>
                        {isAuthenticated === false ?
                            <>
                                <button
                                    className='btn-login'
                                    onClick={() => handleLogin()}>Log in</button>
                                <button
                                    className='btn-signup'
                                    onClick={() => handleRegister()}>Sign up</button>
                            </>
                            :
                            <NavDropdown title="Setting" id="basic-nav-dropdown">
                                <NavDropdown.Item>Log out</NavDropdown.Item>
                                <NavDropdown.Item>Profile</NavDropdown.Item>
                            </NavDropdown>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;