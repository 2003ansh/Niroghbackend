const express = require('express')
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const  Photos = require('../models/Photos');

//route 1: fetch all photos using: get "http://localhost:3000/api/photos/fetchallphotos". login required
router.get('/fetchallphotos',  async (req, res) => {
    try {
        const photos = await Photos.find().select("-user");
        Status=200
        res.status(200).json({Status,photos});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
});
//router 2: add a new photos using: post "http://localhost:3000/api/photos/addphotos". login required
router.post('/addphotos', fetchuser, [
    body('event', 'please add event').isLength({ min: 3 }),
    body('place', 'please add place').isLength({ min: 3 }),
    body('photo', 'please add a photo').isLength({ min: 5 }),
],async (req, res) => {
try {
    const {event,place,photo} = req.body;
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const photos = new Photos({ user:req.user.id,event,place,photo });
    const savedphotos = await photos.save();
    Status = "success";
    res.status(200).json({Status,savedphotos});
    console.log("success");
} catch (error) {
    console.error(error.message);
            res.status(500).send("Internal server error occured");
}
});
// Route 3: update an existing photos using: put "http://localhost:3000/api/photos/updatephotos/:id". login required
router.put('/updatephotos/:id', fetchuser, [
    body('event', 'please add event').isLength({ min: 3 }),
    body('place', 'please add place').isLength({ min: 3 }),
    body('photo', 'please add a photo').isLength({ min: 5 }),
],async (req, res) => {
try {
    const {event,place,photo} = req.body;
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //create a newPhotos object
    const newPhotos = {};
    if (event) { newPhotos.event = event };
    if (place) { newPhotos.place = place };
    if (photo) { newPhotos.photo = photo };
    //find the photos to be updated and update it
    let photos = await Photos.findById(req.params.id);
    if (!photos) { return res.status(404).send("Not Found") }
    if (photos.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    photos = await Photos.findByIdAndUpdate(req.params.id, { $set: newPhotos }, { new: true });
    Status = "success";
    res.json({Status,photos});
    console.log("success");
} catch (error) {
    res.status(500).send("Internal server error occured");
    console.log(error);
}
});
// Route 4: delete an existing photos using: delete "http://localhost:3000/api/photos/deletephotos/:id". login required
router.delete('/deletephotos/:id', fetchuser, async (req, res) => {
try {
    //find the photos to be deleted and delete it
    let photos = await Photos.findById(req.params.id);
    if (!photos) { return res.status(404).send("Not Found") }
    if (photos.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    photos = await Photos.findByIdAndDelete(req.params.id);
    res.json({Status:"success",photos});
    console.log("success");
} catch (error) {
    res.status(500).send("Internal server error occured");
    console.log("error");
}
});
module.exports = router;