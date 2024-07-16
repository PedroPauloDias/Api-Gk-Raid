import axios from 'axios';

const baseUrl = 'https://api-gk-raid.vercel.app/api:3000/api';
export async function createAdmin(body){    
  const response = await axios.post(`${baseUrl}/register/`, body)  
  return response;
}


export async function getAllAdmins() {
  const response = await axios.post(`${baseUrl}/login/`);
  return response;
}