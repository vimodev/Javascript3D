let canvas;
let context;

let TARGET_FPS = 30;
let frame_start;

/**
 * Initialize the graphics pipeline
 */
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 350;// window.innerWidth;
    canvas.height = 350;//window.innerHeight;
    Renderer.init(canvas, ctx);
}

/**
 * Main frame loop
 */
async function loop() {
    // A plane model
    let model = new Model([
        new Vector3(-0.5, 0.5, 0),
        new Vector3(-0.5, -0.5, 0),
        new Vector3(0.5, 0.5, 0),
        new Vector3(0.5, -0.5, 0),
    ], [
        new Color(1, 0, 0),
        new Color(0, 1, 0),
        new Color(0, 0, 1),
        new Color(0, 0, 0),
    ], [
        0, 1, 2, 2, 1, 3
    ])
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

    // set the projection matrix in the shaders
    Shader.projectionMatrix = Matrix4.createProjectionMatrix(
        canvas.width / canvas.height,
        60,
        0.1,
        100
    );

    let rotation = 0.05;

    while (true) {

        frame_start = Date.now();

        // Transform the cube in the shader
        let scale = (Math.sin(rotation) + 1.3) / 2;
        Shader.transformationMatrix = Matrix4.createTransformationMatrix(
            new Vector3(0, 0, -2), 
            new Vector3(scale, scale, scale), 
            new Vector3(rotation, rotation, rotation)
        )
        rotation += 0.06;

        // Draw to the draw buffer the given model
        Renderer.draw(cube);
        // Swap the draw and display buffers
        Renderer.swapBuffers();

        // Try to hit TARGET_FPS fps
        let dt = Date.now() - frame_start;
        await new Promise(resolve => setTimeout(resolve, Math.max(1, (1 / TARGET_FPS) - dt)))

    }

}

init()
loop()