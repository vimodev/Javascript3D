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
//(new Array(24)).fill(new Color(0, 0, 0))
    let cube = new Model([
        new Vector3(-0.5,0.5,-0.5),
        new Vector3(-0.5,-0.5,-0.5),
		new Vector3(0.5,-0.5,-0.5),	
        new Vector3(0.5,0.5,-0.5),		
				
        new Vector3(-0.5,0.5,0.5),
        new Vector3(-0.5,-0.5,0.5),	
        new Vector3(0.5,-0.5,0.5),	
        new Vector3(0.5,0.5,0.5),
				
        new Vector3(0.5,0.5,-0.5),	
        new Vector3(0.5,-0.5,-0.5),	
        new Vector3(0.5,-0.5,0.5),	
        new Vector3(0.5,0.5,0.5),
				
        new Vector3(-0.5,0.5,-0.5),	
        new Vector3(-0.5,-0.5,-0.5),	
        new Vector3(-0.5,-0.5,0.5),	
        new Vector3(-0.5,0.5,0.5),
				
        new Vector3(-0.5,0.5,0.5),
        new Vector3(-0.5,0.5,-0.5),
        new Vector3(0.5,0.5,-0.5),
        new Vector3(0.5,0.5,0.5),
				
        new Vector3(-0.5,-0.5,0.5),
        new Vector3(-0.5,-0.5,-0.5),
        new Vector3(0.5,-0.5,-0.5),
        new Vector3(0.5,-0.5,0.5)
    ], [
        new Color(0, 1, 1),
        new Color(0.5, 0.5, 0.5),
        new Color(0, 0, 0.5),
        new Color(0.75, 0.75, 0.75),
        new Color(0, 0, 0),
        new Color(0, 0.5, 0),
        new Color(0.5, 0.5, 0),
        new Color(0, 0.5, 0.5),
        new Color(0, 0, 1),
        new Color(0, 1, 0),
        new Color(0.5, 0, 0.5),
        new Color(1, 0.5, 1),
        new Color(1, 0, 1),
        new Color(0.5, 0, 0),
        new Color(1, 0, 0),
        new Color(1, 1, 0),
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
		3,1,2,	
	    4,5,7,
		7,5,6,
		8,9,11,
		11,9,10,
		12,13,15,
		15,13,14,	
		16,17,19,
		19,17,18,
		20,21,23,
		23,21,22
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
            new Vector3(0, 0, -5 + Math.sin(rotation) * 3), 
            new Vector3(1, 1, 1), 
            new Vector3(rotation, rotation, rotation)
        )

        rotation += 0.01;

        Renderer.draw(cube);
        Renderer.swapBuffers();

        await new Promise(resolve => setTimeout(resolve, 50))

    }

}

init()
loop()