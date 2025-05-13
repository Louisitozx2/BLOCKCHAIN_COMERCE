/*! js-sha256 v0.9.0 | (c) 2017 Chen, Yi-Cyuan | https://github.com/emn178/js-sha256 */
!function() {
'use strict';
var root = typeof window === 'object' ? window : {};
var HEX_CHARS = '0123456789abcdef'.split('');
var EXTRA = [128, 32768, 8388608, -2147483648];
var blocks = [],
    sha256 = function(message) {
        var notString = typeof message !== 'string';
        if (notString && message.constructor === root.ArrayBuffer) {
            message = new Uint8Array(message);
        }
        var h0 = 1779033703, h1 = 3144134277, h2 = 1013904242, h3 = 2773480762,
            h4 = 1359893119, h5 = 2600822924, h6 = 528734635, h7 = 1541459225,
            blocks = [],
            byteCount = 0,
            length = message.length,
            i, code, index = 0, s, j, l, w = [], a, b, c, d, e, f, g, k, t1, t2;
        if (notString) {
            for (i = 0; i < length; ++i) {
                blocks[i >> 2] |= message[i] << (24 - (i % 4) * 8);
            }
        } else {
            for (i = 0; i < length; ++i) {
                code = message.charCodeAt(i);
                if (code < 0x80) {
                    blocks[i >> 2] |= code << (24 - (i % 4) * 8);
                } else if (code < 0x800) {
                    blocks[i >> 2] |= (0xc0 | (code >> 6)) << (24 - (i % 4) * 8);
                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << (16 - (i % 4) * 8);
                    ++i;
                } else if (code < 0x10000) {
                    blocks[i >> 2] |= (0xe0 | (code >> 12)) << (24 - (i % 4) * 8);
                    blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << (16 - (i % 4) * 8);
                    blocks[i >> 2] |= (0x80 | (code & 0x3f)) << (8 - (i % 4) * 8);
                    ++i;
                } else {
                    blocks[i >> 2] |= (0xf0 | (code >> 18)) << (24 - (i % 4) * 8);
                    blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << (16 - (i % 4) * 8);
                    blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << (8 - (i % 4) * 8);
                    blocks[i >> 2] |= (0x80 | (code & 0x3f));
                    ++i;
                }
            }
        }
        blocks[length >> 2] |= EXTRA[length % 4];
        blocks[(((length + 8) >> 6) << 4) + 15] = length << 3;
        for (i = 0; i < blocks.length; i += 16) {
            a = h0;
            b = h1;
            c = h2;
            d = h3;
            e = h4;
            f = h5;
            g = h6;
            k = h7;
            for (j = 0; j < 64; ++j) {
                if (j < 16) {
                    w[j] = blocks[i + j] | 0;
                } else {
                    s = w[j - 15];
                    t1 = (s >>> 7 | s << 25) ^ (s >>> 18 | s << 14) ^ (s >>> 3);
                    s = w[j - 2];
                    t2 = (s >>> 17 | s << 15) ^ (s >>> 19 | s << 13) ^ (s >>> 10);
                    w[j] = (w[j - 16] + t1 + w[j - 7] + t2) | 0;
                }
                t1 = (k + ((e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7)) + ((e & f) ^ (~e & g)) + 1116352408 + w[j]) | 0;
                t2 = (((a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
                k = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }
            h0 = (h0 + a) | 0;
            h1 = (h1 + b) | 0;
            h2 = (h2 + c) | 0;
            h3 = (h3 + d) | 0;
            h4 = (h4 + e) | 0;
            h5 = (h5 + f) | 0;
            h6 = (h6 + g) | 0;
            h7 = (h7 + k) | 0;
        }
        return HEX_CHARS[(h0 >> 28) & 0x0f] + HEX_CHARS[(h0 >> 24) & 0x0f] + HEX_CHARS[(h0 >> 20) & 0x0f] + HEX_CHARS[(h0 >> 16) & 0x0f] +
            HEX_CHARS[(h0 >> 12) & 0x0f] + HEX_CHARS[(h0 >> 8) & 0x0f] + HEX_CHARS[(h0 >> 4) & 0x0f] + HEX_CHARS[h0 & 0x0f] +
            HEX_CHARS[(h1 >> 28) & 0x0f] + HEX_CHARS[(h1 >> 24) & 0x0f] + HEX_CHARS[(h1 >> 20) & 0x0f] + HEX_CHARS[(h1 >> 16) & 0x0f] +
            HEX_CHARS[(h1 >> 12) & 0x0f] + HEX_CHARS[(h1 >> 8) & 0x0f] + HEX_CHARS[(h1 >> 4) & 0x0f] + HEX_CHARS[h1 & 0x0f] +
            HEX_CHARS[(h2 >> 28) & 0x0f] + HEX_CHARS[(h2 >> 24) & 0x0f] + HEX_CHARS[(h2 >> 20) & 0x0f] + HEX_CHARS[(h2 >> 16) & 0x0f] +
            HEX_CHARS[(h2 >> 12) & 0x0f] + HEX_CHARS[(h2 >> 8) & 0x0f] + HEX_CHARS[(h2 >> 4) & 0x0f] + HEX_CHARS[h2 & 0x0f] +
            HEX_CHARS[(h3 >> 28) & 0x0f] + HEX_CHARS[(h3 >> 24) & 0x0f] + HEX_CHARS[(h3 >> 20) & 0x0f] + HEX_CHARS[(h3 >> 16) & 0x0f] +
            HEX_CHARS[(h3 >> 12) & 0x0f] + HEX_CHARS[(h3 >> 8) & 0x0f] + HEX_CHARS[(h3 >> 4) & 0x0f] + HEX_CHARS[h3 & 0x0f] +
            HEX_CHARS[(h4 >> 28) & 0x0f] + HEX_CHARS[(h4 >> 24) & 0x0f] + HEX_CHARS[(h4 >> 20) & 0x0f] + HEX_CHARS[(h4 >> 16) & 0x0f] +
            HEX_CHARS[(h4 >> 12) & 0x0f] + HEX_CHARS[(h4 >> 8) & 0x0f] + HEX_CHARS[(h4 >> 4) & 0x0f] + HEX_CHARS[h4 & 0x0f] +
            HEX_CHARS[(h5 >> 28) & 0x0f] + HEX_CHARS[(h5 >> 24) & 0x0f] + HEX_CHARS[(h5 >> 20) & 0x0f] + HEX_CHARS[(h5 >> 16) & 0x0f] +
            HEX_CHARS[(h5 >> 12) & 0x0f] + HEX_CHARS[(h5 >> 8) & 0x0f] + HEX_CHARS[(h5 >> 4) & 0x0f] + HEX_CHARS[h5 & 0x0f] +
            HEX_CHARS[(h6 >> 28) & 0x0f] + HEX_CHARS[(h6 >> 24) & 0x0f] + HEX_CHARS[(h6 >> 20) & 0x0f] + HEX_CHARS[(h6 >> 16) & 0x0f] +
            HEX_CHARS[(h6 >> 12) & 0x0f] + HEX_CHARS[(h6 >> 8) & 0x0f] + HEX_CHARS[(h6 >> 4) & 0x0f] + HEX_CHARS[h6 & 0x0f] +
            HEX_CHARS[(h7 >> 28) & 0x0f] + HEX_CHARS[(h7 >> 24) & 0x0f] + HEX_CHARS[(h7 >> 20) & 0x0f] + HEX_CHARS[(h7 >> 16) & 0x0f] +
            HEX_CHARS[(h7 >> 12) & 0x0f] + HEX_CHARS[(h7 >> 8) & 0x0f] + HEX_CHARS[(h7 >> 4) & 0x0f] + HEX_CHARS[h7 & 0x0f];
    };
root.sha256 = sha256;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sha256;
}
}();
