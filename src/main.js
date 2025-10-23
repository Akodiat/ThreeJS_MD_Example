import {View} from "./view.js";
import {textFileFromPath, parseCSV} from "./io.js";
import * as THREE from "three";

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

const infoText = document.getElementById("infoText");
view.canvas.addEventListener('dblclick', event => {
    event.preventDefault();

    const rect = view.canvas.getBoundingClientRect()
    const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    console.log(mouse)

    const object = view.getClickedObject(mouse);

    if (object !== undefined) {
        infoText.innerHTML = `Type: ${object.type}, Strand id: ${object.strand}`
    } else {
        infoText.innerHTML = "";
    }

    console.log(object);
});
