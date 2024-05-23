const configDB = require('../config/usuarios-bd');
const secret = require('../../config.json').secret;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRepository = require('../repository/usuarios-repository');

const setHash = async (pass) => {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(pass, salt);
}

const openUserSession = (id, username) => {
    return jwt.sign({ id, username }, secret, { expiresIn: 86400 });
}

class UsuariosController {

    async getUsers(req, res) {
        const connection = new configDB();
        try {
            await connection.connect();

            const users = await usersRepository.getUsers(connection);
            res.status(200).json({ message: 'Usuários encontrados:', users });
        } catch (err) {
            console.log('Erro ao buscar usuários!', err.message);
            res.status(500).json({ message: 'Erro ao buscar usuários!', error: err.message });
        } finally {
            connection.close();
        }
    }

    async registerUser(req, res) {
        const connection = new configDB();
        try {
            await connection.connect();

            const userData = req.body;
            const hash = await setHash(userData.usuario_senha);
            userData.usuario_senha = hash;
            console.log(userData);
            await usersRepository.registerUser(userData, connection);
            res.status(301).json({ message: 'Usuário cadastrado com sucesso!' });
        } catch (err) {
            console.log("Erro ao tentar registrar usuário:", err.message.substring(7, err.message.length));
            res.status(500).json({ message: 'Erro ao registrar usuário!', error: err.message });
        } finally {
            connection.close();
        }
    }

    async updateUser(req, res) {
        const connection = new configDB();
        try {
            await connection.connect();

            const user = {
                userId: req.body.userId,
                newUserData: req.body.newUserData
            }

            await usersRepository.updateUser(user, connection);
            res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        } catch (err) {
            console.log('Erro ao atualizar o usuário:', err.message.substring(7, err.message.length));
            res.status(500).json({ message: 'Erro ao atualizar o usuário!', error: err.message });
        } finally {
            connection.close();
        }
    }

    async updatePassword(req, res) {
        const connection = new configDB();
        try {
            await connection.connect();
            const { userId, newUserPass } = req.body;
            const hash = await setHash(newUserPass);
            
            const user = {
                userId,
                usuario_senha: hash
            }

            await usersRepository.updatePassword(user, connection);
            res.status(200).json({ message: 'Senha alterada com sucesso!' });
        } catch (err) {
            console.log('Não foi possível alterar a senha:', err.message.substring(7, err.message.length));
            res.status(500).json({ message: 'Não foi possível alterar a sua senha, tente novamente mais tarde.', error: err.message });
        } finally {
            connection.close();
        }
    }

    async deleteUser(req, res) {
        const connection = new configDB();
        try {
            await connection.connect();
            const userId = req.query.userId;
            await usersRepository.deleteUser(userId, connection);
            res.status(200).json({ message: 'Usuário excluído com sucesso!' });
        } catch (err) {
            console.log('Erro ao tentar excluir usuário!', err.message.substring(7, err.message.length));
            res.status(500).json({ message: 'Erro ao tentar excluir usuário:', error: err.message });
        } finally {
            connection.close();
        }
    }

    async userLogin(req, res) {
        const connection = new configDB();
        try {
            await connection.connect();
            const { username, password } = req.body;
            const { usuario_id, usuario_nome, usuario_senha } = await usersRepository.userLogin(username, connection);
            
            const correctPass = await bcrypt.compare(password, usuario_senha);

            if (!correctPass) {
                throw new Error('Usuário ou senha incorretos!');
            }

            const token = openUserSession(usuario_id, usuario_nome);

            res.status(200).json({ message: 'Login feito com sucesso!', token });
        } catch (err) {
            console.log('Erro ao fazer login:', err.message.substring(7, err.message.length));
            res.status(500).json({ message: 'Erro ao fazer login', err: err.message });
        } finally {
            connection.close();
        }
    }

}

module.exports = new UsuariosController();