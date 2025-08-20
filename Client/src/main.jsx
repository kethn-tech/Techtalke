import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import AppWrapper from './components/AppWrapper.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <AppWrapper>
    <App />
    <Toaster position='top-center' richColors duration={2000} expand />
    </AppWrapper>
  </SocketProvider>
)
