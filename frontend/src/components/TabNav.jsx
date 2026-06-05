import React from 'react';
import { tabs } from '../config.js';

export function TabNav({ activeTab, setActiveTab, text }) {
  return (
    <nav className="tabs">
      {tabs.map((tab, index) => (
        <React.Fragment key={tab.id}>
          {index === 3 && <span className="tab-divider" aria-hidden="true" />}
          <button
            type="button"
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {text[tab.labelKey]}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
