let canvas;
let context;

let TARGET_FPS = 30;
let frame_start;

let pos_x = 0;
let pos_y = 0;
let pos_z = 2;
let scale = 1;
let rotation = 50;

// A cube model
let cube = new Model([
    new Vector3(-0.5, 0.5, 0.5),
    new Vector3(0.5, 0.5, 0.5),
    new Vector3(-0.5, -0.5, 0.5),
    new Vector3(0.5, -0.5, 0.5),

    new Vector3(-0.5, 0.5, -0.5),
    new Vector3(0.5, 0.5, -0.5),
    new Vector3(-0.5, -0.5, -0.5),
    new Vector3(0.5, -0.5, -0.5),
], [
    new Color(0, 0, 1),
    new Color(0, 1, 0),
    new Color(0.5, 0, 0.5),
    new Color(1, 0.5, 1),
    new Color(1, 0, 1),
    new Color(0.5, 0, 0),
    new Color(1, 0, 0),
    new Color(1, 1, 0)
], [
    0,1,3,
    0,2,3,
    1,5,7,
    1,3,7,
    4,5,6,
    5,6,7,
    0,2,4,
    2,4,6,
    2,3,6,
    3,6,7,
    0,1,4,
    1,4,5
])

class Global {
    static activeModel = cube;
}

/**
 * Initialize the graphics pipeline
 */
function init() {
    document.getElementById("objFile").addEventListener("change", function() {
        OBJLoader.load(this.files[0]);
    })
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 200;// window.innerWidth;
    canvas.height = 200;//window.innerHeight;
    Renderer.init(canvas, ctx);
}

/**
 * Main frame loop
 */
async function loop() {

    // set the projection matrix in the shaders
    Shader.projectionMatrix = Matrix4.createProjectionMatrix(
        canvas.width / canvas.height,
        60,
        0.1,
        100
    );

    let rot = 0;

    while (true) {

        pos_x = document.getElementById("pos_x").value / 5;
        pos_y = document.getElementById("pos_y").value / 5;
        pos_z = document.getElementById("pos_z").value;
        scale = document.getElementById("scale").value / 100;
        rotation = document.getElementById("rotation").value;

        frame_start = Date.now();

        // Transform the cube in the shader
        Shader.transformationMatrix = Matrix4.createTransformationMatrix(
            new Vector3(pos_x, pos_y, -pos_z), 
            new Vector3(scale, scale, scale), 
            new Vector3(0, rot, 0)
        )

        // Draw to the draw buffer the given model
        Renderer.draw(Global.activeModel);

        // Swap the draw and display buffers
        Renderer.swapBuffers();

        // Try to hit TARGET_FPS fps
        let dt = Date.now() - frame_start;

        rot += (rotation / 180) * Math.PI * (dt / 1000);

        await new Promise(resolve => setTimeout(resolve, Math.max(0, (1 / TARGET_FPS) - dt)))

    }

}

init()
loop()