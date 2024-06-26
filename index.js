const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();


const app = express();

const port = process.env.PORT || 3000;

const mongoDbUri = process.env.MONGODB_URI;
console.log('MongoDB URI:', mongoDbUri);

// Conectar ao MongoDB
mongoose.connect(mongoDbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB.');
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
})


// Modelo de dados para os clãs
const ClanSchema = new mongoose.Schema({
  name: String,
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
});

const Clan = mongoose.model('Clan', ClanSchema);

const Player = mongoose.model('Player', {
  name: String,
  tag: String,
  clan: String,
  chavesJogadas: Number,
  hydraClash: String,
  mediaHydraClash: String,
  pontosCvc: String,
  status: String,
  detalhes: String,
});




const opponentSchema = new mongoose.Schema({
  clanName: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  keysPlayed: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
});

const hydraClashSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  teams: {
    type: [opponentSchema], 
    required: true,
    validate: {
      validator: function (value) {
        return value.length === 5;
      },
      message: "A HydraClash team must have exactly 5 opponents"
    }
  }
}, { timestamps: true });

// Criação do modelo a partir do esquema
const HydraClash = mongoose.model('HydraClash', hydraClashSchema);







app.get("/api/players/",  async (req, res) => {
  const Players = await Player.find()
  return res.send(Players);
});

app.get("/api/players/:id",  async (req, res) => {
  const player = await Player.findById(req.params.id);
  return res.send(player);  
});

app.get("/api/clans", async (req, res) => {
  const clans = await Clan.find();
  return res.send(clans);
});


app.get("/api/players/unholy", async (req, res) => {
  try {
    // Buscar todos os jogadores com o clã "Unholy"
    const players = await Player.find({ clan: "Unholy" });

    return res.json(players);
  } catch (error) {
    console.error("Erro ao buscar jogadores do clã Unholy:", error);
    return res.status(500).json({ message: "Erro ao buscar jogadores do clã Unholy" });
  }
});


app.get("/api/players/cursed", async (req, res) => {
  try {
    // Buscar todos os jogadores com o clã "cursed"
    const players = await Player.find({ clan: "Cursed" });

    return res.json(players);
  } catch (error) {
    console.error("Erro ao buscar jogadores do clã Cursed:", error);
    return res.status(500).json({ message: "Erro ao buscar jogadores do clã Unholy" });
  }
});


app.get("/api/players/fallen", async (req, res) => {
  try {
    // Buscar todos os jogadores com o clã "fallen"
    const players = await Player.find({ clan: "Fallen" });

    return res.json(players);
  } catch (error) {
    console.error("Erro ao buscar jogadores do clã Fallen:", error);
    return res.status(500).json({ message: "Erro ao buscar jogadores do clã Fallen" });
  }
});

app.get("/api/players/corrupted", async (req, res) => {
  try {
    // Buscar todos os jogadores com o clã "corrupted"
    const players = await Player.find({ clan: "Corrupted" });

    return res.json(players);
  } catch (error) {
    console.error("Erro ao buscar jogadores do clã Unholy:", error);
    return res.status(500).json({ message: "Erro ao buscar jogadores do clã Unholy" });
  }
});





app.get("/api/clans/:clanId", async (req, res) => {
  try {
    const clanId = req.params.clanId;
    const clan = await Clan.findById(clanId);
    if (!clan) {
      return res.status(404).json({ message: "Clã não encontrado" });
    }
    const members = await Player.find({ clan: clanId });
    return res.json(members);
  } catch (error) {
    console.error("Erro ao obter membros do clã:", error);
    return res.status(500).json({ message: "Erro ao obter membros do clã" });
  }
});


app.delete("/api/players/:id", async (req, res) => {
  const player = await Player.findByIdAndDelete(req.params.id);
  return res.send(player);
})

app.put("/api/players/:id", async (req, res) => {
  const player = await Player.findByIdAndUpdate(req.params.id, {
    clan: req.body.clan,
    chavesJogadas: req.body.chavesJogadas,
    hydraClash: req.body.hydraClash,
    mediaHydraClash: req.body.mediaHydraClash,
    pontosCvc: req.body.pontosCvc,
    status: req.body.status,
    detalhes: req.body.detalhes
  }, {
    new: true
  });
  return res.send(player);
})

