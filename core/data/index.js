function isSame(frames, key) {
    var same = frames.filter(function(f){
        return f[key] === frames[0][key];
    });
    return (same.length === frames.length? true: false);
}

function isArray(o) {
    return Object.prototype.toString.call(o)=='[object Array]'? true: false;
}
/**
 * data 为传入数据
 * delKeys {array} 制定frame中哪些字段去除
 * withKeyMap {boolean} 是否保留 KeyMap，默认false
 */
function formateData(data, delKeys, withKeyMap) {
    var frames = data.frames,
        frame = frames[0];

    var sKeys = [];
    var _data = {};

    if (isArray(frame)) {
        var frameplain = [];

        for (var i = 0; i < frames.length; i++) {
            for (var j = 0; j < frames[i].length; j++) {
                frameplain.push(frames[i][j]);
            }
        }

        for (var i = 0, fKeys = Object.keys(frame[0]); i < fKeys.length; i++) {
            var key = fKeys[i];
            if(isSame(frameplain, key)) {
                sKeys.push(key);
                _data[key] = frame[0][key]
            }
        }

        _data['frames'] = frames.map(function(frame){
            var arr = [];
            for (var i = 0; i < frame.length; i++) {
                var f = {};
                for(var k in frame[i]) {
                    if(sKeys.indexOf(k) === -1 && (delKeys? delKeys.indexOf(k) === -1:  true)) {
                        f[k] = frame[i][k];
                    }
                }
                arr.push(f);
            }
            
            return arr;
        })

    } else {
        for (var i = 0, fKeys = Object.keys(frame); i < fKeys.length; i++) {
            var key = fKeys[i];
            if(isSame(frames, key)) {
                sKeys.push(key);
                _data[key] = frames[0][key]
            }
        }

        _data['frames'] = frames.map(function(frame){
            var f = {};
            for(var k in frame) {
                if(sKeys.indexOf(k) === -1 && (delKeys? delKeys.indexOf(k) === -1:  true)) {
                    f[k] = frame[k];
                }
            }
            return f;
        })
    }

    if (withKeyMap && data['keyMap']) {
        _data['keyMap'] = {};
        for(var k in data['keyMap']) {
            _data['keyMap'][k] = JSON.stringify(data['keyMap'][k])
        }
    }
    return _data;
}

function fixArrayString(str) {
    return str.replace(/\"\[/ig, "\[").replace(/\]\"/ig, "\]");
}

/**
 * data 为传入数据
 * 返回 所有图片资源名
 */
function getImageNames(data) {
    var res = [];
    if (data.file) {
        res.push(data.file);
        return res;
    }

    var frames = data.frames;
    for (var i = 0,frame; i < frames.length; i++) {
        frame = frames[i];
        frame = Object.prototype.toString.call(frame)=='[object Array]'? frame: [frame];
        for (var j = 0; j < frame.length; j++) {
            res.push(frame[j].file);
        }
    }

    return res.filter(function(item,index,self){
        return self.indexOf(item) == index;     
    });
}

module.exports = {
    getImageNames: getImageNames,
    formateData: formateData,
    fixArrayString: fixArrayString,
}