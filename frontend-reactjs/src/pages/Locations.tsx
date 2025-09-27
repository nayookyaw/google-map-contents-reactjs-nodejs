import React from 'react';
import {
  getListLocationsApi,
  updateLocationApi,
  deleteLocationApi,
  LocationItem
} from '../api/http';
import EditLocationModal from '../components/EditLocationModal';

export default function Locations() {
  const [items, setItems] = React.useState<LocationItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [edit, setEdit] = React.useState<LocationItem | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState<LocationItem | null>(null);
  const [query, setQuery] = React.useState('');

  const load = async () => {
    try {
      setLoading(true);
      const res : any = await getListLocationsApi();
      setItems(res.data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { load(); }, []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(i =>
      !q ||
      i.name.toLowerCase().includes(q) ||
      (i.locationName?.toLowerCase().includes(q)) ||
      (i.description?.toLowerCase().includes(q))
    );
  }, [items, query]);

  return (
    <div className="page">
      <h1>Locations</h1>
      <div className="toolbar">
        <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={load} disabled={loading}>Refresh</button>
      </div>

      {loading ? <div>Loading...</div> : error ? <div className="error">{error}</div> : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Lat</th>
                <th>Lng</th>
                <th>Location</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(loc => (
                <tr key={loc.id}>
                  <td>{loc.id}</td>
                  <td>{loc.name}</td>
                  <td>{loc.lat.toFixed(6)}</td>
                  <td>{loc.lng.toFixed(6)}</td>
                  <td>{loc.locationName || '-'}</td>
                  <td className="truncate">{loc.description || '-'}</td>
                  <td>
                    <button onClick={() => setEdit(loc)}>Edit</button>
                    <button className="danger" onClick={() => setConfirmDelete(loc)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="muted">No locations yet.</div>}
        </div>
      )}

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
              <button onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="danger" onClick={async () => {
                await deleteLocationApi(confirmDelete.id);
                setConfirmDelete(null);
                load();
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}