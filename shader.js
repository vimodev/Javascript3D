class Shader {

    static transformationMatrix = new Matrix4();
    static projectionMatrix = new Matrix4();
    static lightPosition = new Vector3(0, 0, 0);

    static vertex(position, color) {
        let pos4 = Vector4.fromVector3(position, 1);
        let worldPos = this.transformationMatrix.mulVec4(pos4);
        pos4 = this.projectionMatrix.mulVec4(worldPos);
        return { position: pos4.toVec3(), color: color, worldPosition: worldPos.toVec3()};
    }

    static pixel(data) {
        let dir = this.lightPosition.sub(data.worldPosition);
        dir.normalize();
        return data.color;
    }

}