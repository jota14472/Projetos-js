const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const path = require("path");
//const dbConfig = require("../config/db");


const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

const CONNECTION_STRING = dbConfig.CONNECTION_STRING;

const DATABASENAME = "Loja";
let database;

MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) throw error;
    database = client.db(DATABASENAME);
    console.log("Conexão ao MongoDB bem-sucedida");
});

// Rota para obter 3 produtos novos
app.get('/products/newarrival', (req, res) => {
    database.collection('products').find({ newarrival: true }).limit(3).toArray((error, result) => {
        if (error) throw error;
        res.send(result);
    });
});

// Rota para obter 2 produtos favoritos
app.get('/products/favourite', (req, res) => {
    database.collection('products').find({ favourite: true }).limit(2).toArray((error, result) => {
        if (error) throw error;
        res.send(result);
    });
});

// Rota para inserir um email na coleção newsletter
app.post('/newsletter', (req, res) => {
    const email = req.body.email;
    database.collection('newsletter').insertOne({ email: email }, (error, result) => {
        if (error) throw error;
        res.send({ message: "Email inserido com sucesso" });
    });
});

const PORT = process.env.PORT || 5040;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
