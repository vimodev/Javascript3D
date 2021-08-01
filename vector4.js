class Vector4 {

    constructor(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static fromVector3(vec3, w) {
        return new Vector4(vec3.x, vec3.y, vec3.z, w);
    }

    toVec3() {
        return new Vector3(this.x / this.w, this.y / this.w, this.x / this.w);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }

}