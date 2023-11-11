const express = require('express')
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const  Notice = require('../models/Notice');

//Route 1: fetch  all features using: get "http://localhost:3000/api/notices/fetchallnotice". login required
router.get('/fetchallnotice',  async (req, res) => {
    try {
        const notices = await Notice.find().select("-user");
        Status=200
        res.json(notices);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }


});
//Route 2: add a new features using: post "http://localhost:3000/api/notices/addnotice". login required
router.post('/addnotice', fetchuser, [
    body('event_name','enter event name').isLength({min:1}),
    body('event_date','enter event date').isLength({min:5}),
    body('event_time','Enter event time').isLength({min:5}),
    body('place','Enter place').isLength({min:3}),
],async (req, res) => {
try {
    const {event_name,event_date,event_time,place} = req.body;
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const notices = new Notice({ user:req.user.id,event_name,event_date,event_time,place });
    const savednotice = await notices.save();
    Status = "success";
    res.status(200).json({Status,savednotice});
    console.log("success");
} catch (error) {
    onsole.error(error.message);
            res.status(500).send("Internal server error occured");
}
});
// Route 3: update an existing features using: put "http://localhost:3000/api/notices/updatenotice/:id". login required
router.put('/updatenotice/:id', fetchuser,[
    body('event_name','enter event name').isLength({min:1}),
    body('event_date','enter event date').isLength({min:5}),
    body('event_time','Enter event time').isLength({min:5}),
    body('place','Enter place').isLength({min:3}),
], async (req, res) => {
   try {
    const {event_name,event_date,event_time,place} = req.body;
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //create a newNotice object
    const newNotice = {};
    if (event_name) { newNotice.event_name = event_name };
    if (event_date) { newNotice.event_date = event_date };
    if (event_time) { newNotice.event_time = event_time };
    if (place) { newNotice.place = place };
    //find the notice to be updated and update it
    let notice = await Notice.findById(req.params.id);
    if (!notice) { return res.status(404).send("Not Found") }
    if (notice.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed");
    }
    const updatednotice = await Notice.findByIdAndUpdate(req.params.id, { $set: newNotice }, { new: true });
    res.json({ updatednotice });
   } catch (error) {
    res.status(500).send("Internal server error occured");
    console.log(error.message);
   }
});

// Route 4: delete an existing features using: delete "http://localhost:3000/api/notices/deletenotice/:id". login required
router.delete('/deletenotice/:id', fetchuser, async (req, res) => {
    try {
        //find the notices to be deleted and delete it
        let notice = await Notice.findById(req.params.id);
        if (!notice) { return res.status(404).send("Not Found") }
        //allow deletion only if user owns this notices
        if (notice.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        notice = await Notice.findByIdAndDelete(req.params.id);
        res.json({ "Success": "notices has been deleted", notice: notice });
    } catch (error) {
        res.status(500).send("Internal server error occured");
        console.log(error.message);
    }
});
module.exports = router;