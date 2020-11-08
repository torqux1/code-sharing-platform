import React, { useEffect, useState, useRef } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '../pagination';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import { api } from './../../config/axios';
import { Chip } from '@material-ui/core';
import { useStyles } from './styles';
import toast from "toasted-notes";
import { errCodes, generalDisplayMessages } from "../../config/constants";
import { useHistory } from "react-router-dom";


function createRowsData(fetchedTags) {
  let currMaxHeight = 70;
  let currMaxFontSize = 20;
  let previousCount;

  const tagRows = fetchedTags.data.data.map(tag => {
    if (previousCount && previousCount !== tag.countLikesInSnippets) {
      previousCount = tag.countLikesInSnippets;
      currMaxHeight -= 6;
      currMaxFontSize -= 0.5;

      return { id: tag._id, name: `${tag.name}(${tag.countUsedInSnippets})`, height: currMaxHeight, size: currMaxFontSize };
    }
    previousCount = tag.countLikesInSnippets;

    return { id: tag._id, name: `${tag.name}(${tag.countUsedInSnippets})`, height: currMaxHeight, size: currMaxFontSize };
  });

  return tagRows;
};


export default function CustomPaginationActionsTable() {
  const history = useHistory();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [tagsFetchDone, setTagsFetchDone] = useState(false);
  const [totalTags, setTotalTags] = useState(0);
  const isMounted = useRef();

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  useEffect(() => {
    loadTags(page, rowsPerPage);
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    setTagsFetchDone(true);
  }, [rows]);


  function loadTags(newPage, fetchLimit) {
    setTagsFetchDone(false);

    return api.get(`/tags?page=${newPage}&limit=${fetchLimit}&sort=countUsedInSnippets`)
      .then((fetchedTags) => {
        const total = fetchedTags.data.total;

        setTotalTags(total);

        if (total === 0) {
          return Promise.resolve();
        }
        const tags = createRowsData(fetchedTags);

        if (fetchLimit !== rowsPerPage) {
          return setRows(tags);
        }
        setRows(rows.concat(tags));
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


  const handleChangePage = (event, newPage) => {
    if (newPage > page && newPage > Math.ceil(rows.length / rowsPerPage) - 1) {
      return loadTags(newPage, rowsPerPage)
        .then(res => {
          setPage(newPage);
        })
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newPage = 0;
    const newRowsPerPage = parseInt(event.target.value, 10);

    loadTags(newPage, newRowsPerPage)
      .then(res => {
        setPage(newPage);
        setRowsPerPage(newRowsPerPage);
      });
  };

  return (
    <Table className={classes.table} aria-label="custom pagination table" align="center" small="medium">
      <TableHead>
        <TableRow>
          <TableCell align="center">Tag</TableCell>
        </TableRow>
      </TableHead>

      {tagsFetchDone ?
        (
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow key={row.id}>
                    <TableCell align="center" component="th" scope="row">
                      <Chip clickable={true} style={{ height: row.height, fontSize: row.size }}
                        label={row.name}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>)
        : (<TableCell></TableCell>)}

      <TableFooter>
        <TableRow>
          <TablePagination align="center"
            rowsPerPageOptions={[3, 5, 10]}
            colSpan={3}
            count={totalTags}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: { 'aria-label': 'rows per page' },
              native: true,
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
}