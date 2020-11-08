# Code Sharing Platform Back-End

Simple code-sharing platform that has two types of users - members and
admins.

## Before using, please make sure that you have:
 - Node.js installed (https://nodejs.org/)
 - MongoDB installed and running locally (https://www.mongodb.com/)
   - Using Windows, just open the terminal at where you installed mongo and run `mongod.exe`
- Configure node server and jwt params in **/common/config/env.config.js**
- Configure mongoose connection in **/common/services/mongoose-starter.js** 
- Run `npm install` or `yarn` in your root project folder

## Usage

To run the project, please use a command line the following:
 - `npm start`
 - You can find Postman collection in **/test** directory.

 # TODOS 
 - Unit testing using jest