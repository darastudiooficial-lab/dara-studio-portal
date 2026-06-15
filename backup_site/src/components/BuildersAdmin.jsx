import React, { useState, useEffect } from 'react';
import { useBuilders, INSPECTOR_PROJECTS, INSPECTOR_SYSTEMS } from '../context/BuildersContext';
import { useAppContext } from '../context/AppContext';

// Import seed data from each tool page for eager seeding
import { CATALOG_CATEGORIES, CATALOG_ITEMS } from '../pages/InteriorReference';
import { NOTES as INSPECTOR_NOTES } from '../pages/CodeInspector';
import { QUICK_NUMBERS, CRITICAL_RULES, CHECKLIST_SECTIONS, CAD_NOTES_DATA } from '../pages/FieldGuide';

// ─── Shared Styles ──────────────────────────────────────────────────────────────
const S = {
  panel: { display: 'flex', flexDirection: 'column', gap: 20 },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  addBtn: { background: 'linear-gradient(135deg, #7D9F85, #5A7E62)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 12 },
  th: { padding: '12px 16px', textAlign: 'left', fontWeight: 800, fontSize: 10, textTransform: 'uppercase', color: 'var(--mu)', borderBottom: '1px solid var(--border)' },
  td: { padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)' },
  actions: { display: 'flex', gap: 6 },
  btn: (bg) => ({ background: bg || 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 600 }),
  input: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', width: '100%', fontSize: 13, boxSizing: 'border-box' },
  textarea: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', width: '100%', fontSize: 12, minHeight: 80, resize: 'vertical', fontFamily: 'monospace', boxSizing: 'border-box' },
  label: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--mu)', marginBottom: 4, display: 'block', letterSpacing: '0.05em' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '60px 20px', zIndex: 9999, overflowY: 'auto' },
  modalBody: { background: '#0d0d12', border: '1px solid rgba(125, 159, 133,0.3)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 16 },
  badge: (color) => ({ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 6, background: color === 'red' ? 'rgba(239,68,68,0.1)' : color === 'amber' ? 'rgba(245,158,11,0.1)' : color === 'green' ? 'rgba(34,197,94,0.1)' : 'rgba(99,102,241,0.1)', color: color === 'red' ? '#f87171' : color === 'amber' ? '#fbbf24' : color === 'green' ? '#4ade80' : '#818cf8', textTransform: 'uppercase' }),
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  emptyState: { textAlign: 'center', padding: 60, opacity: 0.4, fontSize: 14 },
  subTabs: { display: 'flex', gap: 6, marginBottom: 16 },
  subTab: (active) => ({ padding: '8px 16px', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: active ? 'linear-gradient(135deg, #7D9F85, #5A7E62)' : 'rgba(255,255,255,0.04)', color: active ? '#fff' : 'var(--mu)' }),
  count: { fontSize: 10, opacity: 0.5, marginLeft: 6 },
};

// ─── Tool Sub-Tabs ──────────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'interior', label: `🪵 Interior Reference`, collection: 'interiorItems' },
  { id: 'inspector', label: `📐 Code Inspector`, collection: 'inspectorNotes' },
  { id: 'fieldguide', label: `📋 Field Guide`, collection: 'fieldguideCad' },
];

