import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
