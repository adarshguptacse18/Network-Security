function isLower(c) {
    return (c >= 'a' && c <= 'z');
}
function isUpper(c) {
    return (c >= 'A' && c <= 'Z');
}
// This functions a character x such that (x + c) == 25 (0 based indexing)
function calculateComplement(c) {
    let base;             
    if(isUpper(c)) {         //lowercase
        base = 65;
    } else if(isLower(c)) {  //uppercase
        base = 97;
    }
    else return c;                                         //returns the same if the character is not a english alphabet
    const resCode = 25 - (c.charCodeAt(0) - base) + base;  // apply our logic and add base value to the resulting value
    return String.fromCharCode(resCode);                   // returns the character at that ascii value
}
// this function returns applies the logic to whole code
const encodeDecode = (str) => [...str].map(calculateComplement).join('');

const [ plainInput, encryptedInput ] = document.getElementsByName('encryptData');
const lastOperation = document.getElementsByName('lastOperation')[0];
plainInput.oninput = () => {
    encryptedInput.value = encodeDecode(plainInput.value);
    lastOperation.textContent = "Enryption Successful";
}
encryptedInput.oninput = () => {
    plainInput.value = encodeDecode(encryptedInput.value);
    lastOperation.textContent = "Decryption Successful";
}