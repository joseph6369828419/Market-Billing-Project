import React from "react"
import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom"
import Login from "./Login"
import Product from "./Product"
import Category from "./Category"
import Billing from "./Billing"
import SalesApp from"./SalesApp"
import Report from "./Report"
import Return from "./Return"
import Dashboard from "./Dashboard"
import "./App.css"


function App(){
return(
<div className="app-parent">

<Router>

<Link className="login"to="/dashboard">Dashboard</Link>
<Link className="login"to="/product">Product</Link>
<Link className="login"to="/billing">Billing</Link>
<Link className="login"to="/category">Category</Link>
<Link className="login"to="/SalesApp">Borrow</Link>
<Link className="login"to="/report">Report</Link>
<Link className="login"to="/return">Return</Link>
<Routes>
<Route path="/" element={<Login></Login>}></Route>
<Route path="/product" element={<Product></Product>}></Route>
<Route path="/billing" element={<Billing></Billing>}></Route>
<Route path="/category" element={<Category></Category>}></Route>
<Route path="/salesapp" element={<SalesApp></SalesApp>}></Route>
<Route path="/report" element={<Report></Report>}></Route>
<Route path="/return" element={<Return></Return>}></Route>
<Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
</Routes>

</Router>

</div>

)

}
export default App