import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import auth from './../services/auth.service';

const PrivateRoute = ({ component: Component, ...rest }) => {

  return (
    <Route
      {...rest}
      render={props =>
        auth.isLoggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login' }} />
        )
      }
    />
  )
}

export default PrivateRoute