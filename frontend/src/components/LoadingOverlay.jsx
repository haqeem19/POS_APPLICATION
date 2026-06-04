import React from 'react';

export function LoadingOverlay({ text }) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-panel">
        <strong>{text}</strong>
      </div>
    </div>
  );
}
