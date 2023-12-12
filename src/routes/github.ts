import { Request, Response, response } from "express";
const router = require("express").Router();
import { passport } from "../middleware/passport";
import axios from "axios";
import FavoritesModel from "../database/model/favorites.model";
import { addFavoriteRepository, removeFavoriteRepository } from "../repositories/github";
import authenticate from "../middleware/authenticate";
module.exports = router;

type User = {
  save(callback: (err: Error) => void): unknown;
  id: string;
  token: string | null;
  password: string;
  email: string;
};

/**
 * Github Authorization
*/
router.get(
  "/",
  passport.authenticate("github", {
    scope: ["user", "user:email"],
  })
);

/**
 * Github Profile
 */
router.get("/profile", authenticate, (req: Request, res: Response) => {
  console.log("User", req.user);
  res.render("profile.ejs", {
    user: req.user,
  });
});

/**
 * Github Account Link
 */
router.get(
  "/connect",
  passport.authorize("github", {
    scope: ["profile"],
  })
);

/**
 * Github Account Unlink
 */
router.get("/unlink", (req: Request, res: Response) => {
  console.log("hERE", req.user);
  let user = req.user as User;

  //Sets the token property to null to disconnect the user

  user.token = null;
  user.save((err: Error) => {
    if (err) throw err;
  });
  res.redirect("/");
});

/**
 * Github Callback
 * 
 */
router.get(
  "/callback",
  passport.authenticate("github", {
    successRedirect: "/auth/github/profile",
    failureRedirect: "/",
  })
);

/**
 * Search route
 * 
 */
router.get("/search", authenticate, async (req: Request, res: Response) => {
  try {

    let apiUrl: string = "";

    const { repository, user, topic, filePath } = req.query;

    if(user && !repository && !topic && !filePath)
    {
      apiUrl = `https://api.github.com/users/${user}`;
    }
    if(user && repository && filePath)
    {
      apiUrl = `https://api.github.com/repos/${user}/${repository}/contents/${filePath}`;
    }
    if(user && repository && !filePath && !topic)
    {
      apiUrl = `https://api.github.com/users/ ${user}/repos`;
    }
    if(topic)
    {
      apiUrl = `https://api.github.com/search/topics?q=${topic}`;
    }
    const response = await axios.get(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json"
      },
    });
    
    if (response.status === 200) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: "Resource not found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * 
 */
router.post(
  "/favorites/add",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const { id, repositoryName, owner } = req.body;

      const user: any = req.user;

      const createdFavorite = await addFavoriteRepository(id, repositoryName, owner, user?.email);
      if(createdFavorite === "Repository already favorite")
      {
        return res.status(200).json({message: createdFavorite});
      }
      
      res.status(200).json({success: "Repository added as favorite" });

    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * 
 */
router.post(
  "/favorites/remove",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const {repositoryName } = req.body;

      const { email } : any = req.user;

      await removeFavoriteRepository(email, repositoryName);
      res.status(200).json({ success: "Repository removed from favorites" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get(
  "/favorites/list",
  authenticate,
  async (req: Request, res: Response) => {
    try{
      const user: any = req.user;
      console.log(user);
      const favorites: any = await FavoritesModel.findOne({where: {email: user.email}});
      if(favorites)
        return res.status(200).json({favorites: favorites.dataValues.repositoryName});

      res.status(404).json({error: "Cannot get favorites for the owner"});
    }catch(err: any)
    {
      res.status(404).json({error: "Cannot get favorites"});
    }
  }
)
