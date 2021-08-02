class Matrix4 {

    constructor() {
        this.setIdentity();
    }

    setIdentity() {
        this.m00 = 1; this.m10 = 0; this.m20 = 0; this.m30 = 0;
        this.m01 = 0; this.m11 = 1; this.m21 = 0; this.m31 = 0;
        this.m02 = 0; this.m12 = 0; this.m22 = 1; this.m32 = 0;
        this.m03 = 0; this.m13 = 0; this.m23 = 0; this.m33 = 1;
    }

    static createTransformationMatrix(translation, scaling, rotation) {
        let M = new Matrix4();
        
        M.scale(scaling);
        M = M.rotateX(rotation.x);
        M = M.rotateY(rotation.y);
        M = M.rotateZ(rotation.z);
        M.translate(translation);
        return M;
    }

    static createProjectionMatrix(a, fov, znear, zfar) {
        let M = new Matrix4();
        let sc = 1 / Math.tan(((fov / 180) * Math.PI) / 2);
        M.m00 = sc;
        M.m11 = sc;
        M.m22 = -zfar / (zfar - znear); 
        M.m23 = -1;
        M.m32 = -zfar * znear / (zfar - znear);
        M.m33 = 0;
        return M;
    }

    translate(translation) {
        this.m30 += translation.x;
        this.m31 += translation.y;
        this.m32 += translation.z;
    }

    scale(scaling) {
        this.m00 *= scaling.x;
        this.m11 *= scaling.y;
        this.m22 *= scaling.z;
    }

    toColumns() {
        return [
            new Vector4(this.m00, this.m01, this.m02, this.m03),
            new Vector4(this.m10, this.m11, this.m12, this.m13),
            new Vector4(this.m20, this.m21, this.m22, this.m23),
            new Vector4(this.m30, this.m31, this.m32, this.m33),
        ]
    }

    toRows() {
        return [
            new Vector4(this.m00, this.m10, this.m20, this.m30),
            new Vector4(this.m01, this.m11, this.m21, this.m31),
            new Vector4(this.m02, this.m12, this.m22, this.m32),
            new Vector4(this.m03, this.m13, this.m23, this.m33),
        ]
    }

    mulVec4(v) {
        let result = new Vector4(0, 0, 0, 0);
        result.x = this.m00 * v.x + this.m10 * v.y + this.m20 * v.z + this.m30 * v.w;
        result.y = this.m01 * v.x + this.m11 * v.y + this.m21 * v.z + this.m31 * v.w;
        result.z = this.m02 * v.x + this.m12 * v.y + this.m22 * v.z + this.m32 * v.w;
        result.w = this.m03 * v.x + this.m13 * v.y + this.m23 * v.z + this.m33 * v.w;
        return result;
    }

    mulMat4(m) {
        let rows = this.toRows();
        let cols = m.toColumns();
        let r = new Matrix4();
        r.m00 = rows[0].dot(cols[0]); r.m10 = rows[0].dot(cols[1]); r.m20 = rows[0].dot(cols[2]); r.m30 = rows[0].dot(cols[3]);
        r.m01 = rows[1].dot(cols[0]); r.m11 = rows[1].dot(cols[1]); r.m21 = rows[1].dot(cols[2]); r.m31 = rows[1].dot(cols[3]);
        r.m02 = rows[2].dot(cols[0]); r.m12 = rows[2].dot(cols[1]); r.m22 = rows[2].dot(cols[2]); r.m32 = rows[2].dot(cols[3]);
        r.m03 = rows[3].dot(cols[0]); r.m13 = rows[3].dot(cols[1]); r.m23 = rows[3].dot(cols[2]); r.m33 = rows[3].dot(cols[3]);
        return r;
    }

    rotateX(angle) {
        let M = new Matrix4();
        M.m11 = Math.cos(angle); M.m21 = Math.sin(angle);
        M.m12 = -Math.sin(angle); M.m22 = Math.cos(angle);
        return M.mulMat4(this);
    }

    rotateY(angle) {
        let M = new Matrix4();
        M.m00 = Math.cos(angle); M.m20 = Math.sin(angle);
        M.m02 = -Math.sin(angle); M.m22 = Math.cos(angle);
        return M.mulMat4(this);
    }

    rotateZ(angle) {
        let M = new Matrix4();
        M.m00 = Math.cos(angle); M.m10 = Math.sin(angle);
        M.m01 = -Math.sin(angle); M.m11 = Math.cos(angle);
        return M.mulMat4(this);
    }

}