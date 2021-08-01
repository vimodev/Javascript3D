class Shader {

    static transformationMatrix;

    static vertex(position) {
        let pos4 = Vector4.fromVector3(position, 1);
        pos4 = this.transformationMatrix.mulVec4(pos4);
        return pos4.toVec3();
    }

    static pixel() {

    }

}