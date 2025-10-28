import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.jsx'
import Base from './Base.jsx'
import About from './About.jsx'
import HowTo from './HowTo.jsx'
import Changelog from './Changelog.jsx'
import Contacts from './Contacts.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Base />} />
          <Route path="about" element={<About />} />
          <Route path="howto" element={<HowTo />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="contacts" element={<Contacts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
