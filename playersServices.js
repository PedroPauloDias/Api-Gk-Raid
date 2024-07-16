import axios from 'axios';
const baseUrl = 'https://api-gk-raid.vercel.app/api';
export  function getAllPlayers() {
  
  const response =  axios.get(`${baseUrl}/players/`)  
  return response;
};

export  function getAllPlayersClan() {
  
  const response =  axios.get(`${baseUrl}/players/${clan}`)  
  return response;
};


export function createPlayer(body){    
  const response =  axios.post(`${baseUrl}/players/`, body)  
  return response;
}

export function getPlayersById(id) {
  const response =  axios.get(`${baseUrl}/players/${id}`)  
  return response;
 }


 export const getSinglePlayer = async (id) => {
  try {
    const response = await getPlayersById(id);
    const singlePlayer = response.data; // Extrai os dados da resposta axios
    return singlePlayer;
  } catch (error) {
    console.error('Erro ao buscar jogador:', error);
    throw error; // Lança o erro novamente para ser tratado onde a função foi chamada
  }
};


export function editPlayer(body, id) {
  const response =  axios.put(`${baseUrl}/players/${id}`, body)  
  return response;
}

export function deletePlayer(id) {
  const response =  axios.delete(`${baseUrl}/players/${id}`)  
  return response;
}