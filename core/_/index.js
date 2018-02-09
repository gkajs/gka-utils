// 子目录中每一个文件夹都生成对应html、css
function effectSubFolderSync(run, data, opts) {
    var frames = data.frames,
        keyMap = data.keyMap;

    if (!keyMap || Object.keys(keyMap).length === 1) return;

    for (var key in keyMap) {
        // TODO 支持多层文件夹嵌套
        var keys = keyMap[key],
            newKeys = [],
            newFrames = keys.map((k, i) => {
                newKeys.push(i);
                return frames[k];
            });
        
    	run({
    		frames: newFrames,
    		keyMap: {
    			[key] : newKeys
    		}
    	}, opts, key);
    }
}

module.exports = {
	effectSubFolderSync,
}