// Applies the saved theme before first paint (no inline scripts: strict CSP).
try { const t = localStorage.getItem('hq-theme'); if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; } catch {}
