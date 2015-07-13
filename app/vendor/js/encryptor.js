(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.encryptor = factory());
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.encryptor = factory();
    }
}(this, function () {
    var fs = require('./node_modules/fs-extra'),
          join = require('path').join,
          fe = require('./node_modules/file-encryptor');

    return function (root, key, mode, cipher, cb) {
        var result = [],
             queue = ['/'];
        while (queue.length) {
            var d = queue.shift();
            fs.readdirSync(join(root, d)).sort().forEach(function (entry) {
                var f = join(root, d, entry);
                var stat = fs.statSync(f);
                if (stat.isDirectory() && entry != 'node_modules') {
                    queue.push(join(d, entry));
                } else {
                    if (mode == 'encrypt') {
                        fe.encryptFile(f, f + '.dat', key, {algorithm: cipher}, function (err) {
                            if (err) {
                                cb(err);
                                return;
                            }
                            fs.remove(f);
                        });
                    } else if (/.dat/i.test(entry)) {
                        fe.decryptFile(f, f.replace(/.dat/, ''), key, {algorithm: cipher},  function (err) {
                            if (err) {
                                cb(err);
                                return;
                            }
                            fs.remove(f);
                        });
                    }
                }
            });
        }
        cb(false);
        return;
    };
}));
