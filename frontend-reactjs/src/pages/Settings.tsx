import React from 'react'; 
import { getGoogleMapsApiKeyApi } from '../api/http'; 
import MaskedText from '../components/MaskedText'; 

export default function Settings(){ 
  const [key,setKey]=React.useState(''); 
  const [loading,setLoading]=React.useState(true); 
  
  React.useEffect(()=>{ 
    // getGoogleMapsApiKeyApi().then(setKey).finally(()=>setLoading(false)); 
  },[]); 
  
  return (
    <div className="page">
      <h1>Settings</h1>
      <div className="card">
        <h3>Google Maps API Key</h3>
        {loading?'Loading…': key ? <MaskedText value={key}/> : <em>Not configured</em>}
        <p style={{marginTop:12}}>Retrieved from backend (Prisma/AppConfig).</p>
      </div>
    </div>
  );
}
