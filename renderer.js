class Renderer {

    static fill = true;

    static canvas;
    static context;
    static width;
    static height;
    static displayBuffer;
    static drawBuffer;
    static depthBuffer;

    static drawCalls = 0;

    /**
     * Initialize the renderer
     * @param {*} canvas 
     * @param {*} ctx 
     */
    static init(canvas, ctx) {
        this.canvas = canvas;
        this.context = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        this.initializeBuffers();
    }

    /**
     * Swap the display and draw buffers.
     * Clear the draw buffer and display the display buffer.
     */
    static swapBuffers() {
        let temp = this.displayBuffer;
        this.displayBuffer = this.drawBuffer;
        this.drawBuffer = temp;
        this.clearDrawBuffer();
        this.drawDisplay()
    }

    /**
     * Set the draw and depth buffers to null
     */
    static clearDrawBuffer() {
        this.drawCalls = 0;
        for (let i = 0; i < this.width; i++) {
            this.drawBuffer[i] = new Array(this.height);
            this.depthBuffer[i] = new Array(this.height);
        }
    }

    /**
     * Draw the content of the display buffer to the screen
     */
    static drawDisplay() {
        // Clear the canvas
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

    /**
     * Draw the given model to the draw buffer
     * @param {*} model 
     */
    static draw(model) {
        let positions = model.positions;
        let colors = model.colors;
        let indices = model.indices;
        // Draw each triangle
        for (let i = 0; i < indices.length; i += 3) {
            // But first pass vertices through vertex shader
            let v1 = Shader.vertex(positions[indices[i]], colors[indices[i]]);
            let v2 = Shader.vertex(positions[indices[i + 1]], colors[indices[i + 1]]);
            let v3 = Shader.vertex(positions[indices[i + 2]], colors[indices[i + 2]]);
            this.drawTriangle([v1, v2, v3]);
        }
    }

    /**
     * Draw the given triangle
     * @param {} vertices 
     * @returns 
     */
    static drawTriangle(vertices) {
        // Get vertices' screen pixel position
        let p1 = this.positionToPixel(vertices[0].position);
        let p2 = this.positionToPixel(vertices[1].position);
        let p3 = this.positionToPixel(vertices[2].position);
        if (!this.triangleWithinBounds(p1, p2, p3)) return;
        // Draw them
        this.drawPixel(p1, Shader.pixel(vertices[0]));
        this.drawPixel(p2, Shader.pixel(vertices[1]));
        this.drawPixel(p3, Shader.pixel(vertices[2]));
        // Using Bresenham, calculate pixels on the 3 lines of the triangle
        let lines = this.interpolate(plotLine(p1, p2), vertices[0], vertices[1]);
        lines = lines.concat(this.interpolate(plotLine(p2, p3), vertices[1], vertices[2]));
        lines = lines.concat(this.interpolate(plotLine(p3, p1), vertices[2], vertices[0]));
        // Draw these lines, and also calculate the filling scanlines for filling the face
        let scanLines = {};
        for (let i = 0; i < lines.length; i++) {
            lines[i].pixel.z = lines[i].position.z;
            // Draw the line pixel, after passing it through the shader
            this.drawPixel(lines[i].pixel, Shader.pixel(lines[i]));
            // Scanline: Sort all drawn pixels from the lines by pixel-y coordinate
            let y = lines[i].pixel.y;
            if (scanLines[y] == undefined) {
                scanLines[y] = {x: [], pixels: []};
            }
            (scanLines[y].x).push(lines[i].pixel.x);
            (scanLines[y].pixels).push(lines[i]);
        }
        // If wireframe mode, we are done
        if (!this.fill) return;
        // Now fill all horizontal lines of the triangle's face
        for (const [y, obj] of Object.entries(scanLines)) {
            if (obj.x.length <= 1) continue;
            // Find out the first and last pixel on the line
            let listX = obj.x;
            let minX = Math.min(...listX);
            let minI = listX.indexOf(minX);
            let maxX = Math.max(...listX);
            let maxI = listX.indexOf(maxX);
            let listZ = obj.pixels.map(px => px.position.z);
            // Plot the horizontal line
            let pixels = plotLine(new Vector3(minX, y, listZ[minI]), new Vector3(maxX, y, listZ[maxI]));
            pixels = pixels.filter(px => this.withinBounds(px.x, px.y));
            // Interpolate all the values for the shader
            pixels = this.interpolate(pixels, obj.pixels[minI], obj.pixels[maxI]);
            // Draw them all after applying pixel shader
            for (let i = 0; i < pixels.length; i++) {
                this.drawPixel(pixels[i].pixel, Shader.pixel(pixels[i]));
            }
        }
    }

    /**
     * Given camera position, get pixel coordinate
     * @param {*} position 
     * @returns 
     */
    static positionToPixel(position) {
        let x = Math.floor((position.x + 1) * this.width / 2);
        let y = Math.floor((-position.y + 1) * this.height / 2);
        return new Vector3(x, y, position.z);
    }

    /**
     * Draw the given pixel to the drawbuffer
     * @param {*} position 
     * @param {*} color 
     * @returns 
     */
    static drawPixel(position, color) {
        this.drawCalls++;
        if (!this.withinBounds(position.x, position.y)) return;
        if (this.depthBuffer[position.x][position.y] == null || this.depthBuffer[position.x][position.y] >= position.z) {
            this.drawBuffer[position.x][position.y] = new Color(color.r, color.g, color.b);
            this.depthBuffer[position.x][position.y] = position.z;
        }
    }

    /**
     * Initialize all the buffers
     */
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

    /**
     * Interpolate the given pixel
     * @param {*} pixels 
     * @param {*} v1 
     * @param {*} v2 
     * @returns 
     */
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
                ),
                worldPosition: new Vector3(
                    this.linearlyInterpolate(v1.worldPosition.x, v2.worldPosition.x, mix),
                    this.linearlyInterpolate(v1.worldPosition.y, v2.worldPosition.y, mix),
                    this.linearlyInterpolate(v1.worldPosition.z, v2.worldPosition.z, mix)
                )
            };
        }
        return result;
    }

    /**
     * Linearly interpolate 2 values based on mix
     * @param {*} value1 
     * @param {*} value2 
     * @param {*} mix 
     * @returns 
     */
    static linearlyInterpolate(value1, value2, mix) {
        return (1 - mix) * value1 + mix * value2;
    }

    static withinBounds(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height
    }

    static triangleWithinBounds(p1, p2, p3) {
        if (p1.x < 0 && p2.x < 0 && p3.x < 0) return false;
        if (p1.y < 0 && p2.y < 0 && p3.y < 0) return false;
        if (p1.x >= this.width && p2.x >= this.width && p3.x >= this.width) return false;
        if (p1.y >= this.height && p2.y >= this.height && p3.y >= this.height) return false;
        return true;
    }

}