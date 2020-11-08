import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../auth/login';
import Register from '../auth/register';
import Home from '../home';
import Header from '../layout/header';
import auth from './../services/auth.service';
import toast from 'toasted-notes';
import SnippetForm from '../snippet/snippetForm';
import SnippetList from '../snippet/snippetList/index';
import TagLikes from '../reports/tagLikes';
import TagUsage from '../reports/tagUsage';


function Navigation() {

  const [isLoggedIn, setIsLoggedIn] = useState(auth.isLoggedIn());
  const [isAdmin, setIsAdmin] = useState(auth.isAdmin());

  return (
    <Router>
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        handleLogout={() => {
          setIsLoggedIn(false)
          setIsAdmin(false)
        }}
      ></Header>

      <Switch>
        <Route path="/" exact component={Home} />
        <Route
          path="/login"
          render={() => (
            <Login
              handleLogin={() => {
                setIsLoggedIn(true)
                setIsAdmin(auth.isAdmin())
              }}
              redirect={true}
            />
          )}
        />
        <Route
          path="/register"
          render={() => (
            <Register
              handleLogin={() => {
                setIsLoggedIn(true)
                toast.notify('You are now logged in', {
                  position: 'bottom-right',
                  duration: 3,
                })
              }}
              redirect={true}
            />
          )}
        />
        <Route
          path="/logout"
          onEnter={() => {
            auth.logout();
            setIsLoggedIn(false);
            setIsAdmin(false);
          }}
          render={() => (
            <Login
              handleLogin={() => {
                setIsLoggedIn(true)
                setIsAdmin(auth.isAdmin())
              }}
              redirect={true}
            />
          )}
        />
        <PrivateRoute path="/snippets/create" component={SnippetForm} />
        <PrivateRoute path="/snippets" component={SnippetList} />

        <PrivateRoute path="/reports/likes" component={TagLikes} />
        <PrivateRoute path="/reports/usage" component={TagUsage} />
        <PrivateRoute path="/reports/snippets" component={SnippetList} />

      </Switch>
    </Router>
  )
}

export default Navigation