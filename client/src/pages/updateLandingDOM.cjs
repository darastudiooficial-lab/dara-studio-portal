const fs = require('fs');
const filePath = 'd:/DARA Studio - Portal/client/src/pages/LandingPage.jsx';
let text = fs.readFileSync(filePath, 'utf8');

text = text.replace(
  /className="trust-item trust-link"\s*>/g,
  'className="trust-item trust-link"\n                title={T.statsRatingTooltip}\n              >'
);
text = text.replace(
  /<div className="trust-item">\s*<span style={{ fontSize: "14px" }}>🌍<\/span>\s*\{T.statsMarket\}\s*<\/div>/g,
  '<div className="trust-item" title={T.statsMarketTooltip}>\n                <span style={{ fontSize: "14px" }}>🌍</span>\n                {T.statsMarket}\n              </div>'
);
text = text.replace(
  /<div className="trust-item">\s*<span style={{ color: "#f97316", fontSize: "14px" }}>⚡<\/span>\s*\{T.statsTurnaround\}\s*<\/div>/g,
  '<div className="trust-item" title={T.statsTurnaroundTooltip}>\n                <span style={{ color: "#f97316", fontSize: "14px" }}>⚡</span>\n                {T.statsTurnaround}\n              </div>'
);

fs.writeFileSync(filePath, text, 'utf8');
