import { NavLink, useLocation } from 'react-router-dom'; 
import './index.css';

// ✅ IMPORT IMAGES HERE
import logoImg from './assets/provisionlogo.png';
import bellImg from './assets/bell.png';
import homeImg from './assets/home.png';
import msgImg from './assets/speechbubble.png';
import ordersImg from './assets/orders.png';
import statsImg from './assets/Bar Chart.svg';
import exitImg from './assets/exit.png';

function Sidebar() {
    const location = useLocation();
    
    const checkActive = (path) => {
        return location.pathname === path ? "nav-item active" : "nav-item";
    };

    return (
        <div className="sidebar">
            <div className="logo">
                {/* Use the imported variable, NOT the string string */}
                <img src={logoImg} alt="logo"/>
            </div>
            
            <div className="notifs">
                <div className="number"><p>3</p></div>
                <img src={bellImg} className="bell" alt="notifications"/>
            </div>

            <NavLink to="/" className={checkActive("/")}>
                <img src={homeImg} alt="home" />
                <p>Home</p>
            </NavLink>

            <NavLink 
                to="/messages" 
                className={checkActive("/messages")}
                state={{ background: location }} 
            >
                <img src={msgImg} alt="messages" />
                <p>Messages</p>
            </NavLink>

            <NavLink to="/orders" className={checkActive("/orders")}>
                <img src={ordersImg} alt="orders" />
                <p>Orders</p>
            </NavLink>

            <NavLink to="/statistics" className={checkActive("/statistics")}>
                <img src={statsImg} alt="stats" />
                <p>Statistics</p>
            </NavLink>

            <div className="exit">
                <img src={exitImg} alt="exit" />
            </div>
        </div>
    );
}

export default Sidebar;