import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const nucleotideColorMap = {
    'A': new THREE.Color(0xf59678),
    'T': new THREE.Color(0xa8d270),
    'G': new THREE.Color(0xfed887),
    'C': new THREE.Color(0x7fa7da),
}

class View {
    constructor(canvas) {
        // Setup canvas and renderer
        this.canvas = canvas;
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = 500;

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this.canvas,
            alpha: true
        });
        this.renderer.setSize(this.canvas.width, this.canvas.height);

        // Setup scene, camera, camera controls, and lights
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 0.1, 1000);
        this.camera.position.set(5, 2, 0);

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.target.set(0, 0.5, 0);

        this.ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        this.scene.add(this.ambientLight);

        this.pointLight = new THREE.PointLight(0xFFFFFF, 500);
        this.pointLight.position.set(10, 10, 1);
        this.scene.add(this.pointLight);

        // Update canvas and renderer when window is resized
        window.onresize = () => {
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.camera.aspect = this.canvas.width / this.canvas.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.canvas.width, this.canvas.height);
            this.render();
        };

        // Render whenever camera is moved
        this.controls.addEventListener("change", ()=>this.render());

        this.render();
    }

    addObjects(objects) {
        // Setup common geometry and material for objects to be added
        const geometry = new THREE.IcosahedronGeometry(0.5, 3);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff});

        const mesh = new THREE.InstancedMesh(geometry, material, objects.length);

        // Scale and orientation are constant for now.
        // (but you can set them from data if the data is available)
        const scale = new THREE.Vector3(1, 1, 1);
        const orientation = new THREE.Quaternion();

        // Create a matrix once and reuse it (for performance)
        const matrix = new THREE.Matrix4();

        for (let i=0; i<objects.length; i++) {
            const v = objects[i];
            const position = new THREE.Vector3(v.x, v.y, v.z);
            matrix.compose(position, orientation, scale);

            mesh.setMatrixAt(i, matrix);
            mesh.setColorAt(i, nucleotideColorMap[v['type']]);
        }
        this.scene.add(mesh);
        this.render();
    }

    /**
     * Render the scene
     */
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export {View}