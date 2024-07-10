import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Dashboard.css";

function Dashboard() {
  const [productCounts, setProductCounts] = useState(null);
  const [totalBills, setTotalBills] = useState(0);
 
  const [reportData, setReportData] = useState(null);
  const[salereport,setsalereport]=useState()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, saleResponse, returnResponse,borrowResponse] = await Promise.all([
          axios.get('/dashreport'),
          axios.get('/dashsalereport'),
          axios.get('/dashreturnreport'),
          axios.get('./dashborrowreport')

        ]);
        setProductCounts(productResponse.data);
        setTotalBills(saleResponse.data.totalBills);
      
        setReportData(returnResponse.data);
        setsalereport(borrowResponse.data)
     
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className='dashboard-parent'><h1>Loading...</h1></div>;
  }

  if (error) {
    return <div className='dashboard-parent'><h1>{error}</h1></div>;
  }

  return (
    <div className='dashboard-parent'>
      <h1>Dashboard</h1>
      <div className='dash-back'>
        <h5 className='add-product'>Add Product</h5>
        <div className='sale-head'>
          <h5 className='sale-child'>Sales </h5>
          <p className='sale-colour'>{totalBills}</p>
         
          
        </div>
        <div className='return-head'>
          <p className='return-color'>Return </p>
          <p className='return-child'>{reportData.totalShiows}</p>
          
          
          {/* Render other data as needed */}
        </div>
        <div className='borrow-head'>
          <p className='borrow-color'> Borrow </p>
          <p className='borrow-child'>{salereport.totalSale}</p>
          
          
          {/* Render other data as needed */}
        </div>
        {Object.keys(productCounts).length > 0 ? (
          Object.keys(productCounts).map(productName => (
            <p className='count-font' key={productName}>
               {productCounts[productName]}
            </p>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
