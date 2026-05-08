require('dotenv').config()
const express= require('express')

const app = express();
const cors=require ('cors')
const total=require('./data')
const name=require('./home')
const rollno=require('./front')
const {fruits,car}=require('./object')
const { add }=require('./object')
const { subtract }=require('./object')
const { connectdb }=require('./db')
const userSchema=require('./models')
const newuser=require('./newschema');
const product=require('./product');
const person=require('./User');
const admin=require('./admin');
const bcrypt=require('bcrypt')
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const Cart = require('./cart');
const req = require('express/lib/request');
const order = require('./order');
const Car = require('./Car');
const Order = require('./order');
const jwt = require('jsonwebtoken');
const auth = require('./auth/auth');
// import Cart from './cart.js';



app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 5 * 1024 * 1024 }, 
    abortOnLimit: true,
    responseOnLimit: 'File size limit has been reached'
}));
app.use(express.json());

app.use(express.urlencoded({ extended: true })); 
app.use(cors())



 let a=10;
 let b=15;
 let c=a*b;
 console.log(c);


connectdb();
app.get('/home',(req,res)=>{
    res.send(total);
    
})

app.get('/adddata',async (req,res)=>{
    try {
        let data={
            name:"praveen",
            email:"praveen271jan@gmail.com"
        }
       await userSchema.create(data)//insert command
    } catch (error) {
        console.log(error)
    }
})
app.get('/newdata',async (req,res)=>{
    try {
        let data={
            name:"BMW M5",
            year:2022
        }
       await newuser.create(data)//insert command
       res.json(data)
    } catch (error) {
        console.log(error)
    }
})
app.get('/welcome',(req,res)=>{
    res.send(name);
})
app.get('/ultra',(req,res)=>{
    res.send(rollno);
})
app.get('/next',(req,res)=>{
    res.send(fruits.name);
   
})
app.get('/car',(req,res)=>{
    res.send(car.name)
})
app.get('/link/:no',(req,res)=>{
    const n = Number(req.params.no);
    res.json({ result: add(20, n) });
})
app.get('/sub/:id', (req, res) => {
    const n = Number(req.params.id);
    res.json({ result: subtract(30, n) });
});
app.post('/adduser',async (req,res)=>{
    try {
         
        console.log(req.body)
        let data = req.body;
        res.send("got it")
                                                        
       await userSchema.create(data)//insert command
    } catch (error) {
        console.log(error)
    }
    
})
app.post('/addcar',async (req,res)=>{
    try {
         
        console.log(req.body)
        let year =parseInt(req.body.year);
        let data = req.body;
        let dataNew =  {
            name: data.name,
            year: year,
            model: data.model,
            price: data.price,
            status: data.status
        }
        res.send("got it")
                                                        
       await  newuser.create(data)
    } catch (error) {
        console.log(error)
    }
    
})
app.get('/getuser',async (req,res)=>{
   try {
     console.log(req.body)
     let data=req.body;
     res.send("got the user")
    
    await userSchema.create(data)
   } catch (error) {
       console.log(error)
   }


})
app.put('/updatecar/:id',async (req,res)=>{
    try {
        const id=req.params.id
        console.log(id)
        const updatecar = req.body
        console.log(req.body,"-----------")
        const updatedcar= await newuser.findByIdAndUpdate(id,updatecar)
         console.log(updatedcar)
    } catch (error) {
        console.log(error)
    }
})
app.delete('/deletecar/:id',async (req,res)=>{
    try {
        const id=req.params.id
        console.log(id)
        const deletedcar= await newuser.findByIdAndDelete(id)
        console.log("value got deleted")
    } catch (error) {
        console.log(error)
    }
})
app.get('/getcar',async (req,res)=>{
    try {
        const  car=await newuser.find()
        console.log(car)
        res.json(car)
    } catch (error) {
        console.log(error)
    }
})


// Configure Cloudinary (do this once, not inside the route)
cloudinary.config({ 
    cloud_name: 'dx5ejt2nz', 
    api_key: '737933712444939', 
    api_secret: 'POTQ_jHamu-jspTfK7_96KaeObc'
});

