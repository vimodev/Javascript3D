class Shader {

    static transformationMatrix;

    static vertex(position, color) {
        let pos4 = Vector4.fromVector3(position, 1);
        pos4 = this.transformationMatrix.mulVec4(pos4);
        return { position: pos4.toVec3(), color: color };
    }

    static pixel(position, color) {
        return color;
    }

}