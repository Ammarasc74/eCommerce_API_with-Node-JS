const express = require( 'express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
        
// connect to DATABASE

mongoose.connect('mongodb+srv://Ammarasc74:'+ process.env.MONGO_ATLAS_PW +
'@cluster0.1tiis.mongodb.net/<dbname>?retryWrites=true&w=majority'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };
  mongoose.Promise = global.Promise;
//   const db = mongoose.connection;
//   db.on("error", () => console.log("connection error"));
//   db.once("open", () => console.log("connected successfuly"));

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 


app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requsted-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods",'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

// routes with should handle req

app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/user', userRoutes)

app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    // console.log(error)
    res.json({
        error: {
            massage: error.message
        }
    });
});

module.exports = app;