import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './pages/Home'
import Resources from './pages/Resources'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="/Resources" element={<Resources />} />
    </Route>
    </>
  )
)

const rootElement = document.getElementById('root')
// index.html always contains #root; createRoot(null) would throw too, just less clearly.
if (!rootElement) throw new Error('Missing #root element in index.html')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)