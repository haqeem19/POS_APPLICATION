import React from 'react';

export function AppHeader({ language, loadData, logout, setLanguage, text }) {
  return (
    <header className="header">
      <div>
        <h1>{text.appTitle}</h1>
        <p>{text.appSubtitle}</p>
      </div>
      <div className="header-actions">
        <label>
          {text.language}
          <select value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
        </label>
        <button type="button" onClick={loadData}>{text.refresh}</button>
        <button type="button" onClick={logout}>{text.logout}</button>
      </div>
    </header>
  );
}
