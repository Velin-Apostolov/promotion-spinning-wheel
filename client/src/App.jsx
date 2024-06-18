import { Routes, Route } from 'react-router-dom';
import SpinningWheel from "./components/SpinningWheel";
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<SpinningWheel />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  )
}

export default App;