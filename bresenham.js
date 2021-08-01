function plotLineLow(p0, p1) {
    let x0 = p0.x; let y0 = p0.y;
    let x1 = p1.x; let y1 = p1.y;
    let depth = p0.z;
    let len = p1.x - p0.x;
    if (len == 0) len = 1;
    let depthStep = (p1.z - p0.z) / len;
    let result = [];
    let dx = x1 - x0;
    let dy = y1 - y0;
    let yi = 1;
    if (dy < 0) {
        yi = -1;
        dy = -dy;
    }
    let D = (2 * dy) - dx;
    let y = y0;
    for (let x = x0; x <= x1; x++) {
        result.push(new Vector3(x, y, depth));
        depth += depthStep;
        if (D > 0) {
            y = y + yi;
            D = D + (2 * (dy - dx));
        } else {
            D = D + 2 * dy;
        }
    }
    return result;
}

function plotLineHigh(p0, p1) {
    let x0 = p0.x; let y0 = p0.y;
    let x1 = p1.x; let y1 = p1.y;
    let depth = p0.z;
    let len = p1.y - p0.y;
    if (len == 0) len = 1;
    let depthStep = (p1.z - p0.z) / len;
    let result = [];
    let dx = x1 - x0;
    let dy = y1 - y0;
    let xi = 1;
    if (dx < 0) {
        xi = -1;
        dx = -dx;
    }
    let D = (2 * dx) - dy;
    let x = x0;
    for (let y = y0; y <= y1; y++) {
        result.push(new Vector3(x, y, depth));
        depth += depthStep;
        if (D > 0) {
            x = x + xi;
            D = D + (2 * (dx - dy));
        } else {
            D = D + 2 * dx;
        }
    }
    return result;
}

function plotLine(p0, p1) {
    if (Math.abs(p1.y - p0.y) < Math.abs(p1.x - p0.x)) {
        if (p0.x > p1.x) {
            return plotLineLow(p1, p0).reverse();
        } else {
            return plotLineLow(p0, p1);
        }
    } else {
        if (p0.y > p1.y) {
            return plotLineHigh(p1, p0).reverse();
        } else {
            return plotLineHigh(p0, p1);
        }
    }
}