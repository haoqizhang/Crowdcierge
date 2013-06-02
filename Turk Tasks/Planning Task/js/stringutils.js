function rtrim(stt) {
    return stt.replace(/\s+$/, "");
}

function takeTill(str, maxchars) {
    var str = rtrim(str.replace(/<br\/>/g, ' '));

    var sp = str.split(' ');
    var o = '';
    for (var i = 0; i < sp.length; i++) {
        if (o.length + sp[i].length > maxchars) {
            var ret = rtrim(o) + ' [...]';
            return ret;
        } else {
            o += sp[i];
            o += ' ';
        }
    }
    return rtrim(str);
}