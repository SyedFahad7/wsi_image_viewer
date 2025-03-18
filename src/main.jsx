import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ViewerProvider } from "./contexts/ViewerContext.jsx";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <ViewerProvider>
      <App />
    </ViewerProvider>
  </StrictMode>,
)
