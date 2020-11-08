import React, { useEffect, useState } from 'react'
import SnippetCard from './snippetCard'
import { api } from '../../config/axios'
import toast from 'toasted-notes'
import 'toasted-notes/src/styles.css'
import Alert from '@material-ui/lab/Alert'
import { Link, Grid } from '@material-ui/core'
import auth from '../../services/auth.service'
import Button from '@material-ui/core/Button';
import useStyles from './styles';
import { mapCodesMessages, displayMessages } from "./constants";
import { errCodes, generalDisplayMessages } from "../../config/constants";
import { useHistory } from "react-router-dom";

export default function SnippetList() {
  const initialValues = { snippets: [], totalSnippets: 0, snippetFetchDone: false, page: 0 };

  const history = useHistory();
  const [snippets, setSnippets] = useState(initialValues.snippets);
  const [totalSnippets, setTotalSnippets] = useState(initialValues.totalSnippets);
  const [snippetFetchDone, setSnippetFetchDone] = useState(initialValues.setSnippetFetchDone);
  const [page, setPage] = useState(initialValues.page);

  const classes = useStyles();
  const snippetsPerLoad = 3;

  useEffect(() => {
    setSnippetFetchDone(true);
  }, [snippets]);

  useEffect(() => {
    loadSnippets();
  }, []);

  function hasMoreSnippets() {
    return snippets.length < totalSnippets;
  }

  function deleteSnippet(snippetIndex) {
    const snippetId = snippets[snippetIndex]._id;

    api.delete(`/snippets/${snippetId}`)
      .then((result) => {
        toast.notify(displayMessages.SUCC_SNIPPET_DELETE);
        loadSnippets(true);
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.code === errCodes.NOT_AUTHORIZED) {
          toast.notify(
            generalDisplayMessages.ERR_LOGIN_NEEDED
          );
          return history.push('/logout');
        }
        toast.notify(generalDisplayMessages.ERR_INTERNAL);
      });
  };

  function likeSnippet(snippetIndex) {
    const snippetId = snippets[snippetIndex]._id;

    api.patch(`/snippets/${snippetId}`, { action: 'like' })
      .then((result) => {
        console.log(result);
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.code === errCodes.NOT_AUTHORIZED) {
          toast.notify(
            generalDisplayMessages.ERR_LOGIN_NEEDED
          );
          return history.push('/logout');
        }
        toast.notify(generalDisplayMessages.ERR_INTERNAL);
      });
  };

  function dislikeSnippet(snippetIndex) {
    const snippetId = snippets[snippetIndex]._id;
    api.patch(`/snippets/${snippetId}`, { action: 'dislike' })
      .then((result) => {
        console.log(result);
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.code === errCodes.NOT_AUTHORIZED) {
          toast.notify(
            generalDisplayMessages.ERR_LOGIN_NEEDED
          );
          return history.push('/logout');
        }
        toast.notify(generalDisplayMessages.ERR_INTERNAL);
      });
  };

  function loadSnippets(useInitialValues) {
    setSnippetFetchDone(false);
    let loadPage = page, snippetAcc = [...snippets];

    if (useInitialValues) {
      loadPage = initialValues.page;
      snippetAcc = initialValues.snippets;
    }
    let query = `/snippets/?page=${loadPage}&limit=${snippetsPerLoad}&relations[]=tags&relations[]=creator`;
    setPage(loadPage + 1);

    api.get(query)
      .then((fetchedSnippets) => {
        const total = fetchedSnippets.data.total;
        setTotalSnippets(total);

        setSnippets(snippetAcc.concat(fetchedSnippets.data.data));
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          if (error.response.data.code === errCodes.NOT_AUTHORIZED) {
            toast.notify(
              generalDisplayMessages.ERR_LOGIN_NEEDED
            );
            return history.push('/logout');
          }
          if (mapCodesMessages[error.response.data.code]) {
            return toast.notify(
              mapCodesMessages[error.response.data.code]
            );
          }
        }
        toast.notify(generalDisplayMessages.ERR_INTERNAL);
      });
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item md={2} sm={false}></Grid>
        <Grid item md={8} sm={12}>
          {snippets.length ? (
            snippets.map((snippet, index) => (
              <SnippetCard
                key={snippet._id}
                name={snippet.name}
                description={snippet.description}
                code={snippet.code}
                countLikes={snippet.likedBy.length}
                tags={snippet.tags}
                creator={snippet.creator.firstName}
                isLikedByUser={auth.isLoggedIn() && snippet.likedBy.includes(auth.parse().userId)}
                onDelete={() => { deleteSnippet(index) }}
                onLike={() => { likeSnippet(index) }}
                onDislike={() => { dislikeSnippet(index) }}
              />
            ))
          ) : (snippetFetchDone && totalSnippets === 0 && auth.isLoggedIn() ?
            (<Alert severity="info">
              There are currently no snippets available. Click&nbsp;
              <Link href="/snippets/create">here</Link> to create one.
            </Alert>)
            : (
              <div></div>
            ))}

        </Grid>
        <Grid item md={2} sm={false}></Grid>
      </Grid>
      {snippetFetchDone ?
        (<Button ml="10" variant="contained" onClick={() => loadSnippets()} disabled={!hasMoreSnippets()} className={classes.loadMoreButton}>
          {hasMoreSnippets() ? 'Load more snippets' : (totalSnippets === 0 ? 'No snippets available' : 'No more snippets available')}</Button>)
        : (
          <div></div>
        )}
    </React.Fragment>
  )
}

