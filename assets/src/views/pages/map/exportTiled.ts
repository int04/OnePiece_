export function exportTitled (json, assets) {
    let dataMap = [];
    json.layers.forEach((layer, indexLayer) => {
        let nameLayer = layer.name; // tên của layer vd: dat, nui, da,....
        let chunks = layer.chunks;
        if(chunks && chunks.length >=1) {
            chunks.forEach((chunk, indexChunk) => {
                let data = chunk.data;
                let height = chunk.height;
                let width = chunk.width;
                let x = chunk.x;
                let y = chunk.y;
                data.forEach((tileID, indexID) => {
                    tileID = parseInt(tileID);
                    if(tileID !=0) {
                        let info = assets.find(e => e.id === tileID);
                        if(info) {
                            dataMap.push({
                                type : 'CHUNK',
                                name : nameLayer,
                                id : tileID,
                                src : info.src,
                                width : info.width,
                                height : info.height,
                                x : x + (indexID % width),
                                y : y + Math.floor(indexID / width),
                                animation : info.animation,
                                properties: tileID.properties,
                                parent_properties: layer.properties,
                            });
                        }
                    }
                })
            });
        }
        let objects = layer.objects;
        if(objects && objects.length >=1) {
            let nameLayer = layer.name;
            objects.forEach((obb, obbID) => {
                if(nameLayer === 'zone') {
                   // obbZone(self,obb);
                }
                else {
                    let tileID = parseInt(obb.gid);
                    if(tileID !=0) {
                        let info = assets.find(e => e.id === tileID);
                        if(info) {
                            dataMap.push({
                                type : 'OBJECT',
                                name : nameLayer,
                                id : tileID,
                                src : info.src,
                                x : obb.x,
                                y : obb.y,
                                animation : info.animation,
                                width : obb.width,
                                height : obb.height,
                                rotation : obb.rotation,
                                properties: obb.properties,
                                parent_properties: layer.properties,
                            });
                        }
                    }
                }
            })
        }
    });
    return dataMap;
}