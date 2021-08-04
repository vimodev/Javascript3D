class OBJLoader {

    static fileReader = new FileReader();

    static load(file) {
        if (!file.name.endsWith(".obj")) return;
        this.fileReader.onload = this.parse;
        this.fileReader.readAsText(file);
    }

    static parse() {
        let content = OBJLoader.fileReader.result;
        let lines = content.split('\n');
        let vertices = [];
        let indices = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("v ")) {
                let split = lines[i].split(" ");
                vertices.push(new Vector3(
                    parseFloat(split[1]),
                    parseFloat(split[2]),
                    parseFloat(split[3])
                ))
            } else if (lines[i].startsWith("f ")) {
                let split = lines[i].split(" ");
                for (let j = 1; j < 4; j++) {
                    indices.push(parseInt(split[j].split("/")[0] - 1));
                }
            }
        }
        let colors = [];
        for (let i = 0; i < vertices.length; i++) {
            colors.push(new Color(Math.random(), Math.random(), Math.random()));
        }
        Global.activeModel = new Model(vertices, colors, indices);
    }

}