import express, { Request, Response } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { gitHubStrategy } from './middleware/passport';
import UserModel from './database/model/user.model';
import { createPassportGitHub } from './repositories/passportGithub';
import { setupSwagger } from './swagger';
import cors from "cors";

const app = express();

// Setting views and body parser
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Passport and Session settings
app.use(
  session({ secret: 'SECRET', resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

createPassportGitHub({passport, gitHubStrategy, UserModel});

// Routes
app.use('/', require('./routes/home'));
app.use('/auth/github', require('./routes/github'));
app.use('/auth/user', require('./routes/user'));

// Logout from all Accounts
app.use('/logout', (req: Request, res: Response) => {
  req.logOut((err) => {
    if (err) return res.status(500).send('Logout Failed');
  });
  res.redirect('/');
});

setupSwagger(app);

// Server
app.listen(3000, () => {
  console.log('Listening on port 3000');
});

export default app;
