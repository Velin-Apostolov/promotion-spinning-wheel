import { Routes, Route } from 'react-router-dom';
import SpinningWheel from "./components/SpinningWheel";
import AdminPanel from './components/AdminPanel';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
        <Routes>
          <Route path='/' element={<SpinningWheel />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </I18nextProvider>
    </>
  )
}

export default App;