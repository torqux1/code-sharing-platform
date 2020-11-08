import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import { Chip, Box } from '@material-ui/core';
import FavoriteIconFilled from '@material-ui/icons/Favorite';
import FavoriteIconOutlined from '@material-ui/icons/FavoriteBorderOutlined';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import PaymentsList from './codePreview';
import auth from '../../../services/auth.service';
import './styles.css';


const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[500],
  }
});


export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const { name, description, code, tags, creator } = props;

  const [countLikes, setCountLikes] = useState(props.countLikes);
  const [paymentsFormOpen, setPaymentsFormOpen] = useState(false);
  const [isLikedByUser, setisLikedByUser] = useState(props.isLikedByUser);


  function handleLikeClick() {
    if (!isLikedByUser) {
      setCountLikes(countLikes + 1);
      setisLikedByUser(true);
      props.onLike();
      return;
    }
    setCountLikes(countLikes - 1);
    setisLikedByUser(false);
    props.onDislike();
  };

  return (
    <Card className="snippetCard">
      <CardHeader className="snippetHeader"
        avatar={
          <Avatar aria-label="creator" className={classes.avatar}>
            {creator}
          </Avatar>
        }
        action={
          <IconButton aria-label="delete" disabled={!(auth.isLoggedIn() && auth.parse().isAdmin)} onClick={props.onDelete}>
            <DeleteIcon fontSize="default" disabled={true} />
          </IconButton>
        }
        title={name}
        subheader={"Created by: " + creator}
      />
      <CardContent className="snippetTags">
        {tags.map((tag) => (
          <Box key={name + tag.name} component="span" m={1}>
            <Chip
              label={tag.name}
              onClick={() => { }}
            />
          </Box>
        ))}
      </CardContent>

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p" className="snippetDescription">
          {description}
        </Typography>
      </CardContent>
      <div className="snippetButtons">
        <IconButton aria-label="add to favorites" onClick={handleLikeClick} disabled={!auth.isLoggedIn()}>
          {isLikedByUser ? <FavoriteIconFilled /> : <FavoriteIconOutlined />}
        </IconButton>
        {countLikes} likes
        <Button className="checkCodeButton" onClick={() => {
          setPaymentsFormOpen(true)
        }}
        >Check snippet code</Button>
        <PaymentsList
          open={paymentsFormOpen}
          code={code}
          handleClose={() => {
            setPaymentsFormOpen(false)
          }}
        />
      </div>
    </Card>
  );
}