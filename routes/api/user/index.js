const router = require('express').Router();
const userModel = require('../../../models').userModel
const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const authentication = require('../../../library').authentication

const sender = nodeMailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    service:'gmail',
    auth:{
        user:process.env.SEND,
        pass:process.env.PASSWORD
    },
    secure:true,
    tls:{
        rejectUnauthorized:false
    }
})

router.get('/',(req, res) => {
    res.send('this is user route')
})


router.post('/signup',async(req, res) =>{
    try {
        console.log("asg");
        const user = new userModel(req.body)
        const hash = await bcrypt.hash(user.password,10)
         user.password = hash;
         await user.save()

          const token = await jwt.sign({userId:user.id},process.env.SECRET_KEY)

          const composeMail = {
              from:process.env.SEND,
              to:req.body.email,
              subject:'Mail from NodeJS',
              html:`
              <div>
              <p><b>Hi, ${req.body.name}</b>. We welcome to our platform</p>
              <p>To verify your account, click below</p>
              <a href="https://authentication-backend-nodejs.herokuapp.com/api/user/verify/${token}">Click Here</a>
              </div>
              `
          }

          

          sender.sendMail(composeMail,(err,data)=>{
              if(err){
                  console.log(err);
              }else{
                  console.log('mail successfully sended. '+data.response);
              }
          })


         res.json({message:'user successfully added. We have send verfication link to your mail'})

    } catch (error) {
        res.json({error: error.message})
    }
})

router.get('/verify/:token',async (req, res)=>{
    try {
        const data = jwt.verify(req.params.token,process.env.SECRET_KEY)
       const verify = await userModel.findByIdAndUpdate({_id:data.userId},{verified:true})
       res.json({message:'your account is verified. You can login'})
    } catch (error) {
        res.json({message:error.message})
    }
})


router.post('/login',async(req, res)=>{
    try {
        const user = await userModel.findOne({email:req.body.email})
        if(!user.verified){
            return res.json({message:'Your account is not verified'})
        }
        if(user){
            const match = await bcrypt.compare(req.body.password,user.password)
            
            if(match){
               const token = await jwt.sign({userId:user.id},process.env.SECRET_KEY)
               res.json(token)
            }else{
                res.json({message:'wrong password'})
            }
        }else{
            res.json({message:'no user found'})
        }

    } catch (error) {
        res.json({message:error.message})
    }
})


router.post('/data',authentication, async(req, res)=>{
    try {
        
        const getData = await userModel.findById({_id:req.userId}).select('name email -_id')
        res.json(getData)
    } catch (error) {
        res.json({message:error.message})
    }
})

router.post('/forgot',async(req, res)=>{
    try {
        const token = await jwt.sign({email:req.body.email},process.env.SECRET_KEY,{
            expiresIn:'1h'
        })
        const composeMail = {
            from:process.env.SEND,
            to:req.body.email,
            subject:'Mail from NodeJS',
            html:`
            <div>
            <p>To forgot your password. Don't worry, Click below to change your password(note: this link will expire in 1hr)</p>
            <a href="https://authentication-backend-nodejs.herokuapp.com/api/user/forgot/${token}">Click Here...</a>
            </div>
            `
        }

        sender.sendMail(composeMail,(err,data)=>{
            if(err){
                console.log(err);
            }else{
                console.log('mail successfully sended'+ data.response);
            }
        })
        res.send('mail sended')
    } catch (error) {
        res.json({message:error.message})
    }
})

router.get('/forgot/:token',(req, res)=>{
    try {
        res.render('home',{token:req.params.token})
    } catch (error) {
        res.json({message:error.message})
    }
})

router.post('/forgot/:token',async(req, res)=>{
try {
    const data = await jwt.verify(req.params.token,process.env.SECRET_KEY)
    const encrypt = await bcrypt.hash(req.body.confirmPassword,10)
     const update = await userModel.findOneAndUpdate({email:data.email},{password:encrypt});
    //  res.json({message:'updated successfully'})
    res.render('index')
    
} catch (error) {
    res.json({message:error.message})
}
})

module.exports = router;