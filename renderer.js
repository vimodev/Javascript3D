class Renderer {

    static fill = true;

    static canvas;
    static context;
    static width;
    static height;
    static displayBuffer;
    static drawBuffer;
    static depthBuffer;

    static init(canvas, ctx) {
        this.canvas = canvas;
        this.context = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        this.initializeBuffers();
    }

    static swapBuffers() {
        let temp = this.displayBuffer;
        this.displayBuffer = this.drawBuffer;
        this.drawBuffer = temp;
        this.clearDrawBuffer();
        this.drawDisplay()
    }

    static clearDrawBuffer() {
        for (let i = 0; i < this.width; i++) {
            this.drawBuffer[i] = new Array(this.height);
            this.depthBuffer[i] = new Array(this.height);
        }
    }

    static drawDisplay() {
        this.context.clearRect(0, 0, this.width, this.height);
        let id = this.context.getImageData(0, 0, this.width, this.height);
        let px = id.data;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let offset = (y * id.width + x) * 4;
                let data = this.displayBuffer[x][y];
                if (data == null) continue;
                px[offset++] = data.r * 255;
                px[offset++] = data.g * 255;
                px[offset++] = data.b * 255;
                px[offset] = 255;
            }
        }
        this.context.putImageData(id, 0, 0);
    }

    static draw(model, color) {
        let positions = model.positions;
        for (let i = 0; i < positions.length; i += 3) {
            let v1 = Shader.vertex(positions[i]);
            let v2 = Shader.vertex(positions[i + 1]);
            let v3 = Shader.vertex(positions[i + 2]);
            this.drawTriangle([v1, v2, v3], [color, color, color]);
        }
    }

    static drawTriangle(positions, colors) {
        let p1 = this.positionToPixel(positions[0]);
        let p2 = this.positionToPixel(positions[1]);
        let p3 = this.positionToPixel(positions[2]);
        this.drawPixel(p1, colors[0]);
        this.drawPixel(p2, colors[1]);
        this.drawPixel(p3, colors[2]);
        let lines = plotLine(p1, p2);
        lines = lines.concat(plotLine(p1, p3));
        lines = lines.concat(plotLine(p2, p3));
        let scanLines = {};
        for (let i = 0; i < lines.length; i++) {
            this.drawPixel(lines[i], colors[0]);
            let y = lines[i].y;
            if (scanLines[y] == undefined) {
                scanLines[y] = {x: [], z: []};
            }
            (scanLines[y].x).push(lines[i].x);
            (scanLines[y].z).push(lines[i].z);
        }
        if (!this.fill) return;
        for (const [y, obj] of Object.entries(scanLines)) {
            let listX = obj.x;
            // Still have to interpolate Z some time
            let listZ = obj.z;
            if (listX.length == 0) continue;
            let minX = Math.min(...listX);
            let minI = listX.indexOf(minX);
            let maxX = Math.max(...listX);
            let maxI = listX.indexOf(maxX);
            let pixels = plotLine(new Vector3(minX, y, listZ[minI]), new Vector2(maxX, y, listZ[maxI]));
            for (let i = 0; i < pixels.length; i++) {
                this.drawPixel(pixels[i], colors[0]);
            }
        }
    }

    static positionToPixel(position) {
        let x = Math.floor((position.x + 1) * this.width / 2);
        let y = Math.floor((-position.y + 1) * this.height / 2);
        return new Vector3(x, y, position.z);
    }

    static drawPixel(position, color) {
        if (position.x < 0 || position.x >= this.width || position.y < 0 || position.y >= this.height) return;
        if (this.depthBuffer[position.x][position.y] == null || this.depthBuffer[position.x][position.y] < position.z) {
            this.drawBuffer[position.x][position.y] = new Color(color.r, color.g, color.b);
            this.depthBuffer[position.x][position.y] = position.z;
        }
    }

    static initializeBuffers() {
        this.displayBuffer = new Array(this.width);
        this.drawBuffer = new Array(this.width);
        this.depthBuffer = new Array(this.width);
        for (let i = 0; i < this.width; i++) {
            this.displayBuffer[i] = new Array(this.height);
            this.drawBuffer[i] = new Array(this.height);
            this.depthBuffer[i] = new Array(this.height);
        }
    }

}