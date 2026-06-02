import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Builder from './pages/Builder'
import Tools from './pages/Tools'
import Roadmap from './pages/Roadmap'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1e] text-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/learn"    element={<Learn />} />
          <Route path="/builder"  element={<Builder />} />
          <Route path="/tools"    element={<Tools />} />
          <Route path="/roadmap"  element={<Roadmap />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App