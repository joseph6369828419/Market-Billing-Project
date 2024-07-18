import React, { useState } from 'react';
import axios from 'axios';
import "./Report.css";

function Report() {
  const [products, setProducts] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [currentReport, setCurrentReport] = useState('');

  const handleProductReport = async () => {
    try {
      const response = await axios.get('/productreport'); // Adjust the endpoint as needed
      setProducts(response.data);
      setCurrentReport('products');
    } catch (error) {
      console.error('Error fetching product report:', error);
    }
  };

  const handleDeleteProduct = async (index) => {
    try {
      const product = products[index];
      await axios.delete(`/deletereport/${product._id}`); // Adjust the endpoint as needed
      setProducts(products.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSaleReport = async () => {
    try {
      const response = await axios.get('/salereport'); // Adjust the endpoint as needed
      setBillItems(response.data);
      setCurrentReport('billItems');
    } catch (error) {
      console.error('Error fetching sale report:', error);
    }
  };

  const handleBorrowReport = async () => {
    try {
      const response = await axios.get('/borrowreport'); // Adjust the endpoint as needed
      setTransactions(response.data);
      setCurrentReport('transactions');
    } catch (error) {
      console.error('Error fetching borrow report:', error);
    }
  };

  const handleReturnReport = async () => {
    try {
      const response = await axios.get('/returnreport'); // Adjust the endpoint as needed
      setReturnItems(response.data);
      setCurrentReport('returnItems');
    } catch (error) {
      console.error('Error fetching return report:', error);
    }
  };

  return (
    <div className='Report-parent'>
      <button onClick={handleProductReport}>Product Report</button>
      <button onClick={handleSaleReport}>Sales Report</button>
      <button onClick={handleBorrowReport}>Borrow Report</button>
      <button onClick={handleReturnReport}>Return Report</button>

      {currentReport === 'products' && (
        <div className='table-head'>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Manufacturer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.manufacturer}</td>
                  <td>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(index); }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {currentReport === 'billItems' && (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Customer Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.customerName}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {currentReport === 'transactions' && (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Customer Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Cash Amount</th>
              <th>Remaining Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.productName}</td>
                <td>{transaction.customerName}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.price}</td>
                <td>{transaction.total}</td>
                <td>{transaction.cashAmount}</td>
                <td>{transaction.remainingAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {currentReport === 'returnItems' && (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Customer Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {returnItems.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.customerName}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Report;
