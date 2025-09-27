import axios from 'axios'; 

const baseURL=process.env.REACT_APP_API_BASE_URL||'http://localhost:4000';

export const http=axios.create({baseURL}); 

export async function getGoogleMapsApiKeyApi() {
  try {
    const response = await http.get('/api/config/google-maps-key'); 
    return response;
  } catch (error) {
    return error;
  }
}

export async function getListLocationsApi(){
  try {
    const response = await http.get('/api/locations'); 
    return response;
  } catch (error) {
    return error;
  }
}

export async function createLocationApi(payload:{name:string;lat:number;lng:number;description?:string}){ 
  const response = await http.post('/api/locations', payload); 
  return response; 
}

export async function getListUsersApi(){ 
  const response = await http.get('/api/users'); 
  return response; 
}

export async function createUserApi(payload:{name:string;email:string;role:'ADMIN'|'EDITOR'|'VIEWER'}){ 
  const response = await http.post('/api/users', payload); 
  return response; 
}
