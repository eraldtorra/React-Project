import { Link, NavLink, Redirect } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { useEffect, useState } from "react";
import '../../Css/navbar.css';

export const Navbar = () => {

  const { oktaAuth, authState } = useOktaAuth();
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    if (authState?.isAuthenticated) {
      setJustLoggedIn(true);
      setTimeout(() => {
        setJustLoggedIn(false);
      }, 5000);
    }
  }, [authState?.isAuthenticated]);

  if (!authState) {
    return <SpinnerLoading />
  }

  const handleLogout = async () => oktaAuth.signOut();

  console.log(authState);





  return (
    <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
      <div className='container-fluid'>
        <span  className='navbar-brand'> Library</span>
        <button className='navbar-toggler' type='button'
          data-bs-toggle='collapse' data-bs-target='#navbarNavDropdown'
          aria-controls='navbarNavDropdown' aria-expanded='false'
          aria-label='Toggle Navigation' >

          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNavDropdown'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/home'>Home</NavLink>
            </li>

            <li className='nav-item'>
              <NavLink className='nav-link' to='/search'>Search Books</NavLink>
            </li>
            {authState.isAuthenticated &&
              <li className="nav-item">
                <NavLink className='nav-link' to='/shelf'>Shelf</NavLink>
              </li>
            }

            <li className="nav-item">
              <NavLink className='nav-link' to='/forum'>Forum</NavLink>
            </li>
            {authState.isAuthenticated &&
              <li className="nav-item">
                <NavLink className='nav-link' to='/fees'>Pay fees</NavLink>
              </li>
            }

            {authState.isAuthenticated && authState.accessToken?.claims?.userType === 'admin' &&
              <li className="nav-item">
                <NavLink className='nav-link' to='/admin'>Admin</NavLink>
              </li>
            }
          </ul>

          <p className="navbar-nav ms-auto">
            {/* Other navbar content */}
            {justLoggedIn && (
              <div className="welcome-message">Welcome back {authState.idToken?.claims.name}</div>
            )}
          </p>


          <ul className="navbar-nav ms-auto">
            {/* Other nav items... */}
            {authState.isAuthenticated && (
              <li className="nav-item">
                <a className="nav-link" href="https://dev-61036179.okta.com/app/UserHome" target="_blank" rel="noopener noreferrer">
                  Dashboard
                </a>
              </li>
            )}
            {/* Other nav items... */}
          



        
            {!authState.isAuthenticated ?
              <li className='nav-item mt-1'>
                <Link type='button' className='btn btn-outline-light' to='/login'>Sign In</Link>
              </li>
              :
              <li>
                <button className='btn btn-outline-light' onClick={handleLogout}>Logout</button>
              </li>
            }


          </ul>

        </div>

      </div>

    </nav>
  );
}

