import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
const router = require("express").Router();
import Jwt from "jsonwebtoken";
import { signUp } from "../repositories/user";
import CustomUserModel from "../database/model/customUser.model";
module.exports = router;

/**
 * SignUp
 */
router.post('/signup', async (req: Request, res:Response) => {

    try{
        const {email, username, password} = req.body;
        const response: any = await signUp(email, username, password);

        if(response === "User is already registered")
            return res.status(200).json({message: response});

        res.status(200).json({success: "User is registered"});
    }catch(err: any)
    {
        res.status(500).json({error: err.message});
    }
})

/**
 * Login
 */
router.post('/login', async(req: Request, res: Response) => {

    //Custom authentication for user
    try{
        const {email, password} = req.body;

        const result: any = await CustomUserModel.findOne({where: {email: email, password: password}});
        if(!result)
            return res.status(404).json({error: "Cannot Login"});

        const user: object = {email: email};
        const accessToken: string = Jwt.sign(user, process.env.JWT_SECRET!);

        res.json({accessToken: accessToken});
    }catch(err: any)
    {
        res.status(500).json({error: err.message});
    }
})