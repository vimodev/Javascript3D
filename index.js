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
        new Vector3(0.5, 0.5, 0),
        new Vector3(-0.5, -0.5, 0),
        new Vector3(0.5, -0.5, 0),
    ], [
        new Color(1, 0, 0),
        new Color(0, 1, 0),
        new Color(0, 0, 1),
        new Color(0, 0, 1),
        new Color(0, 1, 0),
        new Color(0, 0, 0),
    ])
    Shader.transformationMatrix = new Matrix4();
    let rotation = 0;
    while (true) {
        Shader.transformationMatrix = Matrix4.createTransformationMatrix(
            new Vector3(0, 0, 0), 
            new Vector3(1, 1, 1), 
            new Vector3(0, 0, rotation)
            )
        rotation += 0.01;
        await new Promise(resolve => setTimeout(resolve, 15))
        let color = new Color(1, 0, 0);
        Renderer.draw(model, color);
        Renderer.swapBuffers();
    }
}

function terminate() {

}

init()
loop()
terminate()