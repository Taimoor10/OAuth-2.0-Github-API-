import { Request, Response, NextFunction } from 'express';
import Jwt from "jsonwebtoken";

/*
*
* req.user property verifies that whether the user is coming in logged in or not.
* If the user is logged in, then req.user is populated and not populated in case of not logged in
*/


async function authenticate(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        return next();
    }
    
    const authHeader = req.headers['authorization'];
    const token: string | any = authHeader && authHeader.split(' ')[1];

    if(token === null)
        return res.sendStatus(403);

    Jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: Express.User | undefined) => {
        if(err)
            return res.sendStatus(403);

        req.user = user;
        next();
    })
}

export default authenticate;