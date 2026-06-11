const fs = require('fs');

const path = 'd:/DARA Studio - Portal/client/src/pages/Services.jsx';
let content = fs.readFileSync(path, 'utf-8');

const target = `                            <span>{item}</span>`;

const replacement = `                            <span>
                              {typeof item === 'string' ? item : (
                                <>
                                  <strong style={{ color: "#fff" }}>{item.label}:</strong> {item.desc}
                                </>
                              )}
                            </span>`;

const before = content.length;
content = content.replace(target, replacement);

const target2 = `<div style={{ background: "rgba(16, 185, 129, 0.04)", border: "1px solid rgba(16, 185, 129, 0.15)", borderRadius: "12px", padding: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "#10b981", marginBottom: 12, textTransform: "uppercase" }}>{lang === "EN" ? "WHAT'S INCLUDED" : "O QUE ESTÁ INCLUSO"}</p>`;

const replacement2 = `<div style={{ background: "var(--a-dim)", border: "1px solid var(--a-glow)", borderRadius: "12px", padding: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--a)", marginBottom: 12, textTransform: "uppercase" }}>{lang === "EN" ? "WHAT'S INCLUDED" : "O QUE ESTÁ INCLUSO"}</p>`;

content = content.replace(target2, replacement2);

content = content.replace(
  `<span style={{ color: "#10b981", fontSize: 16, lineHeight: 1, marginTop: -2 }}>•</span>`,
  `<span style={{ color: "var(--a)", fontSize: 16, lineHeight: 1, marginTop: -2 }}>•</span>`
);

fs.writeFileSync(path, content, 'utf-8');
console.log("Length changed:", before, "->", content.length);
