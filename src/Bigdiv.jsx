import React, { useState } from 'react'; 
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Note: CSS imports were moved to Layout.jsx, but keeping them here doesn't hurt.
import './middle.css';
import './right.css';
import './content.css';

const initialForecastData = [
    { name: 'Nov', year: '2024', sales: 4500, production: 2000, inventory: 4400 },
    { name: 'Dec', year: '2024', sales: 5200, production: 1500, inventory: 700 },
    { name: 'Jan', year: '2025', sales: 1200, production: 1500, inventory: 1000 },
    { name: 'Feb', year: '2025', sales: 1100, production: 1500, inventory: 1400 },
    { name: 'Mar', year: '2025', sales: 1400, production: 1600, inventory: 1600 },
    { name: 'Apr', year: '2025', sales: 1800, production: 2000, inventory: 1800 },
    { name: 'May', year: '2025', sales: 2200, production: 2200, inventory: 1800 },
    { name: 'Jun', year: '2025', sales: 2500, production: 2000, inventory: 1300 },
    { name: 'Jul', year: '2025', sales: 2100, production: 2500, inventory: 1700 },
    { name: 'Aug', year: '2025', sales: 1900, production: 3000, inventory: 2800 },
    { name: 'Sep', year: '2025', sales: 2200, production: 3800, inventory: 4400 },
];

const updateData = [
    { category: "Inventory", action: "Reorder", item: "Containers", date: "Nov 25, 2025", tag: "URGENT", tagColor: "red" },
    { category: "Production", action: "Produce", item: "Cacao Tablea", date: "Nov 30, 2025", tag: "IMPORTANT", tagColor: "yellow" },
    { category: "Inventory", action: "Reorder", item: "Sugar", date: "Dec 01, 2025", tag: "IMPORTANT", tagColor: "yellow" },
    { category: "Supplier", action: "In Transit", item: "Raw Cocoa", date: "Dec 05, 2025", tag: "UPDATE", tagColor: "gray" },
];

const suppliersData = [
    { name: "Supplier 1", item: "Raw Cacao", qty: "100kls", price: "₱5,000", status: "IN TRANSIT", color: "green" },
    { name: "Supplier 2", item: "Raw Ingredient", qty: "10 sacks", price: "₱10,000", status: "IN PRODUCTION", color: "orange" },
    { name: "Supplier 3", item: "Packaging", qty: "500 pcs", price: "₱2,500", status: "PENDING", color: "gray" },
];

const salesData = [
    { name: "Item 1", sold: "1.5k sold", trend: "up" },
    { name: "Item 2", sold: "956 sold", trend: "down" },
    { name: "Item 3", sold: "1.1k sold", trend: "up" },
    { name: "Item 4", sold: "200 sold", trend: "up" },
];

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const calendarDays = ["", "", "", "", "", "", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, "", "", "", "", "", ""];

const CustomAxisTick = ({ x, y, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="middle" fill="#FFFFFF" fontSize={11} fontFamily="Poppins">
                {payload.value}
            </text>
        </g>
    );
};

