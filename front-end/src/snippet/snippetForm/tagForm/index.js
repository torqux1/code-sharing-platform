import React, { useState } from 'react'
import { TextField, Card, CardContent, Chip, Box } from '@material-ui/core'

// Maybe its good idea if properties are not many no destructure them like function Tag({deletetag})
function Tag(props) {
  const [tagContent, setTagContent] = useState('');

  function handleFormSubmit(event) {
    event.preventDefault()
    props.addTag(tagContent)
    setTagContent('')
  }

  return (
    <Card variant="outlined">
      <CardContent>
        {props.tags.map((answer, index) => (
          <Box key={index} component="span" m={1}>
            <Chip
              label={answer}
              onDelete={() => {
                props.deleteTag(index)
              }}
            />
          </Box>
        ))}
      </CardContent>
      <CardContent>
        <form onSubmit={handleFormSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Add New Tag"
            name="answer"
            autoComplete="answer"
            autoFocus
            value={tagContent}
            onChange={(event) => setTagContent(event.target.value)}
          />
        </form>
      </CardContent>
    </Card>
  )
}

export default Tag
