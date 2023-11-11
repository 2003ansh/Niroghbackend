const express = require('express')
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const  Services = require('../models/Services');

//Route 1: fetch  all features using: get "http://localhost:3000/api/services/fetchallfeatures". login required
router.get('/fetchallfeatures',  async (req, res) => {
    try {
        const featuress = await Services.find().select("-user");
        Status=200
        res.status(200).json({Status,featuress});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occured");
    }

});


//Route 2: add a new features using: post "http://localhost:3000/api/services/addfeatures". login required
router.post('/addfeatures', fetchuser, [
    body('name', 'Enter a valid title').isLength({ min: 3 }),
    body('long_description', 'please add long description').isLength({ min: 20 }),
    body('short_description', 'please add short description').isLength({ min: 10 }),
    body('status', 'please add status').isLength({ min: 4 }),
    body('photo', 'please add a photo').isLength({ min: 5 }),
],
    async (req, res) => {
        try {
            const { name,long_description,short_description,status,photo} = req.body;
            //if there are errors, return bad request and the errors caused due to format.
            const errors = await validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const featuress = new Services({ user:req.user.id,name,long_description,short_description,status,photo });
            const savedfeatures = await featuress.save(); //-->here we are saving the feature in database.features.save() is a promise of saving the data in database.
            Status = "success";
            res.status(200).json({Status,savedfeatures});
            console.log("success");
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal server error occured");
        }



    })
// Route 3: update an existing features using: put "http://localhost:3000/api/services/updatefeatures/:id". login required

router.put('/updatefeatures/:id', fetchuser, async (req, res) => {
    try {
        const { name,long_description,short_description,status,photo} = req.body;
    //create a newFeatures object
    const newFeatures = {};
    if (name) { newFeatures.name = name };
    if (long_description) { newFeatures.long_description = long_description };
    if (short_description) { newFeatures.short_description = short_description };
    if (status) { newFeatures.status = status};
    if (photo) { newFeatures.photo = photo };

//find the feature to be updated and update it
    const feature = await Services.findById(req.params.id); //-->here we are finding the  id of feature to be updated.
    //.findById(req.params.id): This is a Mongoose query method that attempts to find a document in the collection by its _id field. req.params.id is used to retrieve the value of the id parameter from the request URL. This is commonly used in an Express.js route to retrieve a specific resource based on its ID.
    console.log(feature);
    if (!feature) { return res.status(404).send("Not found") };

    //Allow updation only if user owns this feature
    console.log(feature.user);
    console.log(req.user.id);
    if (feature.user.toString() !== req.user.id) { //-->here we are checking if the user is the owner of the feature or not.by comparing the id of the user and the user id stored in the feature.
        return res.status(401).send("Not allowed");
    }
    const updatedFeature = await Services.findByIdAndUpdate(req.params.id, { $set: newFeatures }, { new: true }).select("-user"); //-->$set is used to set the newFeatures object to the feature to be updated.
    
    res.json(updatedFeature);

    }
     catch (error) {
        console.error(error.message);
            res.status(500).send("Internal server error occured");
    }

})

// //Route 4: delete an existing feature using: delete "http://localhost:3000/api/services/deletefeatures/:id". login required

router.delete('/deletefeatures/:id', fetchuser, async (req, res) => {
    try {
        
//find the feature to be deleted and delete it
const feature = await Services.findById(req.params.id); //->here we are finding the  id of feature to be deleted.
    if (!feature) { return res.status(404).send("Not found") };

    //Allow deletion only if user owns this feature
    if (feature.user.toString() !== req.user.id) { //->here we are checking if the user is the owner of the feature or not.by comparing the id of the user and the user id stored in the feature.
        return res.status(401).send("Not allowed");
    }
    const deletedfeature = await Services.findByIdAndDelete(req.params.id);  //-->.findById(req.params.id): This is a Mongoose query method that attempts to find a document in the collection by its _id field. req.params.id is used to retrieve the value of the id parameter from the request URL. This is commonly used in an Express.js route to retrieve a specific resource based on its ID.
    res.json({ "Success": "feature has been deleted", deletedfeature: deletedfeature });
    } catch (error) {
        console.error(error.message);
            res.status(500).send("Internal server error occured");
    }
})


module.exports = router;