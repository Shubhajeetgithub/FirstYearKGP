import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import TimeTable from './pages/TimeTable.jsx'
import Announcements from './pages/Announcements.jsx'
import Resources from './pages/Resources.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/Timetable" element={<TimeTable />} />
      <Route path="/Announcements" element={<Announcements />} />
      <Route path="/Resources" element={<Resources />} />
    </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)