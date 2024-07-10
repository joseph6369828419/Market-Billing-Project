import React, { useState, useEffect } from 'react';
import "./Return.css";
import axios from "axios"

function Return() {
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [date, setdate] = useState(new Date().toISOString().slice(0,10));
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [searchName, setSearchName] = useState('');
  const [returnitems, setreturnItems] = useState([]);
  const [isEditing2, setIsEditing2] = useState(false);
  const [editIndex1, setEditIndex1] = useState(null);
  const [searchItems1, setSearchItems1] = useState([]);
  const[returngst,setreturngst]=useState("");
  const[returndiscount,setreturndiscount]=useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/search', { params: { productName: searchName } });
        setSearchItems1(response.data);
      } catch (error) {
        console.error('Error searching students:', error);
      }
    }
    fetchData();
  }, [searchName]);



  const handleAddreturn = async () => {
    if (isEditing2) {
      try {
        await axios.put(`/updatereturn/${returnitems[editIndex1]._id}`, { productName, customerName,date, quantity, price,returngst,returndiscount});
        const updatedProducts = [...returnitems];
        updatedProducts[editIndex1] = { _id: returnitems[editIndex1]._id, productName, customerName,date, quantity, price,returngst,returndiscount };
        setreturnItems(updatedProducts);
        setIsEditing2(false);
        setEditIndex1(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      // If adding, send a POST request to add a new item
      try {
        const response = await axios.post('/addreturn', { productName, customerName,date, quantity, price,returngst,returndiscount });
        setreturnItems([...returnitems, response.data]);
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
    resetForm();
  };
  

  const resetForm = () => {
    setProductName('');
    setCustomerName('');
    setQuantity(0);
    setPrice(0);

  };

  const handleDeletereturn = async (index) => {
    try {
      await axios.delete(`/deletereturn/${returnitems[index]._id}`);
      const updatedProducts = [...returnitems];
      updatedProducts.splice(index, 1);
      setreturnItems(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditreturn = (index, fromSearch) => {
    const item = returnitems[index];
    setProductName(item.productName);
    setCustomerName(item.customerName);
    setdate(item.date);
    setQuantity(item.quantity);
    setPrice(item.price);
    setreturngst(item.returngst);
    setreturndiscount(item.returndiscount)
    setIsEditing2(true);
    setEditIndex1(fromSearch ? null : index); // Set editIndex to null if editing a search item
  };

  const handleSearch = () => {
    // Trigger search when search button is clicked
    setSearchName(searchName.trim());
  };

  const handleEditProduct1 = async (index) => {
    const product = searchItems1[index];
    setProductName(product.productName);
    setQuantity(''); // Clearing quantity if needed
    setPrice(product.price);
    setreturngst(product.productgst);
    setreturndiscount(product.productdiscount)
    // Update stock in the database if displayStock is '-1'
    
    }
 

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Table Data</title></head><body>');
    printWindow.document.write('<table border="1">');
    printWindow.document.write('<thead><tr><th>ProductName</th><th>CustomerName</th><th>Quantity</th><th>Price</th></tr></thead>');
    printWindow.document.write('<tbody>');
  
    returnitems.forEach((item) => {
      printWindow.document.write('<tr>');
      printWindow.document.write('<td>' + item.productName + '</td>');
      printWindow.document.write('<td>' + item.customerName + '</td>');
      printWindow.document.write('<td>' + item.quantity + '</td>');
      printWindow.document.write('<td>' + item.price + '</td>');
      printWindow.document.write('</tr>');
    });
  
    printWindow.document.write('</tbody></table></body></html>');
    printWindow.document.close();
    printWindow.print();
  };
  

  

  return (
    <div className='billing-parent'>
  <h2 className='billing-heading'>Return</h2>
  <div className='billing-form'>
    <label className='billing-label'>Product Name:</label>
    <input type='text' value={productName} onChange={(e) => setProductName(e.target.value)} className='billing-input' />

    <label className='billing-label'>Customer Name:</label>
    <input type='text' value={customerName} onChange={(e) => setCustomerName(e.target.value)} className='billing-input' />

    <label className='product-label'>
      Date:
      <input type="date" value={date} onChange={(e) => setdate(e.target.value)}className='product-input' disabled />
    </label>
    <label className='billing-label'>Quantity:</label>
    <input id="quantityInput" type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)} className='billing-input' />

    <label className='billing-label'>Price:</label>
    <input type='number' step='0.01' value={price} onChange={(e) => setPrice(e.target.value)} className='billing-input' />


    <label className='billing-label'>GST (%):</label>
        <input type='number' step='0.01' value={returngst} onChange={(e) => setreturngst(e.target.value)} className='billing-input' />

        <label className='billing-label'>Discount (%):</label>
        <input type='number' step='0.01' value={returndiscount} onChange={(e) => setreturndiscount(e.target.value)} className='billing-input' />

    <button onClick={handleAddreturn} className='billing-button'>{isEditing2 ? 'Update Product' : 'Add Bill'}</button>
    {isEditing2 && <button onClick={() => { setIsEditing2(false); resetForm(); }} className='billing-button'>Cancel</button>}
  </div>

  <div className='billing-table'>
    <table className='billing-table'>
      <thead>
        <tr>
          <th className='billing-th'>Product Name</th>
          <th className='billing-th'>Customer Name</th>
          <th className='billing-th'>Quantity</th>
          <th className='billing-th'>Price</th>
          <th className='billing-th'>GST</th>
          <th className='billing-th'>Discount</th>
          <th className='billing-th'>Total</th>
          <th className='billing-th'>Action</th>
          
        </tr>
      </thead>
      <tbody>
        {returnitems.map((item, index) => (
          <tr key={index} onClick={() => handleEditreturn(index)} className='billing-tr'>
            <td className='billing-td'>{item.productName}</td>
            <td className='billing-td'>{item.customerName}</td>
            <td className='billing-td'>{item.quantity}</td>
           
            <td className='billing-td'>{(item.quantity * item.price).toFixed(2)}</td>
            <td className='billing-td'>{item.returngst}</td>
            <td className='billing-td'>{item.returndiscount}</td>
            
            <td className='billing-td'>
              <button onClick={(e) => { e.stopPropagation(); handleDeletereturn(index); }} className='billing-button'>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
<div className='search-head'>
  <input
    className='search-input'
    type="text"
    name="StudentName"
    placeholder="Search by Student Name"
    value={searchName}
    onChange={(e) => setSearchName(e.target.value)}
    required
  />
  <button onClick={handleSearch} className='search-button'>Search</button>

  <table className='product-table'>
    <thead>
      <tr>
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
    <tbody>
      {searchItems1.map((product, index) => {
        // Find the corresponding item in returnitems array
        const billedItem1 = returnitems.find(item => item.productName === product.productName);
        // Calculate available stock if the item is already billed, otherwise use total stock
        const availableStock2 = billedItem1 ? product.stock + billedItem1.quantity : product.stock;
        // Determine the display text for available stock
        const displayStock1 = availableStock2 <= 0 ? (availableStock2 === 0 ? 'Out of Stock' : '-1') : availableStock2.toFixed(2);
        // If available stock is -1, show an alert box
        if (displayStock1 === '-1') {
          alert('Stock Alert: ' + product.productName + ' is out of stock!');
        }
        return (
          <tr key={index} onClick={() => handleEditProduct1(index)} className='product-tr'>
            <td className='product-td'>{product.productName}</td>
            <td className='product-td'>{product.category}</td>
            <td className='product-td'>{product.price}</td>
            <td className='product-td'>{displayStock1}</td> {/* Display available stock */}
            <td className='product-td'>{product.productgst}</td>
            <td className='product-td'>{product.productdiscount}</td>
            <td className='product-td'>{product.manufacturer}</td>
          </tr>
        );
      })}
    </tbody>
  </table>

  <button onClick={handlePrint} className='print-button'>Print</button>
  </div>
</div>

  );
}

/*
const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Table Data</title></head><body>');
    printWindow.document.write('<table border="1">');
    printWindow.document.write('<thead><tr><th>ProductName</th><th>CustomerName</th><th>Quantity</th><th>Price</th></tr></thead>');
    printWindow.document.write('<tbody>');
  
    billItems.forEach((item) => {
      printWindow.document.write('<tr>');
      printWindow.document.write('<td>' + item.productName + '</td>');
      printWindow.document.write('<td>' + item.customerName + '</td>');
      printWindow.document.write('<td>' + item.quantity + '</td>');
      printWindow.document.write('<td>' + item.price + '</td>');
      printWindow.document.write('</tr>');
    });
  
    printWindow.document.write('</tbody></table></body></html>');
    printWindow.document.close();
    printWindow.print();
  };
  


*/
export default Return;
