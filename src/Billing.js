import React, { useState, useEffect } from 'react';
import "./Billing.css";
import axios from "axios";

function Billing() {
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [date, setdate] = useState(new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [searchName, setSearchName] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [isEditing1, setIsEditing1] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchItems, setSearchItems] = useState([]);
  const [total, setTotal] = useState("0.00");
  const [billinggst, setBillinggst] = useState('');
  const [discount, setDiscount] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/search', { params: { productName: searchName } });
        setSearchItems(response.data);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    }
    fetchData();
  }, [searchName]);

  const calculateTotal = (items) => {
    let totalAmount = 0;
    let totalGst = 0;
    let totalDiscount = 0;

    items.forEach(item => {
      const itemTotal = item.quantity * item.price;
      const gstAmount = itemTotal * (item.billinggst / 100);
      const discountAmount = itemTotal * (item.discount / 100);

      totalAmount += itemTotal + gstAmount - discountAmount;
      totalGst += gstAmount;
      totalDiscount += discountAmount;
    });

    setTotal(totalAmount.toFixed(2));
  };

  const handleAddItem = async () => {
    if (isEditing1) {
      try {
        await axios.put(`/updatebill/${billItems[editIndex]._id}`, { productName, customerName, date, quantity, price, billinggst, discount });
        const updatedProducts = [...billItems];
        updatedProducts[editIndex] = { _id: billItems[editIndex]._id, productName, date, customerName, quantity, price, billinggst, discount };
        setBillItems(updatedProducts);
        calculateTotal(updatedProducts);
        setIsEditing1(false);
        setEditIndex(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      try {
        const response = await axios.post('/addbill', { productName, customerName, date, quantity, price, billinggst, discount });
        const newBillItems = [...billItems, response.data];
        setBillItems(newBillItems);
        calculateTotal(newBillItems);
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
    resetForm();
  };

  const resetForm = () => {
    setProductName('');
    setCustomerName('');
    setQuantity('');
    setPrice('');
    setBillinggst('');
    setDiscount('');
  };

  const handleDeleteBill = async (index) => {
    try {
      await axios.delete(`/deletebill/${billItems[index]._id}`);
      const updatedProducts = [...billItems];
      updatedProducts.splice(index, 1);
      setBillItems(updatedProducts);
      calculateTotal(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditBill = (index) => {
    const item = billItems[index];
    setProductName(item.productName);
    setCustomerName(item.customerName);
    setdate(item.date);
    setQuantity(item.quantity);
    setPrice(item.price);
    setBillinggst(item.billinggst);
    setDiscount(item.discount);
    setIsEditing1(true);
    setEditIndex(index);
  };

  const handleSearch = () => {
    setSearchName(searchName.trim());
  };

  const handleEditProduct = (index) => {
    const product = searchItems[index];
    setProductName(product.productName);
    setQuantity(''); // Clearing quantity if needed
    setPrice(product.price);
    setBillinggst(product.productgst);
    setDiscount(product.productdiscount);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const today = new Date().toLocaleDateString('en-GB');
    printWindow.document.write('<html><head><title>Table Data</title></head><body>');
    printWindow.document.write('<h1>SUPER MARKET</h1>');
    printWindow.document.write('<span>42/Mivahel street, Naduvaikurivhi</span>');
    printWindow.document.write('<h3>Cash Bill</h3>');

    printWindow.document.write('<p>Name:</p>');
    printWindow.document.write('<p>Date:' + today + '</p>');
    printWindow.document.write('<table border="1">');
    printWindow.document.write('<thead><tr><th>Product Name</th><th>Customer Name</th><th>Quantity</th><th>Price</th><th>GST</th><th>Discount</th><th>Total</th></tr></thead>');
    printWindow.document.write('<tbody>');

    let totalAmount = 0;

    billItems.forEach((item) => {
      const itemTotal = (item.quantity * item.price);
      const gstAmount = itemTotal * (item.billinggst / 100);
      const discountAmount = itemTotal * (item.discount / 100);
      const finalTotal = itemTotal + gstAmount - discountAmount;
      totalAmount += finalTotal;
      printWindow.document.write('<tr>');
      printWindow.document.write('<td>' + item.productName + '</td>');
      printWindow.document.write('<td>' + item.customerName + '</td>');
      printWindow.document.write('<td>' + item.quantity + '</td>');
      printWindow.document.write('<td>' + item.price + '</td>');
      printWindow.document.write('<td>' + item.billinggst + '%</td>');
      printWindow.document.write('<td>' + item.discount + '%</td>');
      printWindow.document.write('<td>' + finalTotal.toFixed(2) + '</td>');
      printWindow.document.write('</tr>');
    });

    totalAmount = totalAmount.toFixed(2);
    printWindow.document.write('</tbody>');
    printWindow.document.write('</table>');

    printWindow.document.write('<h3>Total Amount: $' + totalAmount + '</h3>');

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
   
  };



  const handleMessage = () => {
    let message = 'Billing Details:\n\n';

    billItems.forEach((item, index) => {
      message += `Item ${index + 1}:\n`;
      message += `Product Name: ${item.productName}\n`;
      message += `Customer Name: ${item.customerName}\n`;
      message += `Date: ${item.date}\n`;
      message += `Quantity: ${item.quantity}\n`;
      message += `Price: ${item.price}\n`;
      message += `GST: ${item.billinggst}%\n`;
      message += `Discount: ${item.discount}%\n\n`;
    });

    message += `Total Amount: ${total}`;

    const whatsappURL = `https://web.whatsapp.com/send?phone=${PhoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className='billing-parent'>
      <h2 className='billing-heading'>Billing</h2>
      <div className='billing-form'>
        <label className='billing-label'>Product Name:</label>
        <input type='text' id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} className='billing-input' />

        <label className='billing-label'>Customer Name:</label>
        <input type='text' id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className='billing-input' />

        <label className='billing-label'>Phone Number:</label>
        <input type='number' id="PhoneNumber" value={PhoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className='billing-input' />

        <label className='product-label'>
          Date:
          <input type="date" id="date" value={date} onChange={(e) => setdate(e.target.value)} className='product-input' disabled />
        </label>
        <label className='billing-label'>Quantity:</label>
        <input id="quantity" type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)} className='billing-input' />

        <label className='billing-label'>Price:</label>
        <input type='number' step='0.01' id="price" value={price} onChange={(e) => setPrice(e.target.value)} className='billing-input' />

        <label className='billing-label'>GST (%):</label>
        <input type='number' step='0.01' value={billinggst} onChange={(e) => setBillinggst(e.target.value)} className='billing-input' />

        <label className='billing-label'>Discount (%):</label>
        <input type='number' step='0.01' value={discount} onChange={(e) => setDiscount(e.target.value)} className='billing-input' />

        <button onClick={handleAddItem} className='billing-button'>{isEditing1 ? 'Update Product' : 'Add Bill'}</button>
        {isEditing1 && <button onClick={() => { setIsEditing1(false); resetForm(); }} className='billing-button'>Cancel</button>}
      </div>

      <div className='billing-table'>
        <table className='billing-table'>
          <thead>
            <tr>
              <th className='billing-th'>Product Name</th>
              <th className='billing-th'>Customer Name</th>
              <th className='billing-th'>Quantity</th>
              <th className='billing-th'>Price</th>
              <th className='billing-th'>GST (%)</th>
              <th className='billing-th'>Discount (%)</th>
              <th className='billing-th'>Total</th>
              <th className='billing-th'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => {
              const itemTotal = (item.quantity * item.price);
              const gstAmount = itemTotal * (item.billinggst / 100);
              const discountAmount = itemTotal * (item.discount / 100);
              const finalTotal = (itemTotal + gstAmount - discountAmount).toFixed(2);
              return (
                <tr key={index} onClick={() => handleEditBill(index)} className='billing-tr'>
                  <td className='billing-td'>{item.productName}</td>
                  <td className='billing-td'>{item.customerName}</td>
                  <td className='billing-td'>{item.quantity}</td>
                  <td className='billing-td'>{item.price}</td>
                  <td className='billing-td'>{item.billinggst}</td>
                  <td className='billing-td'>{item.discount}</td>
                  <td className='billing-td'>{finalTotal}</td>
                  <td className='billing-td'>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteBill(index); }} className='billing-button'>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <input
        className='search-input'
        type="text"
        name="total"
        placeholder="Total"
        value={total}
        readOnly
      />
      <div className='search-head'>
        <input
          className='search-input'
          type="text"
          name="StudentName"
          placeholder="Search by Product Name"
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
            {searchItems.map((product, index) => {
              const billedItem = billItems.find(item => item.productName === product.productName);
              const availableStock = billedItem ? product.stock - billedItem.quantity : product.stock;
              const displayStock = availableStock <= 0 ? (availableStock === 0 ? 'Out of Stock' : '-1') : availableStock.toFixed(2);

              if (displayStock === '-1') {
                alert('Stock Alert: ' + product.productName + ' is out of stock!');
              }

              return (
                <tr key={index} onClick={() => handleEditProduct(index)} className='product-tr'>
                  <td className='product-td'>{product.productName}</td>
                  <td className='product-td'>{product.category}</td>
                  <td className='product-td'>{product.price}</td>
                  <td className='product-td'>{displayStock}</td>
                  <td className='product-td'>{product.productgst}</td>
                  <td className='product-td'>{product.productdiscount}</td>
                  <td className='product-td'>{product.manufacturer}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button onClick={handlePrint} className='print-button'>Print</button>
        <button onClick={handleMessage} className='print-button'>whatsapp Msg Send`</button>
      </div>
    </div>
  );
}

export default Billing;
