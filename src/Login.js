import React, { useState } from 'react';
import "./Login.css";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const[error,seterror]=useState("");
  const navigate=useNavigate();

  const handleClear = () => {
    setUsername("");
    setPassword("");
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handlesubmit =()=>{
    if(username==="joseph"&&password==="1234"){
navigate("/dashboard")

    }
    else{
      seterror("Password Incorrect")

    }
  }
  return (
    <>
      
        <div className="login-parent">
        {isVisible && (
          <div className='login-child'>
            <h1 className='login-letter'>SUPER MARKET</h1>
            <div className='input-head'>
              <input className='in1' type="text" placeholder='UserName' value={username} onChange={(e) => setUsername(e.target.value)} />
              <input className="in2" type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <p className='error'>{error}</p>    
            <div className='btn-head'>
              <button className='btn1' onClick={handlesubmit}>Submit</button>
              <button className='btn2' onClick={handleClear}>Clear</button>
            </div>
            <button className='close' onClick={handleClose}>Close</button>
          </div>
          )}
        </div>
     
    </>
  );
}

export default Login;
