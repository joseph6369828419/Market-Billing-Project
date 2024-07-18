const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB and Product model
mongoose.connect('mongodb://127.0.0.1/market', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const productSchema = new mongoose.Schema({
  productName: String,
  category: String,
  date:Date,
  price: Number,
  Retailprice:Number,
  stock: Number,
  productgst:Number,
  productdiscount:Number,
  manufacturer: String
});

const productSchema1 = new mongoose.Schema({
  categoryName: { type: String, required: true },
  
});

const productSchema2 = new mongoose.Schema({
  productName: String,
  customerName: String,
  date:Date,
  quantity: Number,
  price: Number,
  billinggst: Number,
  discount:Number
});
const productSchema3 = new mongoose.Schema({
  productName: String,
  customerName: String,
  date:Date,
  quantity: Number,
  price: Number,
  salegst:Number,
  salediscount:Number,
  cashAmount: Number
});
const productSchema4 = new mongoose.Schema({
  productName: { type: String, required: true },
  customerName: { type: String, required: true },
  date: { type: Date, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  returngst: { type: Number, required: true },
  returndiscount: { type: Number, required: true },

});


const Product = mongoose.model('Product', productSchema);

const Category = mongoose.model('category', productSchema1);
const Bill = mongoose.model('bill', productSchema2);
const Sale = mongoose.model('sale', productSchema3);
const Return = mongoose.model('return', productSchema4);


app.get('/dashreport', async (req, res) => {
  try {
    const products = await Product.find();
    const productNameCounts = products.reduce((acc, product) => {
      acc[product.name] = (acc[product.name] || 0) + 1;
      return acc;
    }, {});
    res.status(200).json(productNameCounts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});


app.get('/dashsalereport', async (req, res) => {
  try {
    const bills = await Bill.find();
    
    // Calculate total bill count and sum of bill values
    const totalBills = bills.length;
    const totalBillValue = bills.reduce((acc, bill) => acc + bill.total, 0);
    
    res.status(200).json({ totalBills, totalBillValue, bills });
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Error fetching bills' });
  }
});

app.get('/dashreturnreport', async (req, res) => {
  try {
    const shiows = await Return.find();
    
    // Calculate total shiow count and sum of shiow values
    const totalShiows = shiows.length;
    const totalShiowValue = shiows.reduce((acc, shiow) => acc + shiow.total, 0);
    
    // Count the number of documents
    const shiowCount = await Return.countDocuments();

    res.status(200).json({ totalShiows, totalShiowValue, shiowCount, shiows });
  } catch (error) {
    console.error('Error fetching shiows:', error);
    res.status(500).json({ error: 'Error fetching shiows' });
  }
});
app.get('/dashborrowreport', async (req, res) => {
  try {
    const sales = await Sale.find();
    
    // Calculate total shiow count and sum of shiow values
    const totalSale = sales.length;
    const totalSaleValue = sales.reduce((acc, sale) => acc + sale.total, 0);
    
    // Count the number of documents
    const saleCount = await Return.countDocuments();

    res.status(200).json({ totalSale, totalSaleValue, saleCount, sales });
  } catch (error) {
    console.error('Error fetching shiows:', error);
    res.status(500).json({ error: 'Error fetching shiows' });
  }
});




app.get('/productreport', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

app.delete('/deletereport/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

app.get('/salereport', async (req, res) => {
  try {
    const bill = await Bill.find();
    res.status(200).json(bill);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});
app.get('/borrowreport', async (req, res) => {
  try {
    const sale = await Sale.find();
    res.status(200).json(sale);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});
app.get('/returnreport', async (req, res) => {
  try {
    const return1 = await Return.find();
    res.status(200).json(return1);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});





app.post('/addproduct', async (req, res) => {
  try {
    const { productName, category,date, price,Retailprice, stock,productgst,productdiscount, manufacturer } = req.body;
    const newProduct = new Product({ productName, category,date, price,Retailprice, stock,productgst,productdiscount, manufacturer });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Error saving product' });
  }
});







app.put('/updateproduct/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.productName = req.body.productName;
    product.category = req.body.category;
    product.date = req.body.date;
    product.price = req.body.price;
    product.Retailprice = req.body.Retailprice;
    product.stock = req.body.stock;
    product.productgst = req.body.productgst;
    product.productdiscount = req.body.productdiscount;

    product.manufacturer = req.body.manufacturer;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/deleteproduct/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get('/search', async (req, res) => {
  const { productName } = req.query;
  try {
    const filteredStudents = await Product.find({ productName: { $regex: new RegExp(productName, 'i') } });
    res.json(filteredStudents);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get('/salesearch', async (req, res) => {
  const { productName } = req.query;
  try {
    const filteredStudents = await Product.find({ productName: { $regex: new RegExp(productName, 'i') } });
    res.json(filteredStudents);
  } catch (err) {
    res.status(500).send(err);
  }
});


app.post('/addsale', async (req, res) => {
  try {
    const { productName, customerName,date, quantity, price,salegst,salediscount,cashAmount } = req.body;

    // Find the product in the database by its name
    const product = await Product.findOne({ productName });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the display stock by decrementing the quantity
    product.stock -= quantity;
    await product.save();

    // Create a new bill
    const sale = new Sale({
      productName,
      customerName,
      date,
      quantity,
      price,
      salegst,
      salediscount,
      cashAmount
    });

    // Save the new bill
    const newsale = await sale.save();

    // Return the newly created bill
    res.status(201).json(newsale);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/updatesale/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, customerName,date, quantity, price, salegst, salediscount, cashAmount } = req.body;

    const sale = await Sale.findById(id);

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    sale.productName = productName;
    sale.customerName = customerName;
    sale.date = date;
    sale.quantity = quantity;
    sale.price = price;
    sale.salegst = salegst;
    sale.salediscount = salediscount;
    sale.cashAmount = cashAmount;

    await sale.save();

    res.status(200).json(sale);
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.delete('/deletesale/:id', async (req, res) => {
  try {
    // Find the sale by ID and delete it
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);
    if (!deletedSale) {
      return res.status(404).json({ message: 'Sale not found' });
    }
    res.json({ message: 'Sale deleted', deletedSale });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/addbill', async (req, res) => {
  try {
    const { productName, customerName,date, quantity, price, billinggst,
      discount } = req.body;

    // Find the product in the database by its name
    const product = await Product.findOne({ productName });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the display stock by decrementing the quantity
    product.stock -= quantity;
    await product.save();

    // Create a new bill
    const bill = new Bill({
      productName,
      customerName,
      date,
      quantity,
      price,
      billinggst,
      discount
    });

    // Save the new bill
    const newBill = await bill.save();

    // Return the newly created bill
    res.status(201).json(newBill);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.put('/updatebill/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (bill == null) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    bill.productName = req.body.productName;
    bill.customerName = req.body.customerName;
    bill.date = req.body.date;
    bill.quantity = req.body.quantity;
    bill.price = req.body.price;
    bill.billinggst = req.body.billinggst;
    bill.discount = req.body.discount;

    const updatedBill = await bill.save();
    res.json(updatedBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.delete('/deletebill/:id', async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});











app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




app.post('/addcategory', async (req, res) => {
  const category = new Category({
    categoryName: req.body.categoryName,
    
  });

  try {
    const newcategory = await category.save();
    res.status(201).json(newcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/updatecategory/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.categoryName = req.body.categoryName;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/deletecategory/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.post('/addreturn', async (req, res) => {
  try {
    const { productName, customerName,date, quantity, price,returngst,returndiscount } = req.body;

    // Find the product in the database by its name
    const product = await Product.findOne({ productName });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the display stock by incrementing the quantity
    product.stock += parseInt(quantity, 10);
    await product.save();

    // Create a new return record
    const return1 = new Return({
      productName,
      customerName,
      date,
      quantity: parseInt(quantity, 10), // Ensure quantity is stored as an integer
      price,
      returngst,
      returndiscount
    });

    // Save the new return record
    const newreturn1 = await return1.save();

    // Return the newly created return record
    res.status(201).json(newreturn1);
  } catch (error) {
    console.error('Error adding product return:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






app.put('/updatereturn/:id', async (req, res) => {
  try {
    const return1 = await Return.findById(req.params.id);
    if (return1 == null) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    return1.productName = req.body.productName;
    return1.customerName = req.body.customerName;
    return1.date = req.body.date;
    return1.quantity = req.body.quantity;
    return1.price = req.body.price;
    return1.returngst = req.body.returngst;
    return1.returndiscount = req.body.returndiscount;

    const updatedreturn1 = await return1.save();
    res.json(updatedreturn1);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


app.delete('/deletereturn/:id', async (req, res) => {
  try {
    await Return.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});







// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
