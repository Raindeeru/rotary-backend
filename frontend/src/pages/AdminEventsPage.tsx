import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000';

function getToken() { return localStorage.getItem('rotary_access_token') ?? ''; }
function authHeaders() { return { Authorization: `Bearer ${getToken()}` }; }

const EVENT_TYPES = ['Meeting', 'Project Schedule', 'Induction Ceremony', 'Rescheduling Notice'];

type FullEvent = {
  id: number;
  title: string;
  description: string;
  date: string;
  event_type: string;
  admin_id: number | null;
};

function TypePill({ type }: { type: string }) {
  const map: Record<string, string> = {
    'Meeting': 'event-type--meeting',
    'Project Schedule': 'event-type--project',
    'Induction Ceremony': 'event-type--induction',
    'Rescheduling Notice': 'event-type--reschedule',
  };
  return <span className={`event-type-pill ${map[type] ?? ''}`}>{type}</span>;
}

export function AdminEventsPage() {
  const [events, setEvents] = useState<FullEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail view
  const [selected, setSelected] = useState<FullEvent | null>(null);

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ title: '', description: '', date: '', event_type: 'Meeting' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Edit modal
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', date: '', event_type: 'Meeting' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [coverImg, setCoverImg] = useState<string | null>(() => {
    return localStorage.getItem('events_cover_img') ?? null;
  });

  function getEventImg(id: number): string | null {
    return localStorage.getItem(`event_img_${id}`) ?? null;
  }

  function handleEventImgUpload(id: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      localStorage.setItem(`event_img_${id}`, result);
      setEvents(prev => [...prev]);
      if (selected?.id === id) setSelected(prev => prev ? { ...prev } : null);
    };
    reader.readAsDataURL(file);
  }

  async function loadEvents() {
    try {
      const res = await fetch(`${API_BASE}/events/`, { headers: authHeaders() });
      if (res.ok) setEvents(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  useEffect(() => { loadEvents(); }, []);

  function openEvent(e: FullEvent) {
    setSelected(e);
  }

  async function handleAdd() {
    setAddError(null);
    if (!addForm.title.trim()) { setAddError('Title is required.'); return; }
    if (!addForm.date) { setAddError('Date is required.'); return; }
    setAddLoading(true);
    try {
      const res = await fetch(`${API_BASE}/events/`, {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: addForm.title,
          description: addForm.description,
          date: new Date(addForm.date).toISOString(),
          event_type: addForm.event_type,
        }),
      });
      if (!res.ok) { const b = await res.json(); throw new Error(b?.detail ?? 'Failed'); }
      setShowAdd(false);
      setAddForm({ title: '', description: '', date: '', event_type: 'Meeting' });
      loadEvents();
    } catch (err) { setAddError(err instanceof Error ? err.message : 'Error'); }
    finally { setAddLoading(false); }
  }

  function openEdit() {
    if (!selected) return;
    setEditForm({
      title: selected.title,
      description: selected.description,
      date: selected.date ? selected.date.slice(0, 16) : '',
      event_type: selected.event_type,
    });
    setEditError(null);
    setShowEdit(true);
  }

  async function handleEdit() {
    if (!selected) return;
    setEditError(null);
    setEditLoading(true);
    try {
      const res = await fetch(`${API_BASE}/events/${selected.id}`, {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          date: editForm.date ? new Date(editForm.date).toISOString() : undefined,
          event_type: editForm.event_type,
        }),
      });
      if (!res.ok) { const b = await res.json(); throw new Error(b?.detail ?? 'Failed'); }
      setShowEdit(false);
      setSelected({ ...selected, ...editForm });
      loadEvents();
    } catch (err) { setEditError(err instanceof Error ? err.message : 'Error'); }
    finally { setEditLoading(false); }
  }

  async function handleDelete() {
    if (!selected) return;
    if (!confirm(`Delete "${selected.title}"?`)) return;
    try {
      await fetch(`${API_BASE}/events/${selected.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      setSelected(null);
      loadEvents();
    } catch { /* ignore */ }
  }

  // ── Detail view ──
  if (selected) {
    return (
      <div className="proj-detail">
        <div
          className="proj-detail__banner"
          style={getEventImg(selected.id) ? { backgroundImage: `url(${getEventImg(selected.id)})` } : undefined}
        >
          <div className="proj-detail__banner-inner">
            <button className="proj-detail__back" onClick={() => setSelected(null)}>← Back</button>
            <div className="proj-detail__banner-info">
              <h1 className="proj-detail__banner-title">{selected.title}</h1>
            </div>
            <div className="proj-detail__banner-actions">
              <button className="proj-detail__edit-btn" onClick={openEdit}>Edit Event</button>
            </div>
          </div>
        </div>

        <div className="proj-detail__body" style={{ borderTop: '1px solid #e5e7eb', borderRadius: '0 0 0.75rem 0.75rem' }}>
          <div className="proj-detail__desc">
            <div className="proj-detail__meta" style={{ marginBottom: '1rem' }}>
              <span><strong>Date:</strong> {new Date(selected.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              <span><strong>Type:</strong> <TypePill type={selected.event_type} /></span>
            </div>
            <p>{selected.description || 'No description provided.'}</p>
            <button
              className="proj-fin__delete-btn"
              style={{ marginTop: '1.5rem', color: '#b91c1c', fontSize: '0.82rem', border: '1px solid #fca5a5', borderRadius: '0.4rem', padding: '0.4rem 0.9rem' }}
              onClick={handleDelete}
            >
              Delete Event
            </button>
          </div>
        </div>

        {/* Edit modal */}
        {showEdit && (
          <div className="proj-modal-overlay" onClick={() => setShowEdit(false)}>
            <div className="proj-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="proj-modal__title">Edit Event</h2>
              <label className="proj-modal__label">Event Photo
                <div className="proj-modal__photo-upload">
                  {getEventImg(selected.id) && (
                    <img src={getEventImg(selected.id)!} className="proj-modal__photo-preview" alt="Event" />
                  )}
                  <label className="proj-modal__photo-btn">
                    {getEventImg(selected.id) ? 'Change Photo' : 'Upload Photo'}
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleEventImgUpload(selected.id, e)} />
                  </label>
                </div>
              </label>
              <label className="proj-modal__label">Event Title
                <input className="proj-modal__input" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
              </label>
              <label className="proj-modal__label">Date & Time
                <input className="proj-modal__input" type="datetime-local" value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} />
              </label>
              <label className="proj-modal__label">Event Type
                <select className="proj-modal__input" value={editForm.event_type} onChange={e => setEditForm(f => ({ ...f, event_type: e.target.value }))}>
                  {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </label>
              <label className="proj-modal__label">Description
                <textarea className="proj-modal__textarea" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
              </label>
              {editError && <p className="proj-modal__error">{editError}</p>}
              <button className="proj-modal__save" onClick={handleEdit} disabled={editLoading}>
                {editLoading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Grid view ──
  function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCoverImg(result);
      localStorage.setItem('events_cover_img', result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="proj-grid-view">
      <div
        className="proj-cover"
        style={coverImg ? { backgroundImage: `url(${coverImg})` } : undefined}
      >
        {!coverImg && <div className="proj-cover__placeholder" />}
        <div className="proj-cover__content">
          <h1 className="proj-cover__title">EVENTS</h1>
        </div>
        <label className="proj-cover__upload-btn" title="Upload cover photo">
          Change Cover
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} />
        </label>
      </div>

      <div className="proj-grid" style={{ marginTop: '1.5rem' }}>
        <button className="proj-card proj-card--add" onClick={() => setShowAdd(true)}>
          <span className="proj-card__add-icon">+</span>
          <span className="proj-card__add-label">Add an Event</span>
        </button>

        {loading ? (
          <div className="dash-loading">Loading…</div>
        ) : events.map((ev) => (
          <div key={ev.id} className="proj-card" onClick={() => openEvent(ev)}>
            {getEventImg(ev.id) && (
              <div className="proj-card__img" style={{ backgroundImage: `url(${getEventImg(ev.id)})` }} />
            )}
            <div className="proj-card__title">{ev.title}</div>
            <div className="proj-card__desc">
              {new Date(ev.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <TypePill type={ev.event_type} />
          </div>
        ))}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="proj-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="proj-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="proj-modal__title">Add an Event</h2>
            <label className="proj-modal__label">Event Title
              <input className="proj-modal__input" placeholder="e.g. March General Assembly" value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} />
            </label>
            <label className="proj-modal__label">Date & Time
              <input className="proj-modal__input" type="datetime-local" value={addForm.date} onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))} />
            </label>
            <label className="proj-modal__label">Event Type
              <select className="proj-modal__input" value={addForm.event_type} onChange={e => setAddForm(f => ({ ...f, event_type: e.target.value }))}>
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="proj-modal__label">Description
              <textarea className="proj-modal__textarea" placeholder="Brief description…" value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} />
            </label>
            {addError && <p className="proj-modal__error">{addError}</p>}
            <button className="proj-modal__save" onClick={handleAdd} disabled={addLoading}>
              {addLoading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
