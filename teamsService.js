import axios from 'axios';

const baseUrl = 'https://api-gk-raid.vercel.app/api';

export async function getAllTeams() {
  const response = await axios.get(`${baseUrl}/hydraclash/`);
  return response;
}

export async function getclan(clan) {
  const response = await axios.get(`${baseUrl}/hydraclash/clan?clan=${clan}`); 
  return response;
}


export function createHydraClash(body) {
    // Retornar a Promise diretamente
    return axios.post(`${baseUrl}/hydraclash/`, body);
}


export async function getTeamsByClanAndDate(formData, formattedDateString) {
  try {
    // Faz a requisição GET para o endpoint '/api/hydraclash' com os parâmetros de consulta 'clan' e 'date'
    const response = await axios.get(`${baseUrl}/hydraclash/`, {
      params: {
        clan: formData.clan,
        date: formattedDateString
      }
    });
    // Retorna os dados da resposta
    return response.data;
  } catch (error) {
    // Se ocorrer um erro, lança uma exceção ou retorna null, dependendo da sua necessidade
    throw new Error(`Erro ao buscar equipes HydraClash: ${error.message}`);
  }
}