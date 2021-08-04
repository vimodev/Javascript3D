class Vector3 {

    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    cross(v) {
        let result = new Vector3(0, 0, 0);
        result.x = this.y * v.z - this.z * v.y;
        result.y = this.z * v.x - this.x * v.z;
        result.z = this.x * v.y - this.y * v.x;
        return result;
    }

    normalize() {
        let len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        this.x /= len; this.y /= len; this.z /= len;
    }

    add(v) {
        let result = new Vector3(0, 0 ,0);
        result.x = this.x + v.x;
        result.y = this.y + v.y;
        result.z = this.z + v.z;
        return result;
    }

    sub(v) {
        let result = new Vector3(0, 0 ,0);
        result.x = this.x - v.x;
        result.y = this.y - v.y;
        result.z = this.z - v.z;
        return result;
    }

}