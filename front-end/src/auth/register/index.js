import React, { useState } from 'react'
import { api } from "../../config/axios";
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import { mapCodesMessages, displayMessages } from "./constants";
import { generalDisplayMessages } from "../../config/constants";
import toast from "toasted-notes";

function Register(props) {
  const history = useHistory();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();


  function handleSubmit() {
    const formData = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    };

    api.post(`/register`, formData)
      .then((response) => {
        toast.notify(displayMessages.SUCC_REGISTRATION);
        history.push('/login');
      })
      .catch((error)=>{
        if (error.response && error.response.data && mapCodesMessages[error.response.data.code]) {
            return toast.notify(
                mapCodesMessages[error.response.data.code]
            );
        }
        toast.notify(generalDisplayMessages.ERR_INTERNAL);
    });
  }

  return (
    <div>
      <Container maxWidth="xs">
        <form noValidate autoComplete="off">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="first-name"
            label="First Name"
            type="text"
            autoComplete="first-name"
            onChange={(event) => setFirstName(event.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="last-name"
            label="Last Name"
            type="text"
            autoComplete="last-name"
            onChange={(event) => setLastName(event.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Register
          </Button>
        </form>
      </Container>
    </div>
  )
}

export default Register
