const express = require( "express");
const cors = require("cors");
const mongoose = require("mongoose") ;
const bodyParser = require('body-parser');
const res = require("express/lib/response");
const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());
app.use( express.static('uploads'));
app.get("/",(req,res) => {
  res.send("welcome to server")
})
app.listen(8000, () => {
  console.log("started at port 8000");
  
});
const multer= require("multer");
const path = require('path');
const storage= multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null , 'uploads/')
  },
  filename: (req, file , cb)=>{
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname) )
  }

})
const upload = multer({storage: storage})

mongoose.connect(
  "mongodb://localhost:27017/test",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
  },
    () => {
      console.log("DB connected......");
  }
);
const userSchema = new mongoose.Schema({
   
  isUser:  { type:String,
      require:true,
},
  username:  { type:String,
  require:true,
},
   phone:  { type: Number,
             require:true,
},
   email:  { type:String,
    require:true,
},
   password: { type:String,
    require:true,
}
});
const dataSchema = new mongoose.Schema({
  userId : {
    type:String,
    require:true,
  },  
  userName:  { type:String,
  require:true,
},
media:  { type:String,
  require:true,
},
  title:  { type:String,
    require:true,
},
 describe:  { type:String,
  require:true,
    },
  

  status: { type:String,
    require:true,
},
  time: { type:String,
  require:true,
}
});
const User = new mongoose.model("user", userSchema);
const Data = new mongoose.model("data", dataSchema);





app.post("/login", (req, res) => {
  const { email, password}=req.body;
  User.findOne({email: email}, (err, user)=>{
    if(user){
      if(password === user.password ){
        res.send({message:"Login Successfull" , user: user})

      }else{
        res.send({message:"password didnt match"})
      }
     
    }else{
      res.send({message:"user not registered"})
    }
  })
});

app.get("/register",async (req, res) => {
  // const { title , description, status}=req.body;
  try {
    const registered = await User.find()
    res.json(registered);
    
  } catch (error) {
    console.log("users ---->",resgistered)
  }

});
app.post("/data",upload.single('image'), async(req, res) => {
  // const { title , describe, status,userId,userName,time,media}=req.body;

  const data = await new Data({
   title:req.body.title,
   describe:req.body.describe,
   status:req.body.status,
   userId:req.body.userId,
   time:req.body.time,
    media:req.image,
   userName:req.body.userName,
 })
  data.save(err =>{
    if(err) {
      res.send(err)
    }else{
      res.send({ message:"Successfully instered" })
    }
 
  })
});
// app.post("/data/:id",upload.single('image'),(req, res) => {
//   // const {phone, isUser ,username , email, password}=req.body;
//   Data.findByIdAndUpdate({_id:req.params.id}, (err, Data)=>{
//      const data = new Data({
//       title:req.body.title,
//             describe:req.body.describe,
//             status:req.body.status,
//             time:req.body.time,
//             media:req.file.path
//     })
//     data.save(err =>{
//       if(err) {
//         res.send(err)
//       }else{
//         res.send({ message:"data Successfully Updated" })
//       }
   
//     })
  
//  })
   
//  });
  


app.put('/data/:id',upload.single('image'), async (req,res) => {    
  try{
    console.log('req.body==',req.body)
      // res.status(200).json(star)
      let data = await Data.findByIdAndUpdate({_id:req.params.id},{
       $set:{
            title:req.body.title,
            describe:req.body.describe,
            status:req.body.status,
            time:req.body.time,
            // media:req.image,
       }   
      },{new:true})
      res.send({data})
      
  }catch{
      res.send('Error')
  }
} )

app.delete("/data/:id",async (req, res) =>{
  try {
    const deleted = await Data.findByIdAndDelete({_id: req.params.id})
    res.json(deleted);
    
  } catch (error) {
    console.log("users ---->",deleted)
  }
})
app.get("/data",async (req, res) => {
  // const { title , description, status}=req.body;
  try {
    const alldata = await Data.find()
    res.json(alldata);
    
  } catch (error) {
    console.log("alldata ---->",alldata)    
  }

});

app.get("/data/:id",async (req, res) => {
  // const { title , description, status}=req.body;
  try {
    const alldata= await Data.findById(req.params.id)
    res.json(alldata);  
    
  } catch (error) {
    console.log("alldata ---->",alldata)
  }

});

app.post("/register", (req, res) => {
 const {phone, isUser ,username , email, password}=req.body;
User.findOne({email: email}, (err, user)=>{
  if(user){
    res.send({message:"user already registered"})
  }else{
    const user = new User({
      isUser,
      username,
      email,
      phone,
      password
   })
   user.save(err =>{
     if(err) {
       res.send(err)
     }else{
       res.send({ message:"Successfully Registered" })
     }
  
   })
  }
})
  
});
 

