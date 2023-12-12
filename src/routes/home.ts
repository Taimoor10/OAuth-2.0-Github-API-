import { Request, Response } from "express";

const router = require("express").Router();

module.exports = router;

router.get('/', async(req: Request, res: Response) => {
    res.render('index.ejs');
})