const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 2000;

app.use(bodyParser.json());
app.use(express.json())

// add new products and prices by admin
app.post('/addNew', async (req, res) => {
    try {
        const newProducts = new productDetails({
            product_name: req.body.product_name,
            product_price: req.body.product_price
        })

        // generating tokens
      const token = await newProducts.generateAuthToken();

        const adminRecords = await newProducts.save();
        res.send(adminRecords);
    } catch (error) {
        res.status(201);
    }


})

//update products and prices by admin
app.patch('/update/admin/:id', async (req, res) => {
    try {
        const updateRecord = await productDetails.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
        res.send(updateRecord);
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete products and prices by admin
app.delete('/delete/admin/:id', async (req, res) => {
    try {
        const updateRecord = await productDetails.findByIdAndRemove({ _id: req.params.id });
        res.send(updateRecord);
    } catch (error) {
        res.status(400).send(error)
    }
})

//get data by user without id
app.get('/addNew', async(req,res)=>{
    try {
        const getdata = await productDetails.find();
        res.send(getdata);  
    } catch (error) {
        res.status(404).send(error);
    }
})

//get data by id by user
app.get('/Userdata/:id', async (req, res) => {
    try {
        // console.log(_id=req.params.id)
        const getRecord = await productDetails.find({ _id: req.params.id });
        res.send(getRecord);
    } catch (error) {
        res.status(400).send(error)
    }
})

// database connection
mongoose.connect("mongodb://localhost:27017/product_details", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then((err) => {
        console.log("database connected");
    }).catch((err) => {
        console.log(err)
    })

// database Schema
const post_schema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    tokens:[{
       token:{
           type:String,
           required:true
       }
    }]
})

post_schema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id)
        const token = jwt.sign({_id:this._id.toString()}, "mynameisvarunkumarpandeyandharshit");
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
       res.send("the error part"+ error); 
    }
}

// model for crud operation
const productDetails = new mongoose.model("product_details", post_schema);
module.exports = productDetails;

app.listen(port, () => {
    console.log(`server run on ${port}`);
})