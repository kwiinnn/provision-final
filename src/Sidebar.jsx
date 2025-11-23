import { NavLink, useLocation } from 'react-router-dom'; 
import './index.css';

function Sidebar() {
    const location = useLocation();
    
    // Helper to check active state
    // We check if the current path matches the link's destination
    const checkActive = (path) => {
        return location.pathname === path ? "nav-item active" : "nav-item";
    };

    return (
        <div className="sidebar">
            <div className="logo">
                <img src="src/assets/provisionlogo.png" alt="logo"/>
            </div>
            
            <div className="notifs">
                <div className="number"><p>3</p></div>
                <img src="src/assets/bell.png" className="bell" alt="notifications"/>
            </div>

            <NavLink to="/" className={checkActive("/")}>
                <img src="src/assets/home.png" alt="home" />
                <p>Home</p>
            </NavLink>

            {/* Messages Link with Background State */}
            <NavLink 
                to="/messages" 
                className={checkActive("/messages")}
                state={{ background: location }} 
            >
                <img src="src/assets/speechbubble.png" alt="messages" />
                <p>Messages</p>
            </NavLink>

            <NavLink to="/orders" className={checkActive("/orders")}>
                <img src="src/assets/orders.png" alt="orders" />
                <p>Orders</p>
            </NavLink>

            <NavLink to="/statistics" className={checkActive("/statistics")}>
                <img src="src/assets/Bar Chart.svg" alt="stats" />
                <p>Statistics</p>
            </NavLink>

            <div className="exit">
                <img src="src/assets/exit.png" alt="exit" />
            </div>
        </div>
    );
}

export default Sidebar;