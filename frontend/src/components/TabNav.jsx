import React from 'react';
import { tabs } from '../config.js';

export function TabNav({ activeTab, setActiveTab, text }) {
  return (
    <nav className="tabs">
      {tabs.map((tab, index) => (
        <React.Fragment key={tab.id}>
          {index === 3 && <span className="tab-divider" aria-hidden="true" />}
          {tab.group && tabs[index - 1]?.group !== tab.group && <span className="tab-group-label">{text[tab.group]}</span>}
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
