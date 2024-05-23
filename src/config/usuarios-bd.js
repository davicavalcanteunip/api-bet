const mysql = require('mysql2');
const configDB = require('../../config.json').database;

class usersDatabase {

    constructor() {
        this.connection = mysql.createConnection({
            host: configDB.host,
            user: configDB.user,
            password: configDB.password,
            database: configDB.name
        });
    }

    async connect() {
        try {
            return new Promise((resolve, reject) => {
                this.connection.connect((err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    console.log("Conexão com o banco de dados feita com sucesso!");
                    resolve();''
                });
            });
        } catch (err) {
            console.log('Erro ao tentar se conectar ao Banco de Dados:', err);
        }
    }

    query(sql, values) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, values, (err, results, fields) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }

    close() {
        this.connection.end((err) => {
            if (err) {
                return console.log('Erro ao fechar conexão com o Banco de Dados!');
            }

            console.log('Conexão com Banco de Dados fechada com sucesso!');
        });
    }
}

module.exports = usersDatabase;