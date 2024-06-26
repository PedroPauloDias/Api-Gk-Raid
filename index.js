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



app.get("/api/players/",  async (req, res) => {
  const Players = await Player.find()
  return res.send(Players);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});