import React, { useState,useEffect } from 'react';
import axios from 'axios';
import "./Product.css"

const ProductForm = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [date, handledateChange] = useState(new Date().toISOString().slice(0,10));
  const [Retailprice, setPrice] = useState("");
  const [price, handlePriceChange1] = useState("");
  const [stock, setStock] = useState("");
  const [manufacturer, setManufacturer] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
 const[productgst,setproductbillinggst]=useState('')
 const[productdiscount,setproductdiscount]=useState('')

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/categories'); // Assuming your API endpoint for categories is '/categories'
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array to ensure this effect runs only once on component mount

   

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };


  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  

  const handlePriceChange = (e) => {
    handlePriceChange1(parseFloat(e.target.value));
  };


  const setPriceChange=(e)=>{
    setPrice(parseFloat(e.target.value));
  }
  const handleStockChange = (e) => {
    setStock(parseInt(e.target.value));
  };

  const handleManufacturerChange = (e) => {
    setManufacturer(e.target.value);
  };

  const handleAddProduct = async () => {
    if (isEditing) {
      try {
        await axios.put(`/updateproduct/${products[editIndex]._id}`, { productName,selectedCategory,date, price,Retailprice, stock, productgst,productdiscount,manufacturer });
        const updatedProducts = [...products];
        updatedProducts[editIndex] = { _id: products[editIndex]._id, productName, selectedCategory,date, price,Retailprice, stock, productgst,productdiscount,manufacturer  };
        setProducts(updatedProducts);
        setIsEditing(false);
        setEditIndex(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }else {
    try {
      // Ensure that productName, category, price, stock, and manufacturer are correctly set
      const response = await axios.post('/addproduct', { productName, selectedCategory,date, price,Retailprice, stock, productgst,productdiscount,manufacturer });
      setProducts([...products, response.data]); // Update products state with the new product
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }
    resetForm();
  };

  const handleEditProduct = (index) => {
    setProductName(products[index].productName);
    setCategory(products[index].selectedCategory);
    setCategory(products[index].date);
    handlePriceChange1(products[index].price);
    setPrice(products[index].Retailprice);
    setStock(products[index].stock);
    setproductbillinggst(products[index].productgst);
    setproductdiscount(products[index].productdiscount);
    setManufacturer(products[index].manufacturer);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteProduct = async (index) => {
    try {
      await axios.delete(`/deleteproduct/${products[index]._id}`);
      const updatedProducts = [...products];
      updatedProducts.splice(index, 1);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setProductName('');
    setCategory('');
    setPrice("");
    handlePriceChange1("");
    setStock(0);
    setManufacturer('');
  };
  

  return (
    <div className='product-parent'>
      <h2>Add Product</h2>
    <label className='product-label'>
      Product Name:
      <input type="text" value={productName} onChange={handleProductNameChange} className='product-input' />
    </label>
    <label className='product-label'>
      Category:
      <select value={selectedCategory} onChange={handleCategoryChange} className='product-select'>
        <option value="">Select Category</option>
        {categories.map(category => (
          <option key={category._id} value={category.categoryName} className='product-option'>
            {category.categoryName}
          </option>
        ))}
      </select>
    </label>

    <label className='product-label'>
      Date:
      <input type="date" value={date} onChange={handledateChange} className='product-input' disabled />
    </label>


    <label className='product-label'>
      Price:
      <input type="number" value={price} onChange={handlePriceChange} className='product-input' />
    </label>
    <label className='product-label'>
     Retail Price:
      <input type="number" value={Retailprice} onChange={setPriceChange} className='product-input' />
    </label>
    <label className='product-label'>
      Stock:
      <input type="number" value={stock} onChange={handleStockChange} className='product-input' />
    </label>
    <label className='product-label'>
      Manufacturer:
      <input type="text" value={manufacturer} onChange={handleManufacturerChange} className='product-input' />
    </label>
    
    <label className='billing-label'>GST (%):</label>
        <input type='number' step='0.01' value={productgst} onChange={(e) => setproductbillinggst(e.target.value)} className='billing-input' />

        <label className='billing-label'>Discount (%):</label>
        <input type='number' step='0.01' value={productdiscount} onChange={(e) => setproductdiscount(e.target.value)} className='billing-input' />
    <button onClick={handleAddProduct} className='product-button'>{isEditing ? 'Update Product' : 'Add Product'}</button>
   
    {isEditing && <button onClick={() => { setIsEditing(false); resetForm(); }} className='product-button'>Cancel</button>}
    <div className='search-head'>
    <table className='product-table'>
      <thead className='product-thead'>
        <tr className='product-tr'>
          <th className='product-th'>Product Name</th>
          <th className='product-th'>Category</th>
          <th className='product-th'>Price</th>
          <th className='product-th'>Stock</th>
         
          <th className='product-th'>GST</th>
          <th className='product-th'>Discount</th>
          <th className='product-th'>Manufacturer</th>
          <th className='product-th'>Actions</th>
        </tr>
      </thead>
      <tbody className='product-tbody'>
        {products.map((product, index) => (
          <tr key={index} onClick={() => handleEditProduct(index)} className='product-tr'>
            <td className='product-td'>{product.productName}</td>
            <td className='product-td'>{product.category}</td>
            <td className='product-td'>{product.price}</td>
            <td className='product-td'>{product.stock}</td>
            <td className='product-td'>{product.productgst}</td>
            <td className='product-td'>{product.productdiscount}</td>
            <td className='product-td'>{product.manufacturer}</td>
            <td className='product-td'>
              <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(index); }} className='product-button'>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  </div>
  );
};

export default ProductForm;
