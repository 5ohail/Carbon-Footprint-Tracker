import './App.css'
import { Route, Routes } from 'react-router-dom'
import {AuthPage} from './Components/AuthPage.jsx'
import {About} from './Components/About.jsx'
import {CarbonCalculator} from './Components/CarbonCalculator.jsx'
import {ProfilePage} from './Components/ProfilePage.jsx'
import {Home} from './Components/Index.jsx'
import { Layout } from './Components/Layout.jsx'
import Contact from './Components/Contact.jsx'
import Company  from './Components/Company.jsx'
import Rewards from './Components/Rewards.jsx'
import CarbonFootprintAI from './Components/AiAnalysis.jsx'
import Report from './Components/Report.jsx'
import AuthLoader from './Components/AuthLoader.jsx'
import IOT from './Components/IOT.jsx'

function App() {

  return (
    <>
   <AuthLoader /> {/* 🔥 Loads Firebase data once user logs in */}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/carbon-calculator" element={<CarbonCalculator />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/company" element={<Company />} />
          <Route path='/rewards' element={<Rewards />} />
          <Route path='/ai-analysis' element={<CarbonFootprintAI />} />
          <Route path='/report' element={<Report />} />
          <Route path='/iot' element={<IOT/>}/>
        </Routes>
      </Layout>
    </>
  )
}

export default App
