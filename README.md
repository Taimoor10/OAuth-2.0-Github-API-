# challenge
Code Challenge

## Feedback
   I enjoyed doing this coding challenge, It was well constructed and it allowed to explore some new stuff as well.
   I did the challenge to the best of my knowledge, however there are several areas where things can be further improved
   and optimized.

   There are things like input validation and password strength check etc, but due to shortage of time, I wasn't able to perform that. I believe that it will give you idea of my approach for the demonstration purpose

## App Registration

   Create Github apps to obtain id and secrets for passport authentication here:

   Github: `https://github.com/settings/developers`

## .env File
   Copy and Paste the Application ids and secrets in the respective fields. Update the .env file in root folder and replace with this information after populating.
   
   ```s

   JWT_SECRET="d4820f6a3f134a05c53a851d4d073f182146d03c9aed4760b1eb90d55baa379fef68ce7c9f2c1748731e9ecdb8f2736be094f1575c4d5d08e1154a5b87c237f0"
   GITHUB_APP_NAME = "<registered_app>"
   GITHUB_APP_ID = "<registered_app_id>"
   GITHUB_APP_SECRET = "<registered_app_secret>"
   GITHUB_CALLBACK_URL = "/auth/github/callback"

   ```

## Database Structure
  
   The database uses 3 tables named as users, custom_users and favorites

   - users table store the information related to github authorization

   - custom_users store the information for custom authentication

   - favorites table store the information related to user's favorite repositories

   Note: There is a relation of id between users and favorites table, which is the Github Id of user, I thought of combining
         the user and custom_users table for combined authentication. But for simplicity and quick setup, I made 2 separate respective tables

## Library and Frameworks
   
   Libraries:
   -  Passport library for oauth authorization, authentication and session management
   -  Express to create RESTapi
   -  Jest for testing

   Database: This was implemented using local database, So make sure that you have MySQL service installed and it is running
             
    You can install it using ```brew install mysql``` if you are using mac

   -  MySQL database
   -  Sequelize ORM to interact with database
   -  Sequelize-cli to create database migrations
   -  In memory SQLite DB for testing

   Documentation:
   -  Swagger documentation served at ``` http://localhost:3000/api-docs/ ```

## Starting Instructions

1. Clone the repository and type `npm install` to install dependencies

2. Since this project uses MySQL, make sure that its installed in the system and service is running. Alternatively type
   
   ```shell
   
   brew install mysql
   
   ```

3. Open the terminal and type `node app.ts` or `nodemon app.ts` to run the application


## Authorization flow, Thought Process and Solution

1. Go to `http://localhost:3000` to navigate to github authorization setup
   
2. On home page, Click on github button to authorize if you are not already authorized
    
   This view is an alternate to swagger connect route, which is not working correctly, so you can use this view to authorize
   with github. After authorization, you will be redirected to a profile view which contains some information related to your
   github account. You can also unlink account or logout. Once you unlink and login again, you will need to link the account
   again to view your information. 
   
   Note: In order to perform authorization from the fresh, revoke all user tokens from your registered application in github

   Note: use the github Id shown in profile to use "add favorite repository" route

   Note: After successful authorization with github, you can then use swagger for other routes

## Swagger usage with API

- Swagger is served at ``` http://localhost:3000/api-docs/ ``` . Except for connecting with Github, you can use swagger for
  all other routes.

  Note: After login, copy the returned token and put that in Authorize tab as bearer token on top right corner of swagger UI.
        I understand that it is a bit of hassle that you have to copy the token frequently for other requests but I could not
        find a solution to inject token directly in headers in swagger. I researched about it, but that involved using custom plugins and other complex procedures. I take this into consideration but I did not have enough time to do it.

- For Search queries, read the route description to perform search accordingly, I tried using search API of github, but that 
  did not work for different types of parameters. I have never done this before. Maybe there is another way but in the meanwhile, I ended up using different api URLs based on provided parameters. This process can definitely be improved and further optimized and I take this into consideration. Also, I was able to perform search based on the mentioned criteria in the task description. The queries could have been more extensive but I believe that it will give you an understanding of my approach.

## Testing

- Run unit tests by simply running ``` npm test ``` 

   

