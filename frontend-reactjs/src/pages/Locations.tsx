import React from 'react';
import {
  getListLocationsApi,
  updateLocationApi,
  deleteLocationApi,
  LocationItem
} from '../api/http';
import EditLocationModal from '../components/EditLocationModal';

type SortKey = 'updatedAt' | 'name' | 'lat' | 'lng';

export default function Locations() {
  const [items, setItems] = React.useState<LocationItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filters (like Users page)
  const [query, setQuery] = React.useState('');
  const [locationFilter, setLocationFilter] = React.useState<string>(''); // exact match of locationName
  const [imageFilter, setImageFilter] = React.useState<'' | 'with' | 'without'>('');

  // Sorting (like Users page)
  const [sortBy, setSortBy] = React.useState<SortKey>('updatedAt');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');

  // Pagination (like Users page)
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Edit / Delete
  const [edit, setEdit] = React.useState<LocationItem | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<LocationItem | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res: any = await getListLocationsApi();
      setItems(res.data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  // Build unique Location Name options
  const locationNameOptions = React.useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => { if (i.locationName && i.locationName.trim()) set.add(i.locationName); });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    let data = items.filter(i => {
      const matchesText =
        !q ||
        i.name.toLowerCase().includes(q) ||
        (i.locationName?.toLowerCase().includes(q)) ||
        (i.description?.toLowerCase().includes(q));

      const matchesLocation =
        !locationFilter || (i.locationName === locationFilter);

      const hasImg = !!(i.imageBase64 && i.imageMime);
      const matchesImage =
        imageFilter === '' ||
        (imageFilter === 'with' && hasImg) ||
        (imageFilter === 'without' && !hasImg);

      return matchesText && matchesLocation && matchesImage;
    });

    // Sort
    data.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      let av: any;
      let bv: any;
      switch (sortBy) {
        case 'name':
          av = a.name.toLowerCase();
          bv = b.name.toLowerCase();
          break;
        case 'lat':
          av = a.lat;
          bv = b.lat;
          break;
        case 'lng':
          av = a.lng;
          bv = b.lng;
          break;
        default: { // updatedAt (fallback to createdAt)
          const at = new Date(a.updatedAt || a.createdAt || '').getTime() || 0;
          const bt = new Date(b.updatedAt || b.createdAt || '').getTime() || 0;
          av = at; bv = bt;
        }
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });

    return data;
  }, [items, query, locationFilter, imageFilter, sortBy, sortDir]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  // Reset to page 1 on filter/sort/pageSize change
  React.useEffect(() => { setPage(1); }, [query, locationFilter, imageFilter, pageSize, sortBy, sortDir]);

  const toggleSort = (f: SortKey) => {
    if (sortBy === f) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(f); setSortDir('asc'); }
  };
  const sortIndicator = (f: SortKey) => (sortBy !== f ? '' : sortDir === 'asc' ? ' ▲' : ' ▼');

  return (
    <div className="page">
      {/* Header like Users page */}
      <div className="users-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h1 className="users-title">Locations</h1>
          <span className="users-count">{total} total</span>
        </div>
        <button className="btn btn-outline" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {/* Toolbar like Users page with filters */}
      <div className="users-toolbar card">
        <div className="toolbar-row">
          <div className="toolbar-group">
            <input
              className="input"
              placeholder="Search by name, location, description…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <select
              className="select"
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              title="Filter by Location Name"
            >
              <option value="">All locations</option>
              {locationNameOptions.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <select
              className="select"
              value={imageFilter}
              onChange={e => setImageFilter(e.target.value as any)}
              title="Filter by Image presence"
            >
              <option value="">All images</option>
              <option value="with">With image</option>
              <option value="without">Without image</option>
            </select>
          </div>

          <div className="toolbar-group">
            <label className="label">Per page</label>
            <select
              className="select"
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table surface */}
      <div className="card users-surface">
        {loading ? (
          <div className="skeleton-table" />
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th style={{ width: 56 }}>Img</th>
                    <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')}>Name{sortIndicator('name')}</th>
                    <th style={{ width: 160, cursor: 'pointer' }} onClick={() => toggleSort('lat')}>Lat{sortIndicator('lat')}</th>
                    <th style={{ width: 160, cursor: 'pointer' }} onClick={() => toggleSort('lng')}>Lng{sortIndicator('lng')}</th>
                    <th style={{ width: 220 }}>Location</th>
                    <th>Description</th>
                    <th style={{ width: 180, cursor: 'pointer' }} onClick={() => toggleSort('updatedAt')}>Updated{sortIndicator('updatedAt')}</th>
                    <th style={{ width: 180, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(loc => {
                    const hasImg = !!(loc.imageBase64 && loc.imageMime);
                    const src = hasImg ? `data:${loc.imageMime};base64,${loc.imageBase64}` : '';
                    return (
                      <tr key={loc.id}>
                        <td>
                          {hasImg ? (
                            <img src={src} alt={loc.name} className="thumb" />
                          ) : (
                            <div className="thumb thumb-placeholder">No Img</div>
                          )}
                        </td>
                        <td>
                          <div className="user-cell">
                            <div className="user-meta">
                              <div className="user-name">{loc.name}</div>
                              <div className="user-email sm-only">{loc.locationName || '—'}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="pill">{loc.lat.toFixed(6)}</span></td>
                        <td><span className="pill">{loc.lng.toFixed(6)}</span></td>
                        <td>{loc.locationName || <span className="muted">—</span>}</td>
                        <td className="truncate">{loc.description || <span className="muted">—</span>}</td>
                        <td>{new Date(loc.updatedAt || loc.createdAt || '').toLocaleString()}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="actions">
                            <button className="btn" onClick={() => setEdit(loc)}>Edit</button>
                            <button className="btn btn-danger" onClick={() => setConfirmDelete(loc)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {pageItems.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24 }}>No locations found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination like Users */}
            <div className="pagination">
              <button className="btn" onClick={() => setPage(1)} disabled={currentPage === 1}>« First</button>
              <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹ Prev</button>
              <span className="page-indicator">Page {currentPage} of {totalPages}</span>
              <button className="btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next ›</button>
              <button className="btn" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>Last »</button>
            </div>
          </>
        )}
      </div>

      {/* Edit & Delete Modals */}
      {edit && (
        <EditLocationModal
          open={!!edit}
          onClose={() => setEdit(null)}
          initial={edit}
          onSubmit={async (payload) => {
            await updateLocationApi(edit.id, payload);
            setEdit(null);
            load();
          }}
        />
      )}

      {confirmDelete && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Delete Location</h3>
            <p>Are you sure you want to delete <b>{confirmDelete.name}</b> (ID {confirmDelete.id})?</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  await deleteLocationApi(confirmDelete.id);
                  setConfirmDelete(null);
                  load();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}