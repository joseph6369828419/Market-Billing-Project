import React, { useState } from 'react';
import './ScannerCode.css';

function ScannerCode() {
  const [isChecked, setIsChecked] = useState(false);
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [gpay, setGpay] = useState(6369828419);
  const [upi, setUpi] = useState("tamilanjoseph12109@okaxis");

  const handleWhatsAppSend = () => {
    let message = 'Account Details:\n\n';
    message += `G pay Number: ${gpay}\n\n`;
    message += `Choose anyone the Online Payment Send the Money\n\n`;
    message += `UPI Id: ${upi}\n`;

    const whatsappURL = `https://web.whatsapp.com/send?phone=${PhoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  
  return (
    <div className='ScannerCode-parent'>
      <h1 className='scanner-letter'>Online Payment Process</h1>
      <div className='scanner-head'>
        <label className='scanner-label'>Customer Phone Number:</label>
        <input
          type='number'
          className="scanner-number"
          value={PhoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <label className='scanner-label'>Business Gpay Number:</label>
        <input
          type='number'
          value={gpay}
          onChange={(e) => setGpay(e.target.value)}
          className='scanner-number'
          readOnly
        />
        <label className='scanner-label'>Business UPI Id:</label>
        <input
          type='text'
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          className='scanner-number'
          readOnly
        />
      </div>
      <input
        className='scanner-check'
        type="checkbox"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      /><br />
      {isChecked && (
        <img className='scanner-image' src="/scannerimage.jfif" alt="Scanner Code" />
      )}
      <button className="scanner-btn" onClick={handleWhatsAppSend}>Send WhatsApp</button>
     
    </div>
  );
}

export default ScannerCode;