const FIELDGUIDE_SECTIONS = [
  { id: 'fieldguideQuick', label: `Quick Numbers` },
  { id: 'fieldguideRules', label: `Critical Rules` },
  { id: 'fieldguideChecklist', label: 'Checklist' },
  { id: 'fieldguideCad', label: `CAD Notes` },
];

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function BuildersAdmin() {
  const { lang } = useAppContext();
  const builders = useBuilders();
  const [activeTool, setActiveTool] = useState('interior');
  const [fgSection, setFgSection] = useState('fieldguideQuick');
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Eagerly seed ALL collections on mount so admin sees all data
  useEffect(() => {
    builders.seedCollection('interiorCategories', CATALOG_CATEGORIES);
    builders.seedCollection('interiorItems', CATALOG_ITEMS);
    builders.seedCollection('inspectorNotes', INSPECTOR_NOTES);
    builders.seedCollection('fieldguideQuick', QUICK_NUMBERS);
    builders.seedCollection('fieldguideRules', CRITICAL_RULES);
    const flatChecklist = CHECKLIST_SECTIONS.flatMap(section =>
      section.items.map(item => ({ ...item, sectionTitle: section.title }))
    );
    builders.seedCollection('fieldguideChecklist', flatChecklist);
    builders.seedCollection('fieldguideCad', CAD_NOTES_DATA);
  }, [builders.seedCollection]);
  
  // ─── Determine active collection key ────────────────────────────────────────
  const collectionKey = activeTool === 'fieldguide' ? fgSection : TOOLS.find(t => t.id === activeTool).collection;
  const items = builders.getCollection(collectionKey);

  // ─── Delete handler ─────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    builders.deleteEntry(collectionKey, id);
    setConfirmDelete(null);
  };

  // ─── Save handler (add or update) ──────────────────────────────────────────
  const handleSave = (entry) => {
    if (entry.id && items.find(i => i.id === entry.id)) {
      builders.updateEntry(collectionKey, entry.id, entry);
    } else {
      builders.addEntry(collectionKey, entry);
    }
    setEditingItem(null);
  };

  return (
    <div style={S.panel}>
      {/* Tool Sub-Tabs */}
      <div style={S.subTabs}>
        {TOOLS.map(t => (
          <button key={t.id} style={S.subTab(activeTool === t.id)} onClick={() => setActiveTool(t.id)}>
            {t.label}
            <span style={S.count}>
              ({activeTool === t.id && t.id === 'fieldguide' 
                ? builders.getCollection(fgSection).length 
                : builders.getCollection(t.collection).length})
            </span>
          </button>
        ))}
      </div>

      {/* FieldGuide section tabs */}
      {activeTool === 'fieldguide' && (
        <div style={{ display: 'flex', gap: 6 }}>
          {FIELDGUIDE_SECTIONS.map(s => (
            <button key={s.id} style={{ ...S.btn(fgSection === s.id ? '#6366f1' : undefined), fontSize: 10 }} onClick={() => setFgSection(s.id)}>
              {s.label} ({builders.getCollection(s.id).length})
            </button>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div style={S.toolbar}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
          {activeTool === 'interior' ? 'Interior Reference Items' :
           activeTool === 'inspector' ? 'Code Inspector Notes' :
           FIELDGUIDE_SECTIONS.find(s => s.id === fgSection)?.label || 'Field Guide'}
          <span style={{ fontSize: 12, opacity: 0.5, marginLeft: 8 }}>({items.length} entries)</span>
        </h3>
        <button style={S.addBtn} onClick={() => setEditingItem({})}>
          + {lang === 'EN' ? 'Add Entry' : 'Adicionar'}
        </button>
      </div>

      {/* Items Table */}
      {items.length === 0 ? (
        <div style={S.emptyState}>
          {lang === 'EN' ? 'No entries yet. Click "Add Entry" to start building your reference library.' :
            `Nenhuma entrada. Clique em "Adicionar" para começar a construir sua biblioteca.`}
        </div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 12 }}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>#</th>
                <th style={S.th}>{lang === 'EN' ? 'Title' : `Título`}</th>
                {activeTool === 'interior' && <th style={S.th}>Category</th>}
                {activeTool === 'inspector' && <><th style={S.th}>Project</th><th style={S.th}>System</th></>}
                {activeTool === 'fieldguide' && <th style={S.th}>Type</th>}
                <th style={S.th}>{lang === 'EN' ? 'Actions' : `Ações`}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id}>
                  <td style={S.td}>{idx + 1}</td>
                  <td style={{ ...S.td, fontWeight: 600, maxWidth: 300 }}>
                    {item.title || item.titlePt || item.topic || item.label || '—'}
                  </td>
                  {activeTool === 'interior' && (
                    <td style={S.td}>
                      <span style={S.badge('blue')}>{item.category || '—'}</span>
                    </td>
                  )}
                  {activeTool === 'inspector' && (
                    <>
                      <td style={S.td}><span style={S.badge('blue')}>{item.project || '—'}</span></td>
                      <td style={S.td}><span style={S.badge('amber')}>{item.system || '—'}</span></td>
                    </>
                  )}
                  {activeTool === 'fieldguide' && (
                    <td style={S.td}><span style={S.badge(item.type || 'blue')}>{item.type || item.cat || '—'}</span></td>
                  )}
                  <td style={S.td}>
                    <div style={S.actions}>
                      <button style={S.btn()} onClick={() => builders.reorderEntry(collectionKey, item.id, 'up')} title="Move up">↑</button>
                      <button style={S.btn()} onClick={() => builders.reorderEntry(collectionKey, item.id, 'down')} title="Move down">↓</button>
                      <button style={S.btn('#6366f1')} onClick={() => setEditingItem({ ...item })}>✏️</button>
                      <button style={S.btn('#dc2626')} onClick={() => setConfirmDelete(item.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div style={S.modal} onClick={() => setConfirmDelete(null)}>
          <div style={{ ...S.modalBody, maxWidth: 400, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>⚠️ {lang === 'EN' ? 'Delete this entry?' : 'Apagar esta entrada?'}</h3>
            <p style={{ opacity: 0.6, fontSize: 13 }}>
              {lang === 'EN' ? 'This action cannot be undone.' : `Esta ação não pode ser desfeita.`}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button style={S.btn()} onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button style={S.btn('#dc2626')} onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add Modal */}
      {editingItem !== null && (
        <EditModal
          item={editingItem}
          tool={activeTool}
          section={fgSection}
          onSave={handleSave}
          onCancel={() => setEditingItem(null)}
          lang={lang}
        />
      )}
    </div>
  );
}

// ─── Dynamic Edit Modal ─────────────────────────────────────────────────────────
function EditModal({ item, tool, section, onSave, onCancel, lang }) {
  const [form, setForm] = useState({ ...item });
  const isNew = !item.id;

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div style={S.modal} onClick={onCancel}>
      <form style={S.modalBody} onClick={e => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
          {isNew ? (lang === 'EN' ? '✦ New Entry' : '✦ Nova Entrada') : (lang === 'EN' ? '✏️ Edit Entry' : '✏️ Editar Entrada')}
        </h3>

        {/* ─── Interior Reference Fields ─── */}
        {tool === 'interior' && (
          <>
            <div style={S.row2}>
              <div>
                <label style={S.label}>Category</label>
                <select style={S.input} value={form.category || ''} onChange={e => set('category', e.target.value)}>
                  <option value="">— Select —</option>
                  <option value="cabinetry">Cabinetry & Joinery</option>
                  <option value="moldings">Moldings & Trim</option>
                  <option value="countertops">Surfaces & Countertops</option>
                  <option value="doors">Doors & Entryways</option>
                  <option value="lighting">Lighting & Clearance</option>
                </select>
              </div>
              <div>
                <label style={S.label}>ID Slug</label>
                <input style={S.input} value={form.id || ''} onChange={e => set('id', e.target.value)} placeholder="e.g. cab_vanity" />
              </div>
            </div>
            <div style={S.row2}>
              <div><label style={S.label}>Title (EN)</label><input style={S.input} value={form.title || ''} onChange={e => set('title', e.target.value)} /></div>
              <div><label style={S.label}>Título (PT)</label><input style={S.input} value={form.titlePt || ''} onChange={e => set('titlePt', e.target.value)} /></div>
            </div>
            <div style={S.row2}>
              <div><label style={S.label}>Description (EN)</label><textarea style={S.textarea} value={form.desc || ''} onChange={e => set('desc', e.target.value)} /></div>
              <div><label style={S.label}>Descrição (PT)</label><textarea style={S.textarea} value={form.descPt || ''} onChange={e => set('descPt', e.target.value)} /></div>
            </div>
            <div style={S.row2}>
              <div><label style={S.label}>CAD Note (EN)</label><textarea style={S.textarea} value={form.cadNote || ''} onChange={e => set('cadNote', e.target.value)} /></div>
              <div><label style={S.label}>Nota CAD (PT)</label><textarea style={S.textarea} value={form.cadNotePt || ''} onChange={e => set('cadNotePt', e.target.value)} /></div>
            </div>
            <div style={S.row2}>
              <div><label style={S.label}>Tip / Guideline (EN)</label><textarea style={S.textarea} value={form.tip || ''} onChange={e => set('tip', e.target.value)} /></div>
              <div><label style={S.label}>Dica / Diretriz (PT)</label><textarea style={S.textarea} value={form.tipPt || ''} onChange={e => set('tipPt', e.target.value)} /></div>
            </div>
            <div>
              <label style={S.label}>Specs JSON (EN) — Array of {'{name, val, desc}'}</label>
              <textarea style={{ ...S.textarea, minHeight: 100 }} value={JSON.stringify(form.specs || [], null, 2)} onChange={e => { try { set('specs', JSON.parse(e.target.value)); } catch (err) { console.warn(err); } }} />
            </div>
            <div>
              <label style={S.label}>Specs JSON (PT) — Array of {'{name, val, desc}'}</label>
              <textarea style={{ ...S.textarea, minHeight: 100 }} value={JSON.stringify(form.specsPt || [], null, 2)} onChange={e => { try { set('specsPt', JSON.parse(e.target.value)); } catch (err) { console.warn(err); } }} />
            </div>
          </>
        )}

        {/* ─── Code Inspector Fields ─── */}
        {tool === 'inspector' && (
          <>
            <div style={S.row2}>
              <div>
                <label style={S.label}>Project Type</label>
                <select style={S.input} value={form.project || ''} onChange={e => set('project', e.target.value)}>
                  <option value="">— Select —</option>
                  {INSPECTOR_PROJECTS.map(p => <option key={p.id} value={p.id}>{p.icon} {p.label}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>System</label>
                <select style={S.input} value={form.system || ''} onChange={e => set('system', e.target.value)}>
                  <option value="">— Select —</option>
                  {INSPECTOR_SYSTEMS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
            </div>
            <div style={S.row2}>
              <div>
                <label style={S.label}>Status</label>
                <select style={S.input} value={form.status || 'code_compliant'} onChange={e => set('status', e.target.value)}>
                  <option value="code_compliant">✅ Code Compliant</option>
                  <option value="lessons_learned">⚠️ Lessons Learned</option>
                </select>
              </div>
              <div><label style={S.label}>Title</label><input style={S.input} value={form.title || ''} onChange={e => set('title', e.target.value)} /></div>
            </div>
            <div><label style={S.label}>Português (PT) — Descrição</label><textarea style={S.textarea} value={form.pt || ''} onChange={e => set('pt', e.target.value)} /></div>
            <div><label style={S.label}>CAD Note (Short)</label><textarea style={S.textarea} value={form.cad || ''} onChange={e => set('cad', e.target.value)} /></div>
            <div><label style={S.label}>Layout / Sheet Note (Full)</label><textarea style={{ ...S.textarea, minHeight: 100 }} value={form.layout || ''} onChange={e => set('layout', e.target.value)} /></div>
            <div><label style={S.label}>Why / Inspector Tip</label><textarea style={S.textarea} value={form.why || ''} onChange={e => set('why', e.target.value)} /></div>
            <div><label style={S.label}>Image / Diagram Description</label><input style={S.input} value={form.imageTip || ''} onChange={e => set('imageTip', e.target.value)} /></div>
          </>
        )}

        {/* ─── Field Guide Fields ─── */}
        {tool === 'fieldguide' && (
          <>
            {/* Quick Numbers */}
            {section === 'fieldguideQuick' && (
              <>
                <div style={S.row2}>
                  <div>
                    <label style={S.label}>Type / Color</label>
                    <select style={S.input} value={form.type || 'blue'} onChange={e => set('type', e.target.value)}>
                      <option value="red">🔴 Red (Critical)</option>
                      <option value="amber">🟡 Amber (Warning)</option>
                      <option value="blue">🔵 Blue (Reference)</option>
                      <option value="green">🟢 Green (Standard)</option>
                    </select>
                  </div>
                  <div><label style={S.label}>Value</label><input style={S.input} value={form.val || ''} onChange={e => set('val', e.target.value)} placeholder="e.g. 5.7 sq ft" /></div>
                </div>
                <div><label style={S.label}>Label</label><input style={S.input} value={form.label || ''} onChange={e => set('label', e.target.value)} /></div>
                <div><label style={S.label}>Description</label><textarea style={S.textarea} value={form.desc || ''} onChange={e => set('desc', e.target.value)} /></div>
              </>
            )}

            {/* Critical Rules */}
            {section === 'fieldguideRules' && (
              <>
                <div style={S.row2}>
                  <div>
                    <label style={S.label}>Type / Severity</label>
                    <select style={S.input} value={form.type || 'blue'} onChange={e => set('type', e.target.value)}>
                      <option value="red">🔴 Red (Critical)</option>
                      <option value="amber">🟡 Amber (Warning)</option>
                      <option value="blue">🔵 Blue (Reference)</option>
                    </select>
                  </div>
                  <div><label style={S.label}>Icon (Emoji)</label><input style={S.input} value={form.icon || ''} onChange={e => set('icon', e.target.value)} placeholder="🚫" /></div>
                </div>
                <div style={S.row2}>
                  <div><label style={S.label}>Badge</label><input style={S.input} value={form.badge || ''} onChange={e => set('badge', e.target.value)} placeholder="e.g. Plumbing — Automatic Fail" /></div>
                  <div><label style={S.label}>Title</label><input style={S.input} value={form.title || ''} onChange={e => set('title', e.target.value)} /></div>
                </div>
                <div><label style={S.label}>Description</label><textarea style={S.textarea} value={form.desc || ''} onChange={e => set('desc', e.target.value)} /></div>
                <div><label style={S.label}>Code / CAD Reference</label><textarea style={S.textarea} value={form.code || ''} onChange={e => set('code', e.target.value)} /></div>
                <div><label style={S.label}>Inspector Tip</label><textarea style={S.textarea} value={form.tip || ''} onChange={e => set('tip', e.target.value)} /></div>
              </>
            )}

            {/* Checklist */}
            {section === 'fieldguideChecklist' && (
              <>
                <div style={S.row2}>
                  <div><label style={S.label}>Section Title</label><input style={S.input} value={form.sectionTitle || ''} onChange={e => set('sectionTitle', e.target.value)} placeholder="e.g. Foundation & Framing" /></div>
                  <div><label style={S.label}>Code Reference</label><input style={S.input} value={form.code || ''} onChange={e => set('code', e.target.value)} placeholder="780 CMR R403.1.6" /></div>
                </div>
                <div><label style={S.label}>Title</label><input style={S.input} value={form.title || ''} onChange={e => set('title', e.target.value)} /></div>
                <div><label style={S.label}>Detail</label><textarea style={S.textarea} value={form.detail || ''} onChange={e => set('detail', e.target.value)} /></div>
                <div><label style={S.label}>Fail Flag (optional)</label><input style={S.input} value={form.fail || ''} onChange={e => set('fail', e.target.value)} placeholder="e.g. NAILS = FAIL" /></div>
              </>
            )}

            {/* CAD Notes */}
            {section === 'fieldguideCad' && (
              <>
                <div style={S.row2}>
                  <div><label style={S.label}>Topic</label><input style={S.input} value={form.topic || ''} onChange={e => set('topic', e.target.value)} /></div>
                  <div>
                    <label style={S.label}>Category</label>
                    <select style={S.input} value={form.cat || ''} onChange={e => set('cat', e.target.value)}>
                      <option value="">— Select —</option>
                      <option value="foundation">Foundation</option>
                      <option value="framing">Framing</option>
                      <option value="roof">Roof</option>
                      <option value="thermal">Thermal</option>
                      <option value="mep">MEP</option>
                      <option value="fire">Fire Safety</option>
                    </select>
                  </div>
                </div>
                <div><label style={S.label}>CAD Note (Short)</label><textarea style={S.textarea} value={form.cad || ''} onChange={e => set('cad', e.target.value)} /></div>
                <div><label style={S.label}>Full Sheet Note</label><textarea style={{ ...S.textarea, minHeight: 120 }} value={form.sheet || ''} onChange={e => set('sheet', e.target.value)} /></div>
              </>
            )}
          </>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
          <button type="button" style={S.btn()} onClick={onCancel}>
            {lang === 'EN' ? 'Cancel' : 'Cancelar'}
          </button>
          <button type="submit" style={S.addBtn}>
            {isNew ? (lang === 'EN' ? '✦ Create Entry' : '✦ Criar Entrada') : (lang === 'EN' ? '💾 Save Changes' : '💾 Salvar')}
          </button>
        </div>
      </form>
    </div>
  );
}
