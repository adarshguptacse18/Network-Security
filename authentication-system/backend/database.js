const { Client } = require('pg');

const client = new Client({
    "host": process.env.host,
    "post": "5432",
    "user": process.env.user,
    "password": process.env.password,
    "database": process.env.database,
});


async function init() {
    try {
        await client.connect();
        await client.query("create table if not exists users (\n" +
            "    username varchar(30) PRIMARY KEY,\n" +
            "    g text,\n" +
            "    n text,\n" +
            "    y text,\n" +
            "    requestArray text,\n" +
            "    C text\n" +
            ")");
        console.log("Connected to the database");
    } catch (e) {
        console.log(e.message);
    }
}

init();

class Database {
    async saveUser(username, g, n) {
        await client.query("INSERT INTO users (username, g, n) VALUES ($1, $2, $3)", [username, g, n]);
        console.log("User saved");
    }

    async updateY(username, y) {
        await client.query("UPDATE users SET y = $1 where username = $2", [JSON.stringify(y), username]);
        console.log("Y saved");
    }

    async getUser(username) {
        const result = await client.query("SELECT * FROM users where username = $1", [username]);
        // console.log(result.rows[0]);
        return result.rows[0];
    }

    async updateCandRequestArray(username, C, requestArray) {
        await client.query("UPDATE users SET requestArray = $1, C = $2 where username = $3", [requestArray, JSON.stringify(C), username]);
        console.log("C and requstArray saved");
    }
}


module.exports = new Database();
