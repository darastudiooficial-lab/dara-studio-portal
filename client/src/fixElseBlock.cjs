const fs = require('fs');

const path = 'd:/DARA Studio - Portal/client/src/pages/Services.jsx';
let content = fs.readFileSync(path, 'utf-8');

const regex = /<ul className="service-list">\s*\{service\.list\[lang\]\.map\(\(item,\s*i\)\s*=>\s*\(\s*<li key=\{i\} className="service-list-item">\s*<Icons\.Check \/>\s*\{item\}\s*<\/li>\s*\)\)\}\s*<\/ul>/;

const replacement = `<ul className="service-list">
                    {service.list[lang].map((item, i) => (
                      <li key={i} className="service-list-item">
                        <Icons.Check />
                        <span>
                          {typeof item === 'string' ? item : (
                            <>
                              <strong style={{ color: "#fff" }}>{item.label}:</strong> {item.desc}
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(path, content, 'utf-8');
    console.log("Successfully replaced else block.");
} else {
    console.log("Could not find the else block with regex.");
}
