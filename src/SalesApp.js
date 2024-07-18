import React, { useState, useEffect } from 'react';
import "./SalesApp.css";
import axios from "axios";

function SalesApp() {
    const [transactions, setTransactions] = useState([]);
    const [productName, setProductName] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [date, setdate] = useState(new Date().toISOString().slice(0,10));
    const [quantity, setQuantity] = useState();
    const [price, setPrice] = useState();
    const [cashAmount, setCashAmount] = useState();
    const [isEditing2, setIsEditing2] = useState(false);
    const [editIndex2, setEditIndex2] = useState(null);
    const [salesearchItems, setSaleSearchItems] = useState([]);
    const [salesearchName, setSaleSearchName] = useState('');
    const [salegst, setsalegst] = useState('');
    const [salediscount, setsaleDiscount] = useState('');
    const [saletotal, setsaleTotal] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('/salesearch', { params: { productName: salesearchName } });
                setSaleSearchItems(response.data);
            } catch (error) {
                console.error('Error searching products:', error);
            }
        }
        fetchData();
    }, [salesearchName]);

    const calculateTotal = (quantity, price, gst, discount) => {
        const subtotal = quantity * price;
        const totalGst = (subtotal * gst) / 100;
        const totalDiscount = (subtotal * discount) / 100;
        return subtotal + totalGst - totalDiscount;
    };

    const handleAddCash = async () => {
        const total = calculateTotal(quantity, price, salegst, salediscount);
        const remainingAmount = total - cashAmount;

        if (isEditing2) {
            try {
                await axios.put(`/updatesale/${transactions[editIndex2]._id}`, { productName, customerName,date, quantity, price, salegst, salediscount, cashAmount });
                const updatedTransactions = [...transactions];
                updatedTransactions[editIndex2] = { _id: transactions[editIndex2]._id, productName, customerName,date, quantity, price, salegst, salediscount, cashAmount, total, remainingAmount };
                setTransactions(updatedTransactions);
                setIsEditing2(false);
                setEditIndex2(null);
            } catch (error) {
                console.error('Error updating product:', error);
            }
        } else {
            try {
                const response = await axios.post('/addsale', { productName, customerName,date, quantity, price, salegst, salediscount, cashAmount });
                setTransactions([...transactions, { ...response.data, total, remainingAmount }]);
            } catch (error) {
                console.error('Error adding product:', error);
            }
        }

        setProductName('');
        setCustomerName('');
        setQuantity(0);
        setPrice(0);
        setCashAmount(0);
        setsalegst('');
        setsaleDiscount('');
    };

    const handleEditsales = (index) => {
        const transaction = transactions[index];
        setProductName(transaction.productName);
        setCustomerName(transaction.customerName);
        setdate(transaction.date);
        setQuantity(transaction.quantity);
        setPrice(transaction.price);
        setCashAmount(transaction.cashAmount);
        setsalegst(transaction.salegst);
        setsaleDiscount(transaction.salediscount);
        setIsEditing2(true);
        setEditIndex2(index);
    };

    const resetForm = () => {
        setProductName('');
        setCustomerName('');
        setQuantity(0);
        setPrice(0);
        setCashAmount(0);
        setsalegst('');
        setsaleDiscount('');
    };

    const handleEditsale = (index) => {
        const product = salesearchItems[index];
        setProductName(product.productName);
        setQuantity(0);
        setPrice(product.price);
        setsalegst(product.productgst);
        setsaleDiscount(product.productdiscount);
    };

    const handleSaleSearch = () => {
        setSaleSearchName(salesearchName.trim());
    };

    useEffect(() => {
        const totalAmount = transactions.reduce((acc, transaction) => acc + transaction.total, 0);
        setsaleTotal(totalAmount);
    }, [transactions]);
// Calculate remaining amount based on total sales and cash amount
const remainingAmount = saletotal - transactions.reduce((acc, curr) => acc + curr.cashAmount, 0);

    return (
        <div className='parent-sales'>
            <h1 className='sales-heading'>Sales Management</h1>
            <div className='sales-inputs'>
                <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} className='sales-input' />
                <input type="text" placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className='sales-input' />
                <label className='product-label'>
      Date:
      <input type="date" value={date} onChange={(e) => setdate(e.target.value)}className='product-input' disabled />
    </label>
                <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className='sales-input' />
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} className='sales-input' />
                <label className='billing-label'>GST (%):</label>
                <input type='number' step='0.01' value={salegst} onChange={(e) => setsalegst(e.target.value)} className='billing-input' />
                <label className='billing-label'>Discount (%):</label>
                <input type='number' step='0.01' value={salediscount} onChange={(e) => setsaleDiscount(e.target.value)} className='billing-input' />
                <input type="number" placeholder="Cash Amount" value={cashAmount} onChange={(e) => setCashAmount(parseInt(e.target.value))} className='sales-input' />
                <button onClick={handleAddCash} className='sales-button'>{isEditing2 ? 'Update Product' : 'Add Bill'}</button>
                {isEditing2 && <button onClick={() => { setIsEditing2(false); resetForm(); }} className='sales-button'>Cancel</button>}
            </div>
            <table className='sales-table'>
                <thead>
                    <tr>
                        <th className='sales-th'>Product Name</th>
                        <th className='sales-th'>Customer Name</th>
                        <th className='sales-th'>Quantity</th>
                        <th className='sales-th'>Price</th>
                        <th className='sales-th'>Total</th>
                        <th className='product-th'>GST</th>
                        <th className='product-th'>Discount</th>
                        <th className='sales-th'>Cash Amount</th>
                        <th className='sales-th'>Remaining Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index} onClick={() => handleEditsales(index)} className='sales-tr'>
                            <td className='sales-td'>{transaction.productName}</td>
                            <td className='sales-td'>{transaction.customerName}</td>
                            <td className='sales-td'>{transaction.quantity}</td>
                            <td className='sales-td'>{transaction.price}</td>
                            <td className='sales-td'>{transaction.total}</td>
                            <td className='sales-td'>{transaction.salegst}</td>
                            <td className='sales-td'>{transaction.salediscount}</td>
                            <td className='sales-td'>{transaction.cashAmount}</td>
                            <td className='sales-td'>{transaction.remainingAmount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <input className='search-input' type="text" name="remainingAmount" placeholder="Remaining Amount" value={remainingAmount.toFixed(2)} readOnly />
            <div className='search-head'>
            <input className='search-input' type="text" name="StudentName" placeholder="Search by Product Name" value={salesearchName} onChange={(e) => setSaleSearchName(e.target.value)} required />
            <button onClick={handleSaleSearch} className='search-button'>Search</button>
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
                    </tr>
                </thead>
                <tbody>
                    {salesearchItems.map((product, index) => {
                        const billedItem = transactions.find(item => item.productName === product.productName);
                        const availableStock = billedItem ? product.stock - billedItem.quantity : product.stock;
                        const displayStock = availableStock <= 0 ? (availableStock === 0 ? 'Out of Stock' : '-1') : availableStock.toFixed(2);
                        if (displayStock === '-1') {
                            alert('Stock Alert: ' + product.productName + ' is out of stock!');
                        }
                        return (
                            <tr key={index} onClick={() => handleEditsale(index)} className='product-tr'>
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
        </div>
        </div>
    );
}

export default SalesApp;
