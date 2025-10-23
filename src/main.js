import {View} from "./view.js";
import {textFileFromPath, parseCSV} from "./io.js";

const view = new View(document.getElementById("threeCanvas"));

// Add objects according to data file
textFileFromPath("./tetrahedron.csv").then(text => {
    view.addObjects(parseCSV(text));
});