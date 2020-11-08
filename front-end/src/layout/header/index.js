import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Link, useHistory } from 'react-router-dom';
import { useStyles } from './styles';
import auth from './../../services/auth.service';

function Header(props) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <Link to="/">
          <Button className={classes.navLink}>Home</Button>
        </Link>
        {props.isLoggedIn ? (
          <React.Fragment>
            <Link to="/snippets/create">
              <Button className={classes.navLink}>Create snippet</Button>
            </Link>
            {props.isAdmin ? (
              <React.Fragment>
                <Link to="/reports/likes">
                  <Button className={classes.navLink}>View tags like report</Button>
                </Link>
                <Link to="/reports/usage">
                  <Button className={classes.navLink}>View tags usage report</Button>
                </Link>
              </React.Fragment>
            ) : (<div></div>)}
            <div className={classes.right}>
              <Link to="#">
                <Button
                  className={classes.navLink}
                  onClick={() => {
                    auth.logout();
                    props.handleLogout();
                    history.push('/login');
                  }}
                >
                  Logout
                </Button>
              </Link>
            </div>
          </React.Fragment>
        ) : (
            <div className={classes.right}>
              <Link to="/login">
                <Button className={classes.navLink}>Login</Button>
              </Link>
              <Link to="/register">
                <Button className={classes.navLink}>Register</Button>
              </Link>
            </div>
          )}
      </Toolbar>
    </AppBar>
  )
}

export default Header