const N = 5; // Total Number of extra plain text / keys

// Helper function to negate one position of binary string
const replaceAt = (str, pos) => {
    return str.substring(0, pos) + (str[pos] == '0' ? '1' : '0') + str.substring(pos + 1);
};

// hamming distance calculator
const hammingDistance = (s1, s2) => {
    let dist = 0
    for (let i = 0; i < 64; i++) {
      dist += s1[i] != s2[i] ? 1 : 0
    }
    return dist
}

// function to generate strings with 1 hamming distance
const generateStringWithHD1 = hex => {
    const binaryMsg = bin(hex)
    const data = [
      {
        bin: binaryMsg,
        hex
      }
    ]
    for(let i = 0; i < 5; i++) {
        // Negating ith character of our base string 
        const cur = replaceAt(binaryMsg, i);
        data.push({
            bin: cur,
            hex: binaryToHex(cur)
        });
    }
    return data
  }

// function to generate strings with different hamming distance
const generateStringWithDiffHD = (hex) => {
    const binaryMsg = bin(hex)
    const data = [
      {
        bin: binaryMsg,
        hex
      }
    ];

    for(let i = 0; i < 5; i++) {
        // negative first i characters to generate new string (0 -based indexing)
        let cur = replaceAt(binaryMsg, 0);
        for(let j = 1; j <= i; j++) {
            cur = replaceAt(cur, j);
        }
        data.push({
            bin: cur,
            hex: binaryToHex(cur)
        });
    }
    return data;
};

// Create table
const displayOnTable = (res) => {
    // formatting data and styling table to present on the table
    let transposedData = res[0].map((_, colIndex) => res.map(row => row[colIndex]));
    transposedData = [[], ...transposedData];
    for(let i = 0; i <= 16; i++) transposedData[0].push(i);
    const data = [{
        type: 'table',
        columnwidth: [400],

        header: {
            values: [["<b>Round</b>"], ["<b>P1</b>"], ["<b>P2</b>"],
                        ["<b>P3</b>"], ["<b>P4</b>"], ["<b>P5</b>"]],
            align: ["center"],
            line: {width: 1, color: '#506784'},
            fill: {color: '#119DFF'},
            font: {family: "Arial", size: 20, color: "white"}
        },
        cells: {
            values: transposedData,
            align: ["center"],
            height: 30,
            line: {color: "#506784", width: 1},
            fill: {color: ['#25FEFD', 'white']},
            font: {family: "Arial", size: 17, color: ["#506784"]}
        }
    },
    ]
    Plotly.newPlot('distances', data, {height: 1000})
}


const plotGraph = (res) => {
    let data = [];
    for(let round = 0; round < 17; round++) {
        data.push({
            y: res[round],
            type: 'box',
            name: `Round ${round}`,
        });
    }
    Plotly.newPlot('graphPlot', data, {height: 700});
};

const generateHammingDistanceTableValues = data => {
    const result = []
    // for every round and every data finding the hamming distance from base string of that round
    for (let round = 0; round < 17; round++) {
      const distances = []
      for (let ind = 1; ind < data.length; ind++) {
        distances.push(
          hammingDistance(
            data[ind].data[round].binary,
            data[0].data[round].binary
          )
        )
      }
      result.push(distances)
    }
    return result
  }
  
  //helper function to convert binary to hexadecimal
  const binaryToHex = (msg) => {
    let res = chunkString(msg, 4).map(binToHex).join("").toUpperCase();
    if(res.length != 16) res = '0' + res;
    return res;
  }

  // function to define functionality of three buttons as shown in the homepage
  const buttonFunctionsInitialize = () => {
    const className = "btn btn-lg btn-block m-1";
    const button1 = document.getElementById("type1");
    const button2 = document.getElementById("type2");
    const button3 = document.getElementById("type3");
    const buttonsList = [button1, button2, button3];
    const handleButtonClick = (button, func) => {
        buttonsList.forEach((b) => b.className = className + " bg-primary");
        button.className = className + " bg-success";
        key = keyDiv.value;
        msg = plainTextDiv.value;
        func();
        const { cipherText } = encodeHex(plainTextDiv.value, keyDiv.value);
        console.log(cipherText);
        cipherTextDiv.value = cipherText;
    }
    button1.onclick = () => handleButtonClick(button1, type1);
    button2.onclick = () => handleButtonClick(button2, type2);
    button3.onclick = () => handleButtonClick(button3, type3);
  }
