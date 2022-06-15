const router = require("express").Router();
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const config = require("../config");
const fs = require('fs')




const userDataBase = [
  {
    name: "priyansh",
    username: "priyansh123",
    email: "abc@gmail.com",
    password: "password",
    contact_number: "9767782398",
    profilePic:'./media/priyansh123/priyansh123mainbg.jpg'
  },
];





// multer configuration

const storage = multer.diskStorage({
	destination:(req,file,cb)=>{
		let dir = `./media/${req.body.username}`
		if(!fs.existsSync(dir)){
			fs.mkdirSync(dir,{recursive:true})
		}
		cb(null,dir)
	},
	filename:(req,file,cb)=>{
		cb(null,req.body.username+file.originalname)
	}
})

const upload = multer({storage,onError:(err,next)=>{console.log(err)} });



router.post("/register",upload.single('profilePic'), async (req, res) => {
	console.log(req.body)
	console.log(req.file);
  const { name, username, email, password, contact_number } = req.body;
  // check if user is present in the database (here we are storing in a variable for temp purpose)
  const user = userDataBase.find((obj) => email === obj.email);
  if (user) {
    return res.status(401).send({ message: "User already registered" });
  } else {

req.body.profilePic=req.file.path;
    userDataBase.push(req.body);

    const token = generateAuthToken(req.body);
    return res
      .status(200)
      .send({ token, data: req.body, message: "Account successfully created" });
  }
});


router.get("/getProfilePic", async (req, res) => {
	if(req.query.path){
	//  = fs.readFileSync(req.query.path,)
   const myfile=fs.readFile(req.query.path, (err, data) => {
     if(err){
      res.status(401).send('no profile picture found')
     }
     else{res.send(data)}
 
 })

}})



router.post("/login", async (req, res) => {
  const { password, username } = req.body;
  console.log(password,username);

  try {


    // check if user is present in the database (here we are storing in a variable for temp purpose)
    const user = userDataBase.find((obj) => username === obj.email ||username===obj.username);
	
    if (!user) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    // password matching (we can use encryption here and save password by hashing it , library like bcrypt we can use)
    if (password !== user.password) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const token = generateAuthToken(user);
    res
      .status(200)
      .send({ token, data: user, message: "logged in successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validateData = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

function generateAuthToken(user) {
  const token = jwt.sign({ username: user.username }, config.JWTPRIVATEKEY, {
    expiresIn: "2d",
  });
  return token;
}

module.exports = router;
