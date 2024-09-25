import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'bg' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="language-switcher">
      <button className="language-btn" onClick={toggleLanguage}>
        {i18n.language === 'en' ? 'Български' : 'English'}
      </button>
    </div>
  );
};

export default LanguageSwitcher;