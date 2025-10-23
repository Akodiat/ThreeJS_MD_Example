import {View} from "./view.js";
import {textFileFromPath, parseCSV} from "./fileIO.js";
import {setupSelections} from "./selections.js";

const view = new View(
    document.getElementById("threeCanvas")
);

// Add objects according to data file
textFileFromPath("./tetrahedron.csv").then(text => {
    view.initObjects(parseCSV(text));
});

// Load new data when a file is uploaded by the user
const fileInput = document.getElementById("fileInput");
fileInput.onchange = () => {
    fileInput.files[0].text().then(text =>
        view.initObjects(parseCSV(text))
    );
};

setupSelections(view, 'dblclick');
