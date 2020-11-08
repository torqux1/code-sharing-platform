import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Container} from "@material-ui/core";
import Tag from "./tagForm/index.js";
import { api } from "../../config/axios";
import { useHistory } from "react-router-dom";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import toast from "toasted-notes";
import { mapCodesMessages, displayMessages } from "./constants"; 
import { errCodes, generalDisplayMessages } from "../../config/constants";
import useStyles from './styles';


function SnippetCreate() {
  const history = useHistory();
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState([]);
  const [isShared, setIsShared] = useState("0");

  
  useEffect(() => {
    // TODO load for autocomplete snippets...
  }, []);

  const handleSubmit = () => {
    if(!validateSubmit()){
      return;
    }
    const formData = {
      name: title,
      description,
      code,
      tags,
      isShared: Number(isShared),
    };

    api.post(`/snippets`, formData)
      .then(({ data }) => {
        toast.notify(displayMessages.SUCC_SNIPPET_CREATE);
        handleReset();
        history.push("/snippets");
      })
      .catch((error)=>{
        if (error.response && error.response.data){
          if(error.response.data.code === errCodes.NOT_AUTHORIZED){
            toast.notify(
              generalDisplayMessages.ERR_LOGIN_NEEDED
            );
            return history.push('/logout');
          }
          if(mapCodesMessages[error.response.data.code]){
            return toast.notify(
              mapCodesMessages[error.response.data.code]
            );
          }
        }  
        toast.notify(generalDisplayMessages.ERR_INTERNAL);  
    });
  };

  const validateSubmit = () => {
    if(!title || !description || !code) {
      toast.notify(displayMessages.ERR_EMPTY_FIELDS);
      return false;
    }
    if(!(title.length >= 5 && title.length <= 25)) {
      toast.notify(displayMessages.ERR_INVALID_TITLE);
      return false;
    }
    if(!(description.length >= 10 && description.length <= 100)) {
      toast.notify(displayMessages.ERR_INVALID_DESCRIPTION);
      return false;
    }
    if(!(code.length >= 10 && description.length <= 1000)) {
      toast.notify(displayMessages.ERR_INVALID_CODE);
      return false;
    }
    const invalidTag = tags.some(tag => !(tag.length >= 1 && tag.length <= 10));
    
    if(invalidTag) {
      toast.notify(displayMessages.ERR_INVALID_TAGS);
      return false;
    }
    return true;
  };

  const handleReset = () => {
    setTitle("");
    setCode("");
    setDescription("");
    setTags([]);
    setIsShared("0");
  };

  const addTag = (tagContent) => {
    const tagsOld = tags.slice();
    tagsOld.push(tagContent);
    setTags(tagsOld);
  };

  const deleteTag = (tagIndex) => {
    const tagsOld = [...tags];
    tagsOld.splice(tagIndex, 1);
    setTags(tagsOld);
  };

  const handleChangeIsShared = (event) => {
    setIsShared(event.target.value);
  };

  return (
    <Container maxWidth="sm" className={classes.root}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Snippet title"
          name="title"
          autoComplete="title"
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Snippet description"
          name="description"
          autoComplete="description"
          autoFocus
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          multiline
          fullWidth
          label="Snippet text"
          rows={6}
          name="text"
          autoComplete="text"
          autoFocus
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />

        <Tag tags={tags} addTag={addTag} deleteTag={deleteTag} />

      <Box my={3}>
      <FormControl component="fieldset">
      <FormLabel component="legend">Publish as public snippet:</FormLabel>
      <RadioGroup aria-label="publishType" name="publishType" value={isShared} onChange={handleChangeIsShared} row>
        <FormControlLabel value="0" control={<Radio />} label="No" />
        <FormControlLabel value="1" control={<Radio />} label="Yes" />
      </RadioGroup>
    </FormControl>
    </Box>

      <Box my={3}>
          <div>
            <Button
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
      </Box>
    </Container>


  );
}

export default SnippetCreate;
