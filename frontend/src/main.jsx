import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Toaster 
        theme="dark" 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--color-vault-card)',
            border: '1px solid var(--color-vault-border)',
            color: 'var(--color-vault-text)',
            fontFamily: 'var(--font-body)',
          }
        }}
      />
    </ThemeProvider>
  </StrictMode>,
)
