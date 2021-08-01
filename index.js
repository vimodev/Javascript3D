let canvas;
let context;

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 50;//window.innerWidth;
    canvas.height = 50;//window.innerHeight;
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
    ])
    Shader.transformationMatrix = new Matrix4();
    while (true) {
        Shader.transformationMatrix.translate(new Vector3(0.01, -0.01, 0));
        await new Promise(resolve => setTimeout(resolve, 30))
        // Renderer.drawTriangle([new Vector3(-0.5, -0.5, 0), new Vector3(0, 0.5, 0), new Vector3(0.5, -0.5, 0)],
        //                         [new Color(0, 0, 0), new Color(0, 0, 0), new Color(0, 0, 0)])
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