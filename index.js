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
    ], [
        new Color(1, 0, 0),
        new Color(0, 1, 0),
        new Color(0, 0, 1),
        new Color(0, 0, 1),
        new Color(0, 1, 0),
        new Color(0, 0, 0),
    ])
    Shader.transformationMatrix = new Matrix4();
    let i = 0;
    while (true) {
        Shader.transformationMatrix = Shader.transformationMatrix.rotateZ(i);
        let tr = Math.sin(2 * i) * 0.15;
        Shader.transformationMatrix.translate(new Vector3(tr, tr, 0));
        i += 0.1;
        await new Promise(resolve => setTimeout(resolve, 30))
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