  import dotenv from "dotenv";
  dotenv.config();

  import { Request } from 'express';
  import { PassportStatic } from 'passport';

  type GitHubProfile = {
    id: string;
    displayName: string;
    emails: Array<{ value: string }>;
  }

  type Users = {
    save(callback: (err: Error) => void): unknown;
    id: string;
    token: string;
    displayName: string;
    email: string;
  }

  export interface PassportGitHubConfig {
    passport: PassportStatic;
    gitHubStrategy: any;
    UserModel: any; 
  }

  export const createPassportGitHub = ({ passport, gitHubStrategy, UserModel }: PassportGitHubConfig) => {
    const initGitHubStrategy = () => {
      return passport.use(
        'github',
        new gitHubStrategy(
          {
            clientID: process.env.GITHUB_APP_ID,
            clientSecret: process.env.GITHUB_APP_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'email', 'gender'],
          },
          (req: Request, token: string, refreshToken: string, profile: GitHubProfile, done: (error: any, user?: Users) => void) => {
            process.nextTick(async () => {
                // If the user has not logged in yet from GitHub
                UserModel.findOne({ where: { id: profile.id } })
                  .then((user: Users) => {
                    if (user) {
                      // For an existing user
                      if(!user.token)
                      {
                        user.token = token;
                        user.save((err) => {
                          if(err)
                            done(err, user);
                        });
                      }
                      done(null, user);
                    } else {
                      // Create a new user
                      UserModel.create({
                        id: profile.id,
                        token,
                        email: profile.emails[0].value,
                        displayName: profile.displayName,
                      })
                      .then((newUser: Users) => {
                        done(null, newUser);
                      })
                      .catch((err: any) => {
                        done(err);
                      });
                    }
                })
              })
            })
        )};

    const initSerializeUser = () => {
      passport.serializeUser((user, done) => {
        if (user) {
          const typedUser = user as Users;
          done(null, typedUser.id);
        } else {
          done(new Error('User not found'), null);
        }
      });
    };

    const initDeserializeUser = () => {
      passport.deserializeUser((id, done) => {
        UserModel.findOne({ where: { id } })
          .then((user: Users) => {
            done(null, user);
          })
          .catch((err: any) => {
            done(err);
          });
      });
    };

    initGitHubStrategy();
    initSerializeUser();
    initDeserializeUser();

    return passport;
  };
