import React from 'react'; 
import { getGoogleMapsApiKeyApi } from '../api/http'; 
import MaskedText from '../components/MaskedText'; 

export default function Settings(){ 
  const [googleApiKey,setGoogleApiKey]=React.useState(''); 
  const [loading,setLoading]=React.useState(true); 
  
  React.useEffect(()=>{ 
    getGoogleMapsApiKey();
  },[]);

  const getGoogleMapsApiKey = () => {
    console.log ('Fetching Google Maps API key from backend...');
    getGoogleMapsApiKeyApi()
      .then((res: any) => {
        setGoogleApiKey(res?.data?.apiKey || "-");
        setLoading(false);
      })
      .catch((e: any) => {
        console.error("Failed to load Google Maps API key", e);
        setGoogleApiKey("");
      });
  }
  
  return (
    <div className="page">
      <h1>Settings</h1>
      <div className="card">
        <h3>Google Maps API Key</h3>
        {loading?'Loading…': googleApiKey ? <MaskedText value={googleApiKey}/> : <em>Not configured</em>}
        <p style={{marginTop:12}}>Retrieved from backend (Prisma/AppConfig).</p>
      </div>
    </div>
  );
}
