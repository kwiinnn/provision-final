import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
// Move your CSS imports here so they apply globally
import './middle.css';
import './right.css';
import './content.css';

function Layout() {
    return (
    // The outer wrapper class goes here
    <div className="bigdiv">
        
      {/* Sidebar stays fixed on the left */}
        <Sidebar />

      {/* The "Outlet" renders whatever page you are on (Bigdiv) */}
        <Outlet /> 
    
    </div>
    );
}

export default Layout;