app.post("/api/players", async (req, res) => {
  const player = new Player({
    name: req.body.name,
    tag: req.body.tag,
    clan: req.body.clan,
    chavesJogadas: req.body.chavesJogadas,
    hydraClash: req.body.hydraClash,
    mediaHydraClash: req.body.mediaHydraClash,
    pontosCvc: req.body.pontosCvc,
    status: req.body.status,
    detalhes: req.body.detalhes
  });
  await player.save();
  return res.send(player);
});


app.post("/api/hydraclash", async (req, res) => {
  try {
    console.log(req.body); // Visualiza o conteúdo do corpo da requisição


    // Extrair as datas do corpo da solicitação e converter para objetos Date
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    // Criar uma nova instância do modelo HydraClash com os dados enviados pelo formulário
    const hydraClash = new HydraClash({
      startDate: startDate,
      endDate: endDate,
      teams: req.body.teams,
    });
    

    // Salvar os dados no banco de dados
    await hydraClash.save();

    res.status(201).send("hydraClash added successfully!");
  } catch (error) {
    console.error("Error adding hydraClash:", error);
    res.status(500).send("Failed to add hydraClash");
  }
});

app.get("/api/hydraclash/", async (req, res) => {
  
  try {
    const hydraClashes = await HydraClash.find();
    res.send(hydraClashes);
  } catch (error) {
    console.error("Error fetching hydra clashes:", error);
    res.status(500).send("Failed to fetch hydra clashes");
  }
});


app.get('/api/hydraclash', async (req, res) => {
  // Obter parâmetros de consulta da requisição
  const clan = req.query.clan;

  try {
    // Consultar todos os registros da coleção HydraClashes com base no nome do clã
    const teams = await HydraClash.find({ "teams.clanName": clan });

    // Se foram encontrados registros, retorna-os
    if (teams.length > 0) {
      return res.json(teams);
    } else {
      // Se nenhum registro foi encontrado, retorna uma mensagem de erro
      return res.status(404).json({ message: "Nenhum registro encontrado para o clã fornecido" });
    }
  } catch (error) {
    console.error("Erro ao buscar registros da coleção HydraClashes:", error);
    // Retornar uma resposta de erro com status 500 e uma mensagem personalizada
    return res.status(500).json({ message: "Erro ao buscar registros da coleção HydraClashes" });
  }
});


app.get('/api/hydraclash/clan', async (req, res) => {
  const clan = req.query.clan;

  try {
    // Consultar registros da coleção HydraClashes onde o clã selecionado está presente na lista de equipes
    const clanTeams = await HydraClash.find({ "teams.clanName": clan });

    // Se foram encontrados registros, retorna-os
    if (clanTeams.length > 0) {
      return res.json(clanTeams);
    } else {
      // Se nenhum registro foi encontrado, retorna uma mensagem de erro
      return res.status(404).json({ message: `Nenhum registro encontrado para o clã ${clan}` });
    }
  } catch (error) {
    console.error("Erro ao buscar registros da coleção HydraClashes:", error);
    // Retornar uma resposta de erro com status 500 e uma mensagem personalizada
    return res.status(500).json({ message: "Erro ao buscar registros da coleção HydraClashes" });
  }
});







app.get('/api/hydraclash', async (req, res) => {
  // Obter parâmetros de consulta da requisição
  const clan = req.query.clan;
  const date = req.query.date;

  try {
    // Consultar o registro da equipe HydraClash com base nos parâmetros fornecidos
    const team = await HydraClash.findOne({ 
      clanName: clan, 
      startDate: new Date(date),
      
    });

    // Se a equipe foi encontrada, retorna o registro
    if (team) {
      return res.json(team);
    } else {
      // Se a equipe não foi encontrada, retorna uma mensagem de erro
      return res.status(404).json({ message: "Registro não encontrado para o clã e data fornecidos" });
    }
  } catch (error) {
    console.error("Erro ao buscar registro da equipe HydraClash:", error);
    // Retornar uma resposta de erro com status 500 e uma mensagem personalizada
    return res.status(500).json({ message: "Erro ao buscar registro da equipe HydraClash" });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});