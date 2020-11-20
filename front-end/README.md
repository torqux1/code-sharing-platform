# Code Sharing Platform Front-End

Simple code-sharing platform that has two types of users - members and
admins.

## Before using, please make sure that you have:
 - Node.js installed (https://nodejs.org/)
 - configure proxy settings(adjust address to back-end server) in package.json file
 - Run `npm install` or `yarn` in your root project folder

## Usage

To run the project, please use a command line the following:
 - `npm start`

 # TODOS 
 - Create tag autocomplete feature with existing tags, fetched from DB
 - Redirect after login in case logout has been done from different component
 - Snippet cards styles should be modified to appear with same size 
 - Unit testing of components using jest
 
  # Recommendations
  - In case of a need to update a state using the previous one, use setData((prevData) => {return prevdata.filter ... } ) - much safer and better
  - When passing props, use destructuring in child component like function ListItem({item, deleteHandler}){}. 
    If props are too many, do it in function body like const { count, page, rowsPerPage, onChangePage } = props;  
