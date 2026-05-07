import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path='/' element={<HomeScreen />} exact />
        </Routes>
      </main>
    </Router>
  )
}

export default App