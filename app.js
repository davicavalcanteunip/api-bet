const express = require('express');
const app = express();

const usersRoutes = require('./src/routes/usuarios');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/usuario', usersRoutes);

app.use('/', (req, res) => {
    res.send("Servidor rodando!");
});

app.listen(3000, () => {
    console.log('Servidor escutando em http://localhost:3000')
});