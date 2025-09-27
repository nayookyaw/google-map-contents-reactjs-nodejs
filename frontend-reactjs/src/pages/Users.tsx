import React from "react";
import { getListUsersApi, createUser } from "../api/http";
import AddUserModal from "../components/AddUserModal";

type User = { id: number; name: string; email: string; role: "ADMIN"|"EDITOR"|"VIEWER"; createdAt: string; };
const ROLES: User["role"][] = ["ADMIN","EDITOR","VIEWER"];
function initials(name:string){ return name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(); }

export default function Users(){
  const [userList, setUserList] = React.useState<User[]>([]);
  const [query, setQuery] = React.useState(""); const [roleFilter, setRoleFilter] = React.useState<""|User["role"]>("");
  const [sortBy, setSortBy] = React.useState<"name"|"createdAt"|"email"|"role">("createdAt");
  const [sortDir, setSortDir] = React.useState<"asc"|"desc">("desc");
  const [page, setPage] = React.useState(1); const [pageSize, setPageSize] = React.useState(10);
  const [openAdd, setOpenAdd] = React.useState(false);

  React.useEffect(()=>{ getUserList(); },[]);

  const getUserList = () => {
    getListUsersApi()
      .then((response: any) => setUserList(response?.data ?? []))
      .catch((err: any) => console.error("Failed to fetch user list", err));
  };

  const filtered = React.useMemo(()=>{
    let data=[...userList];
    if(query.trim()){ const q=query.toLowerCase(); data=data.filter(u=>u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q)); }
    if(roleFilter) data=data.filter(u=>u.role===roleFilter);
    data.sort((a,b)=>{
      const dir = sortDir==='asc'?1:-1; let av:any; let bv:any;
      switch (sortBy){ case 'name': av=a.name.toLowerCase(); bv=b.name.toLowerCase(); break;
        case 'email': av=a.email.toLowerCase(); bv=b.email.toLowerCase(); break;
        case 'role': av=a.role; bv=b.role; break;
        default: av=new Date(a.createdAt).getTime(); bv=new Date(b.createdAt).getTime(); }
      if (av<bv) return -1*dir; if (av>bv) return 1*dir; return 0;
    });
    return data;
  },[userList,query,roleFilter,sortBy,sortDir]);

  const total=filtered.length; 
  const totalPages=Math.max(1, Math.ceil(total/pageSize)); 
  const currentPage=Math.min(page,totalPages);
  const start=(currentPage-1)*pageSize; 
  const pageItems=filtered.slice(start, start+pageSize);

  React.useEffect(()=>{ setPage(1); },[query,roleFilter,pageSize,sortBy,sortDir]);

  const toggleSort=(f: typeof sortBy)=>{ if(sortBy===f) setSortDir(d=>d==='asc'?'desc':'asc'); else { setSortBy(f); setSortDir('asc'); } };
  const sortIndicator=(f: typeof sortBy)=> sortBy!==f ? '' : (sortDir==='asc'?' ▲':' ▼');

  // const handleCreate= async (data:{name:string; email:string; role:User['role']})=>{ const created= await createUser(data); setAll(prev=>[created, ...prev]); };
  const handleCreate = () => {
    
  }

  return (
    <div className="page">
      <div className="users-header" style={{justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'baseline', gap:10}}>
          <h1 className="users-title">Users</h1><span className="users-count">{total} total</span>
        </div>
        <button className="btn btn-primary" onClick={()=>setOpenAdd(true)}>+ Add User</button>
      </div>

      <div className="users-toolbar card">
        <div className="toolbar-row">
          <div className="toolbar-group">
            <input className="input" placeholder="Search by name or email…" value={query} onChange={e=>setQuery(e.target.value)} />
            <select className="select" value={roleFilter} onChange={e=>setRoleFilter(e.target.value as any)}>
              <option value="">All roles</option>{ROLES.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="toolbar-group">
            <label className="label">Per page</label>
            <select className="select" value={pageSize} onChange={e=>setPageSize(Number(e.target.value))}>{[5,10,20,50].map(n=>
              <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="card users-surface">
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th style={{cursor:'pointer'}} onClick={()=>toggleSort('name')}>User{sortIndicator('name')}</th>
                <th className="th-hide-sm" style={{cursor:'pointer'}} onClick={()=>toggleSort('email')}>Email{sortIndicator('email')}</th>
                <th style={{cursor:'pointer'}} onClick={()=>toggleSort('role')}>Role{sortIndicator('role')}</th>
                <th className="th-hide-sm" style={{cursor:'pointer'}} onClick={()=>toggleSort('createdAt')}>Created{sortIndicator('createdAt')}</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(u=>(
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className={`avatar avatar-${u.role.toLowerCase()}`}>{initials(u.name)}</div>
                      <div className="user-meta"><div className="user-name">{u.name}</div>
                      <div className="user-email sm-only">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="th-hide-sm">{u.email}</td>
                  <td><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
                  <td className="th-hide-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {pageItems.length===0 && <tr><td colSpan={4} style={{textAlign:'center', padding:24}}>No users found.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="btn" onClick={()=>setPage(1)} disabled={currentPage===1}>« First</button>
          <button className="btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={currentPage===1}>‹ Prev</button>
          <span className="page-indicator">Page {currentPage} of {totalPages}</span>
          <button className="btn" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages}>Next ›</button>
          <button className="btn" onClick={()=>setPage(totalPages)} disabled={currentPage===totalPages}>Last »</button>
        </div>
      </div>

      <AddUserModal open={openAdd} onClose={()=>setOpenAdd(false)} onSubmit={handleCreate} />
    </div>
  );
}
