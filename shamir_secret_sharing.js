const fs = require('fs');

// The Below function read the JSON file (testcase1.json & testcase2.json) then parse the data.
function readParseJSONFile(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return JSON.parse(data);
}

// The below Function  converts the  values from given base to decimal
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Iam using lagrange interpolation method to  find constant term so the below  Function is to perform Lagrange interpolation and returns the  constant term
function lagrangeInterpolation(points) {
    let c = 0;
    for (let i = 0; i < points.length; i++) {
        let [x_i, y_i] = points[i];
        let term = y_i;
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let [x_j] = points[j];
                term *= -x_j / (x_i - x_j);
            }
        }
        c += term;
    }
    return Math.round(c);
}

// Main function to process input JSON and compute secret (constant term)
function findSecret(filename) {
    const jsonData = readParseJSONFile(filename);
    const { n, k } = jsonData.keys;
    
    let points = [];
    for (let key in jsonData) {
        if (key !== "keys") {
            let x = parseInt(key);
            let y = decodeValue(jsonData[key].base, jsonData[key].value);
            points.push([x, y]);
        }
    }
    
    // Sort and pick the first k points for interpolation
    points.sort((a, b) => a[0] - b[0]);
    const selectedPoints = points.slice(0, k);
    
    // Compute the constant term using Lagrange interpolation
    return lagrangeInterpolation(selectedPoints);
}

// Run for both test cases
console.log("Secret for first testcase:", findSecret('testcase1.json'));
console.log("Secret for second testcase:", findSecret('testcase2.json'));