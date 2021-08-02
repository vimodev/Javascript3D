class Renderer {

    static fill = true;

    static canvas;
    static context;
    static width;
    static height;
    static displayBuffer;
    static drawBuffer;
    static depthBuffer;

    static tracker = {}

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

    static draw(model) {
        let positions = model.positions;
        let colors = model.colors;
        let indices = model.indices;
        for (let i = 0; i < indices.length; i += 3) {
            let v1 = Shader.vertex(positions[indices[i]], colors[indices[i]]);
            let v2 = Shader.vertex(positions[indices[i + 1]], colors[indices[i + 1]]);
            let v3 = Shader.vertex(positions[indices[i + 2]], colors[indices[i + 2]]);
            this.drawTriangle([v1, v2, v3]);
        }
    }

    static drawTriangle(vertices) {
        let p1 = this.positionToPixel(vertices[0].position);
        let p2 = this.positionToPixel(vertices[1].position);
        let p3 = this.positionToPixel(vertices[2].position);
        this.drawPixel(p1, vertices[0].color);
        this.drawPixel(p2, vertices[1].color);
        this.drawPixel(p3, vertices[2].color);
        let lines = this.interpolate(plotLine(p1, p2), vertices[0], vertices[1]);
        lines = lines.concat(this.interpolate(plotLine(p2, p3), vertices[1], vertices[2]));
        lines = lines.concat(this.interpolate(plotLine(p3, p1), vertices[2], vertices[0]));
        let scanLines = {};
        for (let i = 0; i < lines.length; i++) {
            lines[i].pixel.z = lines[i].position.z;
            this.drawPixel(lines[i].pixel, Shader.pixel(lines[i].position, lines[i].color));
            let y = lines[i].pixel.y;
            if (scanLines[y] == undefined) {
                scanLines[y] = {x: [], pixels: []};
            }
            (scanLines[y].x).push(lines[i].pixel.x);
            (scanLines[y].pixels).push(lines[i]);
        }
        if (!this.fill) return;
        for (const [y, obj] of Object.entries(scanLines)) {
            if (obj.x.length <= 1) continue;
            let listX = obj.x;
            let minX = Math.min(...listX);
            let minI = listX.indexOf(minX);
            let maxX = Math.max(...listX);
            let maxI = listX.indexOf(maxX);
            let listZ = obj.pixels.map(px => px.position.z);
            let pixels = plotLine(new Vector3(minX, y, listZ[minI]), new Vector3(maxX, y, listZ[maxI]));
            pixels = this.interpolate(pixels, obj.pixels[minI], obj.pixels[maxI]);
            for (let i = 0; i < pixels.length; i++) {
                this.drawPixel(pixels[i].pixel, Shader.pixel(pixels[i].position, pixels[i].color));
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
        if (this.depthBuffer[position.x][position.y] == null || this.depthBuffer[position.x][position.y] >= position.z) {
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

    static interpolate(pixels, v1, v2) {
        let n = pixels.length;
        let result = new Array(n);
        for (let i = 0; i < n; i++) {
            let mix = i / n;
            result[i] = {
                pixel: pixels[i],
                position: new Vector3(
                    this.linearlyInterpolate(v1.position.x, v2.position.x, mix),
                    this.linearlyInterpolate(v1.position.y, v2.position.y, mix),
                    this.linearlyInterpolate(v1.position.z, v2.position.z, mix),
                ),
                color: new Color(
                    this.linearlyInterpolate(v1.color.r, v2.color.r, mix),
                    this.linearlyInterpolate(v1.color.g, v2.color.g, mix),
                    this.linearlyInterpolate(v1.color.b, v2.color.b, mix),
                )
            };
        }
        return result;
    }

    static linearlyInterpolate(value1, value2, mix) {
        return (1 - mix) * value1 + mix * value2;
    }

}