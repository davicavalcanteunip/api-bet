const express = require('express');
const routes = express.Router();

const usuariosController = require('../controllers/usuarios-controller');

routes.get('/buscar', usuariosController.getUsers); // Permissão de admin

routes.post('/registrar', usuariosController.registerUser); // Público
routes.post('/login', usuariosController.userLogin); // Público

routes.put('/alterar', usuariosController.updateUser); // Permissão para usuários logados
routes.put('/alterarsenha', usuariosController.updatePassword); // Permissão para usuários logados

routes.delete('/excluir', usuariosController.deleteUser); // Permissão para usuários logados

module.exports = routes;