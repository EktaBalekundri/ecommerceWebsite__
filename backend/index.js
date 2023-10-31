const express = require('express')
require('./db/config');
const User = require("./db/User");
const Product = require("./db/product")

const jwt = require('jsonwebtoken');
const jwtKey ='e-comm';

const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

app.post("/register",async(req,res)=>{
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password

    jwt.sign({ result },jwtKey,{expiresIn:"2h"},(err, token)=>{
                if(err){
                    res.send({result:"Something went wrong, Please try after sometime"})
                }
                res.send({ result, auth:token });
            
            })
})


app.post("/login",async(req,res)=>{
    console.log(req.body);

    if(req.body.password && req.body.email){
        let user = await User.findOne(req.body).select("-password");
        if(user){
            jwt.sign({user},jwtKey,{expiresIn:"2h"},(err, token)=>{
                if(err){
                    res.send({result:"Something went wrong, Please try after sometime"})
                }
                res.send({ user, auth:token });
                // res.send(user)
            })
          
        }
        else{
            res.send({result: 'No user found'})
        }
    }else{
        res.send({result: 'No user found'})
    }
})


app.post("/add-product",async(req,res)=>{
    let product =  new Product(req.body);
    let result = await product.save();
    res.send(result);
});

app.get("/products", async(req,res)=>{
    let products = await Product.find();
    if(products.length>0){
        res.send(products)
    }else{
        res.send({result:"No Product found"})
    }
});

app.delete("/product/:id", async(req, res)=>{
    const result = await Product.deleteOne({_id:req.params.id})
    res.send(result);
});

app.get("/product/:id", async(req,res)=>{
    let result = await Product.findOne({_id:req.params.id});
    if(result){
        res.send(result);
    }else{
        res.send({result:"No Record Found"})
    }
});

app.put("/product/:id",async(req,res)=>{
    let result = await Product.updateOne(
        {_id:req.params.id},
        {
            $set : req.body
        }
    )
    res.send(result);
});

app.get("/search/:key", async(req,res)=>{
    let result = await Product.find({
        "$or":[
            { name :{$regex: req.params.key}},
            { category :{$regex: req.params.key}},
            { company :{$regex: req.params.key}}
        ]
    });
    res.send(result);
})


function verifyToken(req,res,next){
    let token = req.headers['authorization'];
    if(token){
        token = token.split(' ')[1];
        jwt.verify(token,jwtKey,(err,valid)=>{
            if(err){
                res.status(401).send({result:"Please provide valid token"})
            }else{
                next();
            }
        })
    
    }else{
        res.status(403).send({result:"please add token with header"})
    }
    
   
}


app.listen(5000);