function Bigdiv(){
    const [chartValues, setChartValues] = useState(initialForecastData);
    const [loading, setLoading] = useState(false);

    const fetchGrokData = async () => {
        setLoading(true);
        const API_KEY = "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"; 
        const prompt = `
            Generate a JSON array for a supply chain forecast (Nov to Sep).
            Strictly follow this JSON structure (Keys: "name", "sales", "production", "inventory").
            Base your logic on this real pattern:
            - High Sales (4000-5500) should cause Inventory to crash below 1000.
            - Low Sales (1000-2000) allow Inventory to recover.
            - Production should lag slightly behind sales trends.
            Return ONLY the raw JSON string array. No markdown.
        `;

        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'Dashboard App',
                },
                body: JSON.stringify({
                    model: "x-ai/grok-4.1-fast", 
                    messages: [
                        { role: "system", content: "You are a data simulator. Output valid JSON only." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.5 
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorData}`);
            }

            const data = await response.json();
            let jsonString = data.choices[0].message.content;
            jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
            
            const parsedData = JSON.parse(jsonString);
            setChartValues(parsedData);

        } catch (error) {
            console.error("Error fetching from Grok:", error);
            alert("Failed to fetch new data. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return(
        // --- START CONTENT DIRECTLY (Outer wrappers removed) ---
        <div className="content">
            <div className="middle">
                <div className="top-part">
                    <div className="mid-left">
                        <div className="welcome-container">
                            <p className="greet">Welcome,&nbsp;</p>
                            <p className="name">Company Name</p>
                        </div>
                        <div className="dashboard-text">Dashboard</div>
                    </div>
                    <div className="mid-right">
                        <div className="company">
                            <p className="companyName">Company Name</p>
                            <p className="profile">Profile</p>
                        </div>
                        <img className="profile-pic" src="src/assets/profile.png" alt="profile"/>
                    </div>
                </div>

                <div className="infos">
                    <div className="inventory">
                        <div className="inventory-text">
                            <p className="inven">Inventory</p>
                            <p className="view-all1">View All &gt;</p>
                        </div>
                        <div className="invenRow1">
                            <div className="totalItems"><img className="box-icon" src="src/assets/box-icon.png" alt=""/><p className="totalItems-text">Total Items</p><p className="totalItems-num">256</p><p className="across">across 4 products</p></div> 
                            <div className="totalValue"><img className="box-icon" src="src/assets/box-icon.png" alt=""/><p className="totalValue-text">Total Value</p><p className="totalValue-num">$69,420.67</p><p className="current-inven-value">Current Inventory Value</p></div>
                        </div>
                        <div className="invenRow2">
                            <div className="lowStock"><img className="box-icon" src="src/assets/box-icon.png" alt=""/><p className="lowStock-text">Low Stock Items</p><p className="lowStock-num">3</p><p className="stocks-status">Needs Restocking</p></div>
                            <div className="categories"><img className="box-icon" src="src/assets/box-icon.png" alt=""/><p className="categories-text">Categories</p><p className="categories-num">6</p><p className="product-categories">Product Categories</p></div>
                        </div>
                    </div>

                    <div className="suppliers">
                        <div className="suppliers-text">
                            <p className="supply">Suppliers</p>
                            <p className="view-all2">View All &gt;</p>
                        </div>
                        <div className="supplier-list-container">
                            {suppliersData.map((supplier, index) => (
                                <div className="supplier-card" key={index}>
                                    <div className="card-header">
                                        <span className="supp-name">{supplier.name}</span>
                                        <span className={`status-pill ${supplier.color}`}>{supplier.status}</span>
                                    </div>
                                    <div className="item-name">{supplier.item}</div>
                                    <div className="item-details">qty: {supplier.qty} <br/>price: {supplier.price}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="sales-and-forecast">
                    <div className="sales">
                        <div className="sales-header">
                            <p className="sales-title">Sales</p>
                            <p className="view-all-sales">View all &gt;</p>
                        </div>
                        <div className="sales-list-container">
                            {salesData.map((item, index) => (
                                <div className="sales-card" key={index}>
                                    <div className="sales-info">
                                        <p className="sales-item-name">{item.name}</p>
                                        <p className="sales-count">{item.sold}</p>
                                    </div>
                                    <div className="sales-icon">
                                        <img src="src/assets/Trend-up.png" className={`arrow-img ${item.trend === 'down' ? 'flipped' : ''}`} alt="trend" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="forecast">
                        <div className="forecast-header">
                            <p className="forecast-title">Forecast</p>
                            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                <button 
                                    onClick={fetchGrokData}
                                    disabled={loading}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.15)',
                                        color: '#E3EF26',
                                        border: '1px solid #E3EF26',
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        opacity: loading ? 0.5 : 1
                                    }}
                                >
                                    {loading ? 'Thinking...' : '✨ ProVision AI'}
                                </button>
                                <p className="view-all-forecast">View all &gt;</p>
                            </div>
                        </div>

                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartValues} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                                    <CartesianGrid vertical={false} stroke="rgba(255,255,255, 0.1)" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={<CustomAxisTick />} 
                                        interval={0}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0C342C', borderRadius: '10px', border: 'none' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: 'Poppins', color: '#fff' }}/>
                                    <Line type="monotone" name="Inventory" dataKey="inventory" stroke="#EBB744" strokeWidth={3} dot={{ r: 0 }} activeDot={{ r: 6 }} />
                                    <Line type="monotone" name="Production" dataKey="production" stroke="#A0C0B8" strokeWidth={3} dot={false} />
                                    <Line type="monotone" name="Sales" dataKey="sales" stroke="#E3EF26" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            <div className="right">
                <p className="timeline-text">Timeline</p>
                <div className="timeline-calendar">
                    <div className="cal-header">
                        <span className="arrow">&lt;</span><span className="month-year">November 2025</span><span className="arrow">&gt;</span>
                    </div>
                    <div className="cal-days-row">{daysOfWeek.map(d => <div key={d} className="cal-day-name">{d}</div>)}</div>
                    <div className="cal-grid">
                        {calendarDays.map((d, i) => <div key={i} className={`cal-date ${d===25?'active':''} ${d===30?'yellow':''}`}>{d}</div>)}
                    </div>
                </div>

                <div className="task-update">
                    <div className="update-header"><p className="update-title">Update</p><p className="view-more">View more &gt;</p></div>
                    <div className="update-list">
                        {updateData.map((task, index) => (
                            <div className="update-card" key={index}>
                                <div className="card-top"><p className="task-category">{task.category}</p><span className={`task-tag ${task.tagColor}`}>{task.tag}</span></div>
                                <p className="task-action">{task.action}</p><p className="task-item">{task.item}</p>
                                <div className="card-bottom"><p className="task-date">Date: {task.date}</p><p className="task-arrow">&gt;</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ); 
}
export default Bigdiv;