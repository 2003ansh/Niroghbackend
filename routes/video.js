const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Videos = require("../models/Video");

//route 1: fetch all videos using: get "http://localhost:3000/api/videos/fetchallvideos". login required
router.get("/fetchallvideos", async (req, res) => {
    try {
        const videos = await Videos.find().select("-user");
        Status = 200;
        res.json({ Status, videos });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
});

//router 2: add a new videos using: post "http://localhost:3000/api/videos/addvideos". login required
router.post('/addvideos', fetchuser, [
    body('videoId', 'please add name').isLength({ min: 3 }),
], async (req, res) => {
    try {
        const { videoId } = req.body;
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const videos = new Videos({
            user: req.user.id,
            videoId,
        });
        const savedvideos = await videos.save();
        Status = "success";
        res.status(200).json({ Status, savedvideos });
        console.log("success");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
 }
);

//router 3: update an existing videos using: put "http://localhost:3000/api/videos/updatevideos/:id". login required
router.put('/updatevideos/:id', fetchuser, [
    body('videoId', 'please add name').isLength({ min: 3 }),
], async (req, res) => {
    try {
        const { videoId } = req.body;
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let videos = await Videos.findById(req.params.id);
        if (!videos) {
            return res.status(404).send("Not found");
        }
        if (videos.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        videos = await Videos.findByIdAndUpdate(req.params.id, { videoId }, { new: true });
        res.json({ videos });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
});

//router 4: delete an existing videos using: delete "http://localhost:3000/api/videos/deletevideos/:id". login required
router.delete('/deletevideos/:id', fetchuser, async (req, res) => {
    try {
        let videos = await Videos.findById(req.params.id);
        if (!videos) {
            return res.status(404).send("Not found");
        }
        if (videos.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        videos = await Videos.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Video has been deleted", videos: videos });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
});
module.exports = router;