import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import axios from "axios";
import toast from "toasted-notes";
import { mapCodesMessages, displayMessages } from "./constants";
import { generalDisplayMessages } from "../../config/constants";
import { useHistory } from "react-router-dom";
import auth from "./../../services/auth.service";

function Login(props) {
    const history = useHistory();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    function handleSubmit() {
        const formData = {
            email: email,
            password: password,
        };

        axios({ method: "post", url: "/login", data: formData })
            .then(function (response) {
                auth.login(response.data);
                props.handleLogin();
                toast.notify(displayMessages.SUCC_LOGIN);
                history.push("/");
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
                        id="email"
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
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                    >Login
                    </Button>
                </form>
            </Container>
        </div>
    );
}

export default Login;
