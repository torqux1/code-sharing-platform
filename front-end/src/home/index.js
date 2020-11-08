import React from 'react';
import SnippetList from '../snippet/snippetList';
import auth from './../services/auth.service';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import './styles.css';


export default function Home() {
  const history = useHistory()

  function handleGettingStarted() {
    history.push('/login')
  }

  return (
    <React.Fragment>
      <SnippetList />
      {!auth.isLoggedIn() ? (
        <section id="intro" className="intro">
          <div class="col-md-6 intro-info order-md-first order-last">
            <h2>
              Code Sharing Platform <br />
            share the <span>knowledge!</span>
            </h2>
          </div>

          <Button
            variant="contained"
            color="default"
            size="large"
            onClick={handleGettingStarted}
          >
            GET STARTED NOW!
        </Button>
        </section>
      ) : (<div></div>)}
    </React.Fragment>

  )
}
