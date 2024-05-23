class UsuariosRepository {

    async getUsers(conn) {
        try {
            const query = 'SELECT * FROM cadastros_usuarios';
            const users = await conn.query(query);
            return users;
        } catch (err) {
            throw new Error(err);
        }
    }

    async registerUser(userData, conn) {
        try {
            const query = 'INSERT INTO cadastros_usuarios SET ?';
            await conn.query(query, userData);
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateUser(user, conn) {
        const { userId , newUserData } = user;
        try {
            const query = `UPDATE cadastros_usuarios SET ? WHERE usuario_id = ${userId}`;
            await conn.query(query, newUserData);
        } catch (err) {
            throw new Error(err);
        }
    }

    async updatePassword(user, conn) {
        const { userId, usuario_senha } = user;
        try {
            const query = `UPDATE cadastros_usuarios SET ? WHERE usuario_id = ${userId}`
            await conn.query(query, { usuario_senha });
        } catch (err) {
            throw new Error(err);
        }
    }

    async deleteUser(userId, conn) {
        try {
            const query = `DELETE FROM cadastros_usuarios WHERE usuario_id = ${userId}`;
            await conn.query(query);
        } catch (err) {
            throw new Error(err);
        }
    }

    async userLogin(username, conn) {
        try {
            const query = 'SELECT usuario_id, usuario_nome, usuario_senha FROM cadastros_usuarios WHERE usuario_nome = ?';
            const userLogin = await conn.query(query, username);

            if (userLogin.length < 1) {
                throw new Error('Nome de usuário não encontrado!');
            }

            return userLogin[0];
        } catch (err) {
            throw new Error(err);
        }
    }

}

module.exports = new UsuariosRepository();