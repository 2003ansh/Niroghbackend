const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Testimonials = require("../models/Testimonials");

//route 1: fetch all testimonials using: get "http://localhost:3000/api/testimonials/fetchalltestimonials". login required
router.get("/fetchalltestimonials", async (req, res) => {
  try {
    const testimonials = await Testimonials.find().select("-user");
    Status = 200;
    res.status(200).json({ Status, testimonials });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});
//router 2: add a new testimonials using: post "http://localhost:3000/api/testimonials/addtestimonials". login required
router.post(
  "/addtestimonials",
  fetchuser,
  [
    body("name", "please add name").isLength({ min: 3 }),
    body("rating", "please add designation").isNumeric(),
    body("message", "please add a testimonial").isLength({ min: 5 }),
    body("photo", "please add a testimonial").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { name, rating, message, photo } = req.body;
      const errors = await validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const testimonials = new Testimonials({
        user: req.user.id,
        name,
        rating,
        message,
        photo,
      });
      const savedtestimonials = await testimonials.save();
      Status = "success";
      res.status(200).json({ Status, savedtestimonials });
      console.log("success");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//router 3: update an existing testimonials using: put "http://localhost:3000/api/testimonials/updatetestimonials/:id". login required
router.put('/updatetestimonials/:id', fetchuser, [
    body('name', 'please add name').isLength({ min: 3 }),
    body('rating', 'please add designation').isNumeric(),
    body('message', 'please add a testimonial').isLength({ min: 5 }),
    body('photo', 'please add a testimonial').isLength({ min: 5 }),

], async (req, res) => {
    try {
        const { name, rating, message, photo } = req.body;
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //create a newTestimonials object
        const newTestimonials = {};
        if (name) { newTestimonials.name = name };
        if (rating) { newTestimonials.rating = rating };
        if (message) { newTestimonials.message = message };
        if (photo) { newTestimonials.photo = photo };
        //find the testimonials to be updated and update it
        let testimonials = await Testimonials.findById(req.params.id);
        if (!testimonials) { return res.status(404).send("Not Found") }
        if (testimonials.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        testimonials = await Testimonials.findByIdAndUpdate(req.params.id, { $set: newTestimonials }, { new: true });
        res.json({ testimonials });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
});
//router 4: delete an existing testimonials using: delete "http://localhost:3000/api/testimonials/deletetestimonials/:id". login required
router.delete('/deletetestimonials/:id', fetchuser, async (req, res) => {
    try {
        //find the testimonials to be deleted and delete it
        let testimonials = await Testimonials.findById(req.params.id);
        if (!testimonials) { return res.status(404).send("Not Found") }
        if (testimonials.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        testimonials = await Testimonials.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Successfully deleted", testimonials });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }
});

module.exports = router;
