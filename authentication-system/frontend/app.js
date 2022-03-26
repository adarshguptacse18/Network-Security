const promisifiedRequest = async function(options) {
    console.log(options.url);
    return await fetch(options.url, options);
};

const getRandomInt = (max) => Math.floor(Math.random() * max);

const powerMod = (A, B, MOD) => {
    let a = BigInt(A);
    let b = BigInt(B);
    let mod = BigInt(MOD);
    let res = 1n;
    while(b) {
        if((b % 2n)) res = res * a % mod;
        a = a * a % mod;
        b >>= 1n;
    }
    return Number(res);
}


// const password = "iamwatchingyou";
// const username = 'addy23';


async function makeRequest(url, body) {
    const options = {
        'method': 'POST',
        'url': `http://localhost:3000/${url}`,
        'headers': {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)

    };
    const res = await promisifiedRequest(options);
    const contentType = res.headers.get('content-type');
    console.log(res);
    if(res.status.toString().startsWith('4') || res.status.toString().startsWith('5')) {
        const error = await res.text();
        document.getElementById('welcomeDiv').style.display = "none";
        showToast(error);
        throw Error(error)
    }
    if (contentType.startsWith('application/json;'))  {
        return await res.json();
    } else {
        return await res.text();
    }
}

async function register(username) {
    console.log(username);
    return await makeRequest('saveUser', {username});
}


//
function hashPassword(password, modulo) {
    const hashString = (MD5(password));
    return parseInt(hashString, 16) % modulo;
}
function convertPasswordToSets(password, n) {
    let passwordSets = [];
    for(let i = 0, len = 1; i < password.length; i += 1, len += 1) {
        let curPassword = '';
        for(let j = i; j < password.length; j += len) {
            curPassword += password[j];
        }
        passwordSets.push(curPassword);
    }
    passwordSets = passwordSets.map((p) =>
        (hashPassword(p, n))
    );
    // return [102304];
    // return [1, 2, 3, 4];
    return passwordSets;
}

async function fullRegisterFlow(username, password) {
    try {
        const { g, n } = (await register(username));
        const x = convertPasswordToSets(password, n);
        const y = x.map((v) => powerMod(g, v, n));
        console.log(y);
        const res = await makeRequest('saveUserSecret', {username, y});
        console.log('Registration Successful');
        document.getElementById('welcomeDiv').style.display = "none";


        showToast('Registration Successful');
    } catch (e) {
        document.getElementById('welcomeDiv').style.display = "none";
        showToast(e.message);
        // showToast("User already exists or something went wrong");
    }
    

}

async function  login(username, password) {
    // await fullRegisterFlow();
    
    const res = await makeRequest('loginRequest', {username});
    const {g, n} = res;
    console.log(res);
    const x = convertPasswordToSets(password, n);
    const C = [];
    const Z = [];
    for(let i = 0; i < x.length; i++) {
        const z = getRandomInt(100);
        Z.push(z);
        C.push(powerMod(g, z, n));
    }
    const { requestArray } = await makeRequest('loginRequest2', {username, C, x: Z[0]});
    const w = [];
    for(let i = 0; i < requestArray.length; i += 1) {
        if(requestArray[i] === '0') {
            w.push((x[i] + Z[i]) % (n - 1));
        }
        else {
            w.push(Z[i]);
        }
    }
    const verdict = await makeRequest('verifyLogin', {username, w});
    console.log(verdict);
    document.getElementById('welcomeDiv').style.display = "none";

    showToast(verdict);
    
}



const loginButton = document.getElementById('login');
const registerButton = document.getElementById('register');
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username');
if(loginButton) {
    loginButton.onclick = () => {
         
        
        document.getElementById('welcomeDiv').style.display = "block";
       
        const { username, password } = fetchUserNamePassword();
        login(username, password);
        
    }
}

if(registerButton) {
    registerButton.onclick = () => {
        document.getElementById('welcomeDiv').style.display = "block";
        const { username, password } = fetchUserNamePassword();
        fullRegisterFlow(username, password);
    }
}


function fetchUserNamePassword() {
    return {
        username: usernameInput.value,
        password: passwordInput.value,
    }
}

//
