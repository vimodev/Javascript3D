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

    static createTransformationMatrix(translation, scaling) {
        let M = new Matrix4();
        M.translate(translation);
        M.scale(scaling);
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

    mulVec4(v) {
        let result = new Vector4(0, 0, 0, 0);
        result.x = this.m00 * v.x + this.m10 * v.y + this.m20 * v.z + this.m30 * v.w;
        result.y = this.m01 * v.x + this.m11 * v.y + this.m21 * v.z + this.m31 * v.w;
        result.z = this.m02 * v.x + this.m12 * v.y + this.m22 * v.z + this.m32 * v.w;
        result.w = this.m03 * v.x + this.m13 * v.y + this.m23 * v.z + this.m33 * v.w;
        return result;
    }

}