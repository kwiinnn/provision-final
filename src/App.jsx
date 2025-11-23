import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './Layout';
import Bigdiv from './Bigdiv'; 
import Statistics from './Statistics';
import Messages from './Messages_TEMP';

// Create a helper component to use the useLocation hook
function AppRoutes() {
  const location = useLocation();
  
  // 1. Check if we have a "background" state passed from the link
  const background = location.state && location.state.background;

  return (
    <>
      {/* 2. MAIN ROUTES
         If 'background' exists, we force Routes to render THAT location (e.g., Home),
         even though the URL says '/messages'. This keeps the background page visible.
         If 'background' is null (e.g., direct refresh), use the real location.
      */}
      <Routes location={background || location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Bigdiv />} />
          <Route path="statistics" element={<Statistics />} />
          {/* Fallback: If user refreshes on /messages directly, render it here */}
          <Route path="messages" element={<Messages />} />
        </Route>
      </Routes>

      {/* 3. MODAL ROUTE
         If 'background' exists, we render this SECOND Routes block on top.
         This renders the Messages component as an overlay.
      */}
      {background && (
        <Routes>
          <Route path="messages" element={<Messages />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;