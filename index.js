let canvas;
let context;

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 200;// window.innerWidth;
    canvas.height = 200;//window.innerHeight;
    Renderer.init(canvas, ctx);
}

async function loop() {
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

    Shader.projectionMatrix = Matrix4.createProjectionMatrix(
        canvas.width / canvas.height,
        70,
        0.1,
        100
    );

    let rotation = 0;

    while (true) {

        Shader.transformationMatrix = Matrix4.createTransformationMatrix(
            new Vector3(0, 0, -5), 
            new Vector3(1, 1, 1), 
            new Vector3(rotation, rotation, rotation)
        )

        rotation += 0.01;

        Renderer.draw(model);
        Renderer.swapBuffers();

        await new Promise(resolve => setTimeout(resolve, 50))

    }

}

init()
loop()