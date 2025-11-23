import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './content.css';
import './statistics.css';

function Statistics() {
    // --- SALES STATE ---
    const [salesPredictions, setSalesPredictions] = useState([]);
    const [salesLoading, setSalesLoading] = useState(true);
    const [salesError, setSalesError] = useState(null);
    const [salesInsights, setSalesInsights] = useState('');

    // --- REVENUE STATE ---
    const [revPredictions, setRevPredictions] = useState([]);
    const [revLoading, setRevLoading] = useState(true);
    const [revError, setRevError] = useState(null);
    const [revInsights, setRevInsights] = useState('');

    // --- INVENTORY STATE ---
    const [invPredictions, setInvPredictions] = useState([]);
    const [invLoading, setInvLoading] = useState(true);
    const [invError, setInvError] = useState(null);
    const [invInsights, setInvInsights] = useState('');

    // --- PRODUCTION STATE ---
    const [prodPredictions, setProdPredictions] = useState([]);
    const [prodLoading, setProdLoading] = useState(true);
    const [prodError, setProdError] = useState(null);
    const [prodInsights, setProdInsights] = useState('');

    // --- SHARED DATA ---
    const historicalData = [
        { date: 'Nov 2024', sales: 4500, revenue: 225000, production: 2000, inventory: 4400 },
        { date: 'Dec 2024', sales: 5200, revenue: 260000, production: 1500, inventory: 700 },
        { date: 'Jan 2025', sales: 1200, revenue: 60000, production: 1500, inventory: 1000 },
        { date: 'Feb 2025', sales: 1100, revenue: 55000, production: 1500, inventory: 1400 },
        { date: 'Mar 2025', sales: 1400, revenue: 70000, production: 1600, inventory: 1600 },
        { date: 'Apr 2025', sales: 1800, revenue: 90000, production: 2000, inventory: 1800 },
        { date: 'May 2025', sales: 2200, revenue: 110000, production: 2200, inventory: 1800 },
        { date: 'Jun 2025', sales: 2500, revenue: 125000, production: 2000, inventory: 1300 },
        { date: 'Jul 2025', sales: 2100, revenue: 105000, production: 2500, inventory: 1700 },
        { date: 'Aug 2025', sales: 1900, revenue: 95000, production: 3000, inventory: 2800 },
        { date: 'Sep 2025', sales: 2200, revenue: 110000, production: 3800, inventory: 4400 },
        { date: 'Oct 2025', sales: 2800, revenue: 140000, production: 4200, inventory: 5800 },
        { date: 'Nov 2025', sales: 4600, revenue: 230000, production: 2200, inventory: 3400 }
    ];

    // Current Data (Nov 2025) - Adjusted for nice zig-zag visuals
    const nov2025Sales = [
        { week: 'Week 1', val: 1120 }, { week: 'Week 2', val: 1180 }, 
        { week: 'Week 3', val: 1150 }, { week: 'Week 4', val: 1210 }  
    ];
    const nov2025Revenue = [
        { week: 'Week 1', val: 56000 }, { week: 'Week 2', val: 59000 }, 
        { week: 'Week 3', val: 57500 }, { week: 'Week 4', val: 60500 }  
    ];
    const nov2025Inventory = [
        { week: 'Week 1', val: 3450 }, { week: 'Week 2', val: 3300 }, 
        { week: 'Week 3', val: 3400 }, { week: 'Week 4', val: 3350 }  
    ];
    const nov2025Production = [
        { week: 'Week 1', val: 550 }, { week: 'Week 2', val: 600 }, 
        { week: 'Week 3', val: 520 }, { week: 'Week 4', val: 580 }  
    ];

    const productionTrends = `
    Month Season Target Harvest (MT) Actual Production (Dried Beans) Rejects/Shrinkage Net Supply Available Orders (Demand) Status
    Nov 2025 Main Crop Start 150 142 3.5 138.5 160 Shortage
    Dec 2025 Main Peak 180 175 4.2 170.8 180 Balanced
    `;

    // --- API HELPER ---
    const fetchData = async (prompt, setPred, setInsights, setLoading, setError) => {
        try {
            // Use environment variable for key if possible, otherwise fallback
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY; 
            
            if (!apiKey) {
                console.error("API Key is missing!");
                setError("Missing API Key");
                setLoading(false);
                return;
            }

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },
                body: JSON.stringify({
                    model: 'x-ai/grok-4.1-fast',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text(); 
                throw new Error(`API Failed: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            
            // Robust JSON parsing
            let clean = data.choices[0].message.content;
            const firstBrace = clean.indexOf('{');
            const lastBrace = clean.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                clean = clean.substring(firstBrace, lastBrace + 1);
            }
            
            const parsed = JSON.parse(clean);
            setPred(parsed.predictions);
            setInsights(parsed.insights);
            setLoading(false);
        } catch (e) {
            console.error("Full Error:", e);
            setError("Failed to load data"); 
            setLoading(false);
        }
    }

    // --- FETCH EFFECTS ---
    useEffect(() => {
        // Sales
        const salesPrompt = `You are a sales forecasting expert. Predict weekly SALES (units) for Dec 2025 based on historical data.
        Instructions: Dec 2025 is "Main Peak". Start ~1250, grow to ~1500 by Week 4 (create a curve).
        Return JSON ONLY: {"predictions": [{"week": "Week 1", "val": 1250}, ...], "insights": "Reasoning..."}`;
        fetchData(salesPrompt, setSalesPredictions, setSalesInsights, setSalesLoading, setSalesError);

        // Revenue
        const revPrompt = `You are a revenue forecasting expert. Predict weekly REVENUE (currency) for Dec 2025.
        Instructions: Dec 2025 is "Main Peak". Start ~62000, grow to ~75000 by Week 4.
        Return JSON ONLY: {"predictions": [{"week": "Week 1", "val": 62000}, ...], "insights": "Reasoning..."}`;
        fetchData(revPrompt, setRevPredictions, setRevInsights, setRevLoading, setRevError);

        // Inventory
        const invPrompt = `You are an inventory forecasting expert. Predict weekly INVENTORY (units) for Dec 2025.
        Instructions: High Sales means Inventory drops fast. Start ~3200, drop to ~1000 by Week 4.
        Return JSON ONLY: {"predictions": [{"week": "Week 1", "val": 3200}, ...], "insights": "Reasoning..."}`;
        fetchData(invPrompt, setInvPredictions, setInvInsights, setInvLoading, setInvError);

        // Production
        const prodPrompt = `You are a production forecasting expert. Predict weekly PRODUCTION (units) for Dec 2025.
        Historical: ${JSON.stringify(historicalData)}
        Context: Dec 2025 is Main Peak. Production must ramp up to meet demand.
        Instructions: Start ~600 in Week 1, ramping up to ~850 by Week 4.
        Return JSON ONLY: {"predictions": [{"week": "Week 1", "val": 600}, ...], "insights": "Reasoning..."}`;
        fetchData(prodPrompt, setProdPredictions, setProdInsights, setProdLoading, setProdError);

    }, []);

    // --- DATA PREPARATION ---
    const prepareData = (currentData, predictions) => {
        return currentData.map((item, index) => ({
            name: item.week,
            current: item.val,
            predicted: predictions && predictions[index] ? predictions[index].val : null
        }));
    };

    const salesChartData = prepareData(nov2025Sales, salesPredictions);
    const revenueChartData = prepareData(nov2025Revenue, revPredictions);
    const inventoryChartData = prepareData(nov2025Inventory, invPredictions);
    const productionChartData = prepareData(nov2025Production, prodPredictions);

    // --- CHART RENDERER ---
    const renderChart = (data, loading, error, insights, title) => (
        <div className="chart-inner-layout">
            <div className="chart-area">
                {loading ? (
                    <div className="loading-container"><div className="pulse-text">ProVision is analyzing {title}...</div></div>
                ) : error ? (
                    <div className="error-text">{error}</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 25, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: '#06231D', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '10px' }}/>
                            <Line name="Nov 2025 (Current)" type="monotone" dataKey="current" stroke="#4A90E2" strokeWidth={3} dot={{r:4, fill:'#4A90E2'}} activeDot={{r:6}} 
                                label={{ position: 'top', fill: '#4A90E2', fontSize: 12, fontWeight: 'bold', dy: -10 }} />
                            <Line name="Dec 2025 (Predicted)" type="monotone" dataKey="predicted" stroke="#4CAF50" strokeWidth={3} dot={{r:4, fill:'#4CAF50'}} activeDot={{r:6}} 
                                label={{ position: 'top', fill: 'white', fontSize: 12, fontWeight: 'bold', dy: -10 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
            <div className="insights-area">
                <div className="insights-header">ProVision Insights</div>
                {loading ? <p className="insights-loading">Loading...</p> : <p className="insights-text">{insights || "No data."}</p>}
            </div>
        </div>
    );

    return (
        <div className="content" style={{ flexDirection: 'column', marginLeft: '220px', marginTop: '40px' }}>
            <div className="forecast-welcome">
                <p className="page-title">Forecast</p>
                <p className="forecast-company">Company Name</p>
            </div>

            <div className="forecast-box">
                {/* SALES */}
                <div className="sales-box">
                    <p className="box-title-white">Sales</p>
                    {renderChart(salesChartData, salesLoading, salesError, salesInsights, "Sales")}
                </div>

                {/* REVENUE */}
                <div className="revenue-box">
                    <p className="box-title-white">Revenue</p>
                    {renderChart(revenueChartData, revLoading, revError, revInsights, "Revenue")}
                </div>

                {/* INVENTORY */}
                <div className="inventory-box">
                    <p className="box-title-white">Inventory</p>
                    {renderChart(inventoryChartData, invLoading, invError, invInsights, "Inventory")}
                </div>

                {/* PRODUCTION */}
                <div className="production-box">
                    <p className="box-title-white">Production</p>
                    {renderChart(productionChartData, prodLoading, prodError, prodInsights, "Production")}
                </div>
            </div>
        </div>
    );
}

export default Statistics;