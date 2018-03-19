const path = require("path");
const solc = require("solc");
const fs = require("fs-extra"); // filesyystem module with helpers 

// Build Foolder mit alten kompilierten Files löschen, falls neu konpiliert werden muss
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// Files einlesen
const contractPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const contractSource = fs.readFileSync(contractPath, "utf8");

// Kompilieren
const compiledOutput = solc.compile(contractSource, 1).contracts;

// Neuer Build Folder
fs.ensureDirSync(buildPath);

// compiledOutput Objekt auslesen 
for (let contract in compiledOutput) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":","") + ".json"),
    compiledOutput[contract]
  );
}
