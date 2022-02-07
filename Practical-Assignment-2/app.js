// Default values
let msg = '0c7c95cb8331b5b5'
let key = '0b92d7538fb3f10f'


// some html handling code
const plainTextDiv = document.getElementById('plainText');
const keyDiv = document.getElementById('key');
const cipherTextDiv =  document.getElementById('cipherText');

//initialzing default values and button functions
function init() {
    plainTextDiv.value = msg;
    keyDiv.value = key;
    buttonFunctionsInitialize();
}

//Five plaintext with hamming distance: 1
function type1() {
    const plainTxts = generateStringWithHD1(msg);
    // applying DES on all plaintexts
    const finalData = plainTxts.map(data => {
      return {
        ...data,
        ...encodeHex(data.hex, key)
      }
    })
    //calculating all HammingDistances
    const res = generateHammingDistanceTableValues(finalData)
    plotGraph(res);
    displayOnTable(res);
    
}

//Five plaintext with different hamming distances
function type2() {
    const plainTxts = generateStringWithDiffHD(msg)
    // applying DES on all plaintexts
    const finalData = plainTxts.map(data => {
      return {
        ...data,
        ...encodeHex(data.hex, key)
      }
    })
    //calculating all HammingDistances
    const res = generateHammingDistanceTableValues(finalData)
    plotGraph(res);
    displayOnTable(res);
}

//Five keys with hamming distance: 1
function type3() {
    const keys = generateStringWithHD1(key);
    let ind = 0;
    // Here plaintext is same. So, applying DES on using all keys on plainText
    // In encodeHex we are here passing plainText and data.hex is the new key
    const finalData = keys.map(data => {
        console.log(ind, hammingDistance(data.bin, keys[0].bin));
        ind += 1;
        return {
            bin: bin(msg),
            hex: msg,
            ...encodeHex(msg, data.hex)
        }
    })
    //calculating all HammingDistances
    const res = generateHammingDistanceTableValues(finalData)
    plotGraph(res);
    displayOnTable(res);
}


init();
