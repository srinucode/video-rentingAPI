const auth = require('../middleware/auth');
const {User,validate} = require('../models/user');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const _ =require('lodash');
const router = express.Router();

router.get('/me',auth,async(req,res)=>{
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});
router.post('/',async(req,res)=>{
	console.log("Backend Body "+JSON.stringify(req.body));
	const {error} =validate(req.body);

	if(error) return res.status(404).send(error.details[0].message);
	let user=await User.findOne({email:req.body.email});
    if(user)return res.status(400).send('User already Exist');
	 user = new User(_.pick(req.body,['name','email','password'])
	//  {
	// 	name:req.body.name,
	// 	email:req.body.email,
	// 	password:req.body.password
	// }
	);

	 const salt = await bcrypt.genSalt(10);
	 user.password=await bcrypt.hash(user.password,salt);

	await user.save();
     const token = user.generateAuthToken();
	res.header('x-auth-token',token).send(_.pick(user,['name','email']));
	
});


module.exports= router;