// Your route
app.post('/addproduct', async (req, res) => {
    try {
        console.log("Text fields:", req.body);
        console.log("File object:", req.files ? req.files.image : "No file uploaded");
        
        let cloudinaryUrl = null;
        
        // Check if image was uploaded
        if (req.files && req.files.image) {
            const image = req.files.image;
            console.log(`Uploading file: ${image.name}, Size: ${image.size} bytes, Type: ${image.mimetype}`);
            
            try {
                // Method 1: Upload using the temp file path
                const uploadResult = await cloudinary.uploader.upload(image.tempFilePath, {
                    public_id: `product_${Date.now()}`,
                    folder: "products",
                    resource_type: "auto"
                });
                
                console.log("Cloudinary upload successful:", uploadResult);
                cloudinaryUrl = uploadResult.secure_url;
                
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                
                
                try {
                    const base64Image = image.data.toString('base64');
                    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
                    
                    const uploadResult2 = await cloudinary.uploader.upload(dataURI, {
                        public_id: `product_${Date.now()}_buffer`,
                        folder: "products"
                    });
                    
                    cloudinaryUrl = uploadResult2.secure_url;
                    console.log("Upload successful via buffer:", cloudinaryUrl);
                    
                } catch (bufferError) {
                    console.error("Buffer upload also failed:", bufferError);
                }
            }
        } else {
            console.log("No image file uploaded");
        }
        
        // Prepare product data with Cloudinary URL
        const productData = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            image: cloudinaryUrl // This will be the Cloudinary URL or null
        };
        
        console.log("Saving product to database:", productData);
        
        // Save to database
        const savedProduct = await product.create(productData);
        
        res.json({
            success: true,
            message: "Product added successfully",
            product: savedProduct,
            imageUrl: cloudinaryUrl
        });
        
    } catch (error) {
        console.error("Error in /addproduct:", error);
        res.status(500).json({
            success: false,
            message: "Error adding product",
            error: error.message
        });
    }
});
app.get('/viewproduct',async (req,res)=>{
    try {
        const viewproduct=await product.find()
        console.log(viewproduct)
        res.json(viewproduct)
    } catch (error) {
        console.log(error)
    }
})
app.get('/viewproduct/:id',async (req,res)=>{
    try {
        const id=req.params.id
        console.log(id,"------------------------------------------------")
        const productdata=await product.findById(id)
        console.log(productdata)
        res.json(productdata)
    } catch (error) {
        console.log
    }
})
app.delete('/deleteproduct/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const deletedproduct = await product.findByIdAndDelete(id);
    console.log("Product deleted successfully");
    res.json(deletedproduct);
    console.log(deletedproduct);
  } catch (error) {
    console.log(error);
    
  }
});
app.put('/updateproduct/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const updateproduct = req.body;
    const updatedproduct = await product.findByIdAndUpdate(id, updateproduct);
    console.log(updatedproduct);
    res.json(updatedproduct);
  } catch (error) {
    console.log(error);
  }
});
app.post('/addnewuser', async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const userdata = await person.create(req.body);
        res.json(userdata);
    } catch (error) {
        console.log(error);
    
    }
});
app.get('/viewuser',async (req,res)=>{
    try {
        const viewuser=await person.find()
        console.log(viewuser)
        res.json(viewuser)
    } catch (error) {
        console.log(error)
    }
})
app.delete('/deleteuser/:id',async (req,res)=>{
    try {
        console.log(req.params.id)
        const id=req.params.id
        const deleteduser=await person.findByIdAndDelete(id)
        console.log(deleteduser)
        res.json(deleteduser)
    } catch (error) {
        
    }
})
app.put('/updateuser/:id',async (req,res)=>{
    try {
        const id=req.params.id
        console.log(id)
        const updateuser=req.body
        const updateduser=await person.findByIdAndUpdate(id,updateuser)
        console.log(updateduser)
        res.json(updateduser)
    } catch (error) {
        console.log(error)
    }
})
app.post('/addnewadmin',async (req,res)=>{
    try {
        console.log(req.body)
        const name=req.body.name
        const password=req.body.password
        const email=req.body.email
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword) 
        const admindata=await admin.create(
            {   name:name,
                password:hashedPassword,
                email:email  })
         if(admindata){
            res.json({message:"admin registered successfully",
                success:true
            })
        }
        else{
            res.json({message:"admin registration failed",  
                success:false
            })
        }
    } catch (error) {
        console.log(error)
    }
})
app.post('/loginadmin',async (req,res)=>{
    try {
         const {email,password}=req.body
         const admindata=await admin.findOne({email:email})
            if(!admindata){
                return res.json({message:"admin not found"})
            }
         const ismatch=await bcrypt.compare(password,admindata.password)
         console.log(ismatch)
            if(ismatch){
                res.json({message:"login success",
                          success:true,
                          admin:admindata})
            }else{
                res.json({message:"login failed",success:false})
            }
    } catch (error) {
       console.log(error) 
    }
})
app.post('/registeruser', auth, async (req, res) => {
console.log(req.body,"-----------------------------")
    try {
        
        const { name, email, number, password } = req.body;
         console.log(req.body,"-----------------------------")
        // CHECK USER EXISTS
        const existingUser = await person.findOne({ email });

        if (existingUser) {

            return res.json({

                success: false,

                message: "User already exists"

            });

        }

        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        // CREATE USER
        const userdata = await person.create({
            name,
            email,
            number,
            password: hashedPassword

        });
        console.log(userdata,"------------------------")
        res.json({

            success: true,

            message: "Registration successful",

            user: {

                _id: userdata._id,

                name: userdata.name,

                email: userdata.email,

                number: userdata.number

                

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

});
app.post('/loginuser', async (req, res) => {

    try {

        const { email, password } = req.body;

        // FIND USER
        const userdata = await person.findOne({ email });

        if (!userdata) {

            return res.status(401).json({

                success: false,

                message: "User not found"

            });

        }

        // CHECK PASSWORD
        const isMatch = await bcrypt.compare(

            password,
            userdata.password

        );

        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message: "Wrong password"

            });

        }
         
        // CREATE TOKEN
        const token = jwt.sign(

            {
                id: userdata._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        // SUCCESS
        res.json({

            success: true,

            token,

            user: {

                _id: userdata._id,
                name: userdata.name,
                email: userdata.email,
                number: userdata.number

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Server error"

        });

    }

});
app.post("/addtocart",auth,async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing data" });
    }

    console.log("Finding cart for user:", userId);
    let CartData = await Cart.findOne({ userId });
    console.log("Cart found:", CartData);

    if (!CartData) {
      
      CartData = new Cart({
        userId,
        items: [{ productId, quantity: 1 }]
      });
    } else {
      
      const itemIndex = CartData.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        
        CartData.items[itemIndex].quantity += 1;
      } else {
        
        CartData.items.push({ productId, quantity: 1 });
      }
    }

    // ✅ Save cart
    await CartData.save();

    res.status(200).json({
      message: "Product added to cart",
      cart: CartData
    });

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get('/viewcart/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const viewcart = await Cart.findOne({ userId: id })
      .populate('items.productId');

    if (!viewcart) {
      return res.json({ items: [] });
    }

    res.json(viewcart);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
app.delete("/removefromcart", auth, async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing data" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({ message: "Item removed", cart });

  } catch (error) {
    console.error("Remove error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.put("/updatequantity", auth, async (req, res) => {
  try {
    const { userId, productId, action } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    if (action === "increase") {
      cart.items[itemIndex].quantity += 1;
    } 
    else if (action === "decrease") {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        // optional: remove item if quantity = 1
        cart.items.splice(itemIndex, 1);
      }
    }

    await cart.save();

    // ✅ Send updated cart
    res.status(200).json(cart);

  } catch (error) {
    console.error("Update quantity error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get('/checkout/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const selectcart = await Cart.findOne({ userId: id })
      .populate('items.productId');
    console.log("Selected cart:", selectcart);
    if (!selectcart) {
      return res.json({ items: [] });
    }

    res.json(selectcart);

  } catch (error) {
    console.error("Select cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.post('/placeorder', auth, async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    
    const orderData = await order.create({
      userId,
      items,
      totalAmount,
      status: "Booked"
    });

    await Cart.findOneAndDelete({ userId });
    res.json({
      message: "Order placed successfully",
      order: orderData

    });

  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/myorders/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userOrders = await order.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 }); 
    
    res.json(userOrders);
    
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Server error" });
  }

});
app.put("/orders/:id/cancel", auth, async (req, res) => {

  try {

    const orderId = req.params.id;

    const updatedOrder = await Order.findByIdAndUpdate(

      orderId,

      {
        status: "Cancelled"
      },

      {
        new: true
      }

    );

    if (!updatedOrder) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    res.json({

      message: "Order cancelled successfully",

      order: updatedOrder

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});
app.get("/cars/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    console.log("Fetching cars in category:", category);
    const cars = await product.find({ category: category });
    console.log("Cars found:", cars);
    res.json(cars);

  } catch (error) {
    console.error("Fetch cars error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});
app.listen(2000,()=>{
    console.log("you are in 2000 port")
})
    



