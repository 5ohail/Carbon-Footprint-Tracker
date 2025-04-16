import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { DataProvider } from './utils/DataProvider.jsx'
createRoot(document.getElementById('root')).render(
    <DataProvider>
    <Router>
    <App />
    </Router>
    </DataProvider>,
)
