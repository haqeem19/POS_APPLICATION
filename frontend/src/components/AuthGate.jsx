import React from 'react';

export function AuthGate({
  authError,
  language,
  passwordInput,
  setLanguage,
  setPasswordInput,
  submitPassword,
  text,
}) {
  return (
    <main className="auth-page">
      <form className="auth-panel" onSubmit={submitPassword}>
        <div>
          <h1>{text.passwordTitle}</h1>
          <p>{text.passwordSubtitle}</p>
        </div>
        <label>
          {text.passwordLabel}
          <input
            required
            type="password"
            value={passwordInput}
            placeholder={text.passwordPlaceholder}
            onChange={(event) => setPasswordInput(event.target.value)}
          />
        </label>
        {authError && <p className="message">{authError}</p>}
        <button type="submit">{text.passwordButton}</button>
        <div className="toolbar">
          <label>
            {text.language}
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option value="id">Indonesia</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>
        <p className="hint">{text.devHint}</p>
      </form>
    </main>
  );
}
