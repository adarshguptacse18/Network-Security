const express = require('express');
const cors = require('cors')
const database = require('./database');
const {powerMod, getRandomInt, multiplyMod, getRandomPrime} = require("./utils");
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.send("Hello world");
})

app.post('/saveUser', async (req, res) => {
    console.log("Save user");
    try {
        const g = getRandomInt(100000000);
        const n = getRandomPrime();
        // We can use g and n as small values for demonstration purposes. like g = 51 and n = 53
        const username = req.body.username;
        try {
            await database.saveUser(username, g, n);
            res.send({g, n});
        } catch(e) {
            console.log("Something went wrong");
            res.status(500).send(e.message);
        }
    } catch(e) {
        res.status(500).send(e.message);
    }
});


app.post('/saveUserSecret', async (req, res) => {
    const  { username, y } = req.body;
    await database.updateY(username, y);
    res.send("Registration Successful");

});

/***
 * This function retrieves g and n corresponding to username and returns it to the user.
 */
app.post('/loginRequest', async (req, res) => {
    const user = await database.getUser(req.body.username);
    if(!user) {
       return res.status(404).send("User Not Found");

    }
    console.log(user);
    const {g, n} = user;
    res.send({g, n});
});

/***
 * This Function Computes requestArray and saves C in the database.
 */
app.post('/loginRequest2', async (req, res) => {
    const { username, C } = req.body;
    let requestArray = "";
    for(let i = 0; i < C.length; i++) {
        if(Math.random() < 0.5) requestArray += "0";
        else requestArray += "1";
    }
    await database.updateCandRequestArray(username, C, requestArray);
    res.send({
        requestArray,
    });
});

/***
 * This Function is the main verification fuction. 
 */
app.post("/verifyLogin", async (req, res) => {
    try {
        const user = await database.getUser(req.body.username);
        const { w, username } = req.body;
        const g = parseInt(user.g);
        const n = parseInt(user.n);
        const requestarray = user.requestarray;
        const y = JSON.parse(user.y);
        const c = JSON.parse(user.c);

        for(let i = 0; i < requestarray.length; i += 1) {
            const v2 = powerMod(g, w[i], n);
            if(requestarray[i] === '0') {
                const v1 = multiplyMod(y[i], c[i],  n);
                console.log(v1, v2);
                if(v1 !== v2)  return res.status(400).send("Authentication Failed: Wrong Credentials");
            }
            else {
                if(c[i] !== v2) return res.status(400).send("Authentication Failed: Wrong Credentials");
            }
        }
        res.send("Verficication Successful").status(201);
    } catch (e) {
        console.log(e);
        res.send("Internal server error");
    }

});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!');
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));