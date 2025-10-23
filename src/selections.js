import * as THREE from "three";
import {View} from "./view.js";

// How much brighter a selected nucleotide should be
const highlightFactor = 4;

// Save reference to infoText GUI element
const infoText = document.getElementById("infoText");

// Keep track of the selected instance
// so that we can deselect it.
let selectedInstance;

// Global variables are ugly, but these help performance
// and are only available within the scope of this module

// Initialise mouse vector once and reuse
const mouse = new THREE.Vector2();

// Initialise color object once and reuse
const color = new THREE.Color();

/**
 * Initialise logic for selecting nucleotides
 * @param {View} view
 * @param {string} eventType
 */
function setupSelections(view, eventType='dblclick') {
    view.canvas.addEventListener(eventType, event => {
        event.preventDefault();

        // Clear previous selection (if any)
        if (selectedInstance) {
            view.mesh.getColorAt(selectedInstance, color);
            color.multiplyScalar(1/highlightFactor);
            view.mesh.setColorAt(selectedInstance, color);
            view.mesh.instanceColor.needsUpdate = true;
            selectedInstance = undefined;
            view.render();
        }

        // Calculate mouse position
        const rect = view.canvas.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Check for intersecting instances
        const instanceId = getClickedInstance(mouse, view);

        if (instanceId) {
            selectedInstance = instanceId;

            // Make selected nucleotide brighter
            view.mesh.getColorAt(instanceId, color);
            color.multiplyScalar(highlightFactor);
            view.mesh.setColorAt(instanceId, color);
            view.mesh.instanceColor.needsUpdate = true;
            view.render();

            // Update infotext
            const object = view.objects[instanceId];
            infoText.innerHTML = `Type: ${object.type}, Strand id: ${object.strand}`

            // Also output data to console
            console.log(object);
        } else {
            infoText.innerHTML = "";
        }

    });
}

/**
 * Helper to handle raycasting
 * @param {THREE.Vector2} mouse 2D coordinates of the mouse, in normalized device coordinates (NDC)---X and Y components should be between -1 and 1.
 * @param {View} view
 * @returns {number} instance ID
 */
function getClickedInstance(mouse, view) {
    view.raycaster.setFromCamera(mouse, view.camera);

    const intersection = view.raycaster.intersectObject(view.mesh);

    if (intersection.length > 0) {
        return intersection[0].instanceId;
    }
}

export {setupSelections};