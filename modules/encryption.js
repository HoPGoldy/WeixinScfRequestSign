var CryptoJS = CryptoJS || function (h, r) {
  var k = {}, l = k.lib = {}, n = function () { }, f = l.Base = { extend: function (a) { n.prototype = this; var b = new n; a && b.mixIn(a); b.hasOwnProperty("init") || (b.init = function () { b.$super.init.apply(this, arguments) }); b.init.prototype = b; b.$super = this; return b }, create: function () { var a = this.extend(); a.init.apply(a, arguments); return a }, init: function () { }, mixIn: function (a) { for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]); a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function () { return this.init.prototype.extend(this) } },
  j = l.WordArray = f.extend({
    init: function (a, b) { a = this.words = a || []; this.sigBytes = b != r ? b : 4 * a.length }, toString: function (a) { return (a || s).stringify(this) }, concat: function (a) { var b = this.words, d = a.words, c = this.sigBytes; a = a.sigBytes; this.clamp(); if (c % 4) for (var e = 0; e < a; e++)b[c + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((c + e) % 4); else if (65535 < d.length) for (e = 0; e < a; e += 4)b[c + e >>> 2] = d[e >>> 2]; else b.push.apply(b, d); this.sigBytes += a; return this }, clamp: function () {
      var a = this.words, b = this.sigBytes; a[b >>> 2] &= 4294967295 <<
        32 - 8 * (b % 4); a.length = h.ceil(b / 4)
    }, clone: function () { var a = f.clone.call(this); a.words = this.words.slice(0); return a }, random: function (a) { for (var b = [], d = 0; d < a; d += 4)b.push(4294967296 * h.random() | 0); return new j.init(b, a) }
  }), m = k.enc = {}, s = m.Hex = {
    stringify: function (a) { var b = a.words; a = a.sigBytes; for (var d = [], c = 0; c < a; c++) { var e = b[c >>> 2] >>> 24 - 8 * (c % 4) & 255; d.push((e >>> 4).toString(16)); d.push((e & 15).toString(16)) } return d.join("") }, parse: function (a) {
      for (var b = a.length, d = [], c = 0; c < b; c += 2)d[c >>> 3] |= parseInt(a.substr(c,
        2), 16) << 24 - 4 * (c % 8); return new j.init(d, b / 2)
    }
  }, p = m.Latin1 = { stringify: function (a) { var b = a.words; a = a.sigBytes; for (var d = [], c = 0; c < a; c++)d.push(String.fromCharCode(b[c >>> 2] >>> 24 - 8 * (c % 4) & 255)); return d.join("") }, parse: function (a) { for (var b = a.length, d = [], c = 0; c < b; c++)d[c >>> 2] |= (a.charCodeAt(c) & 255) << 24 - 8 * (c % 4); return new j.init(d, b) } }, t = m.Utf8 = { stringify: function (a) { try { return decodeURIComponent(escape(p.stringify(a))) } catch (b) { throw Error("Malformed UTF-8 data"); } }, parse: function (a) { return p.parse(unescape(encodeURIComponent(a))) } },
  q = l.BufferedBlockAlgorithm = f.extend({
    reset: function () { this._data = new j.init; this._nDataBytes = 0 }, _append: function (a) { "string" == typeof a && (a = t.parse(a)); this._data.concat(a); this._nDataBytes += a.sigBytes }, _process: function (a) { var b = this._data, d = b.words, c = b.sigBytes, e = this.blockSize, f = c / (4 * e), f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0); a = f * e; c = h.min(4 * a, c); if (a) { for (var g = 0; g < a; g += e)this._doProcessBlock(d, g); g = d.splice(0, a); b.sigBytes -= c } return new j.init(g, c) }, clone: function () {
      var a = f.clone.call(this);
      a._data = this._data.clone(); return a
    }, _minBufferSize: 0
  }); l.Hasher = q.extend({
    cfg: f.extend(), init: function (a) { this.cfg = this.cfg.extend(a); this.reset() }, reset: function () { q.reset.call(this); this._doReset() }, update: function (a) { this._append(a); this._process(); return this }, finalize: function (a) { a && this._append(a); return this._doFinalize() }, blockSize: 16, _createHelper: function (a) { return function (b, d) { return (new a.init(d)).finalize(b) } }, _createHmacHelper: function (a) {
      return function (b, d) {
        return (new u.HMAC.init(a,
          d)).finalize(b)
      }
    }
  }); var u = k.algo = {}; return k
}(Math);
(function () {
  var h = CryptoJS, j = h.lib.WordArray; h.enc.Base64 = {
    stringify: function (b) { var e = b.words, f = b.sigBytes, c = this._map; b.clamp(); b = []; for (var a = 0; a < f; a += 3)for (var d = (e[a >>> 2] >>> 24 - 8 * (a % 4) & 255) << 16 | (e[a + 1 >>> 2] >>> 24 - 8 * ((a + 1) % 4) & 255) << 8 | e[a + 2 >>> 2] >>> 24 - 8 * ((a + 2) % 4) & 255, g = 0; 4 > g && a + 0.75 * g < f; g++)b.push(c.charAt(d >>> 6 * (3 - g) & 63)); if (e = c.charAt(64)) for (; b.length % 4;)b.push(e); return b.join("") }, parse: function (b) {
      var e = b.length, f = this._map, c = f.charAt(64); c && (c = b.indexOf(c), -1 != c && (e = c)); for (var c = [], a = 0, d = 0; d <
        e; d++)if (d % 4) { var g = f.indexOf(b.charAt(d - 1)) << 2 * (d % 4), h = f.indexOf(b.charAt(d)) >>> 6 - 2 * (d % 4); c[a >>> 2] |= (g | h) << 24 - 8 * (a % 4); a++ } return j.create(c, a)
    }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
  }
})();
var CryptoJS = CryptoJS || function (g, l) {
  var e = {}, d = e.lib = {}, m = function () { }, k = d.Base = { extend: function (a) { m.prototype = this; var c = new m; a && c.mixIn(a); c.hasOwnProperty("init") || (c.init = function () { c.$super.init.apply(this, arguments) }); c.init.prototype = c; c.$super = this; return c }, create: function () { var a = this.extend(); a.init.apply(a, arguments); return a }, init: function () { }, mixIn: function (a) { for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]); a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function () { return this.init.prototype.extend(this) } },
  p = d.WordArray = k.extend({
    init: function (a, c) { a = this.words = a || []; this.sigBytes = c != l ? c : 4 * a.length }, toString: function (a) { return (a || n).stringify(this) }, concat: function (a) { var c = this.words, q = a.words, f = this.sigBytes; a = a.sigBytes; this.clamp(); if (f % 4) for (var b = 0; b < a; b++)c[f + b >>> 2] |= (q[b >>> 2] >>> 24 - 8 * (b % 4) & 255) << 24 - 8 * ((f + b) % 4); else if (65535 < q.length) for (b = 0; b < a; b += 4)c[f + b >>> 2] = q[b >>> 2]; else c.push.apply(c, q); this.sigBytes += a; return this }, clamp: function () {
      var a = this.words, c = this.sigBytes; a[c >>> 2] &= 4294967295 <<
        32 - 8 * (c % 4); a.length = g.ceil(c / 4)
    }, clone: function () { var a = k.clone.call(this); a.words = this.words.slice(0); return a }, random: function (a) { for (var c = [], b = 0; b < a; b += 4)c.push(4294967296 * g.random() | 0); return new p.init(c, a) }
  }), b = e.enc = {}, n = b.Hex = {
    stringify: function (a) { var c = a.words; a = a.sigBytes; for (var b = [], f = 0; f < a; f++) { var d = c[f >>> 2] >>> 24 - 8 * (f % 4) & 255; b.push((d >>> 4).toString(16)); b.push((d & 15).toString(16)) } return b.join("") }, parse: function (a) {
      for (var c = a.length, b = [], f = 0; f < c; f += 2)b[f >>> 3] |= parseInt(a.substr(f,
        2), 16) << 24 - 4 * (f % 8); return new p.init(b, c / 2)
    }
  }, j = b.Latin1 = { stringify: function (a) { var c = a.words; a = a.sigBytes; for (var b = [], f = 0; f < a; f++)b.push(String.fromCharCode(c[f >>> 2] >>> 24 - 8 * (f % 4) & 255)); return b.join("") }, parse: function (a) { for (var c = a.length, b = [], f = 0; f < c; f++)b[f >>> 2] |= (a.charCodeAt(f) & 255) << 24 - 8 * (f % 4); return new p.init(b, c) } }, h = b.Utf8 = { stringify: function (a) { try { return decodeURIComponent(escape(j.stringify(a))) } catch (c) { throw Error("Malformed UTF-8 data"); } }, parse: function (a) { return j.parse(unescape(encodeURIComponent(a))) } },
  r = d.BufferedBlockAlgorithm = k.extend({
    reset: function () { this._data = new p.init; this._nDataBytes = 0 }, _append: function (a) { "string" == typeof a && (a = h.parse(a)); this._data.concat(a); this._nDataBytes += a.sigBytes }, _process: function (a) { var c = this._data, b = c.words, f = c.sigBytes, d = this.blockSize, e = f / (4 * d), e = a ? g.ceil(e) : g.max((e | 0) - this._minBufferSize, 0); a = e * d; f = g.min(4 * a, f); if (a) { for (var k = 0; k < a; k += d)this._doProcessBlock(b, k); k = b.splice(0, a); c.sigBytes -= f } return new p.init(k, f) }, clone: function () {
      var a = k.clone.call(this);
      a._data = this._data.clone(); return a
    }, _minBufferSize: 0
  }); d.Hasher = r.extend({
    cfg: k.extend(), init: function (a) { this.cfg = this.cfg.extend(a); this.reset() }, reset: function () { r.reset.call(this); this._doReset() }, update: function (a) { this._append(a); this._process(); return this }, finalize: function (a) { a && this._append(a); return this._doFinalize() }, blockSize: 16, _createHelper: function (a) { return function (b, d) { return (new a.init(d)).finalize(b) } }, _createHmacHelper: function (a) {
      return function (b, d) {
        return (new s.HMAC.init(a,
          d)).finalize(b)
      }
    }
  }); var s = e.algo = {}; return e
}(Math);
(function () {
  var g = CryptoJS, l = g.lib, e = l.WordArray, d = l.Hasher, m = [], l = g.algo.SHA1 = d.extend({
    _doReset: function () { this._hash = new e.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520]) }, _doProcessBlock: function (d, e) {
      for (var b = this._hash.words, n = b[0], j = b[1], h = b[2], g = b[3], l = b[4], a = 0; 80 > a; a++) {
        if (16 > a) m[a] = d[e + a] | 0; else { var c = m[a - 3] ^ m[a - 8] ^ m[a - 14] ^ m[a - 16]; m[a] = c << 1 | c >>> 31 } c = (n << 5 | n >>> 27) + l + m[a]; c = 20 > a ? c + ((j & h | ~j & g) + 1518500249) : 40 > a ? c + ((j ^ h ^ g) + 1859775393) : 60 > a ? c + ((j & h | j & g | h & g) - 1894007588) : c + ((j ^ h ^
          g) - 899497514); l = g; g = h; h = j << 30 | j >>> 2; j = n; n = c
      } b[0] = b[0] + n | 0; b[1] = b[1] + j | 0; b[2] = b[2] + h | 0; b[3] = b[3] + g | 0; b[4] = b[4] + l | 0
    }, _doFinalize: function () { var d = this._data, e = d.words, b = 8 * this._nDataBytes, g = 8 * d.sigBytes; e[g >>> 5] |= 128 << 24 - g % 32; e[(g + 64 >>> 9 << 4) + 14] = Math.floor(b / 4294967296); e[(g + 64 >>> 9 << 4) + 15] = b; d.sigBytes = 4 * e.length; this._process(); return this._hash }, clone: function () { var e = d.clone.call(this); e._hash = this._hash.clone(); return e }
  }); g.SHA1 = d._createHelper(l); g.HmacSHA1 = d._createHmacHelper(l)
})();
(function () {
  var g = CryptoJS, l = g.enc.Utf8; g.algo.HMAC = g.lib.Base.extend({
    init: function (e, d) { e = this._hasher = new e.init; "string" == typeof d && (d = l.parse(d)); var g = e.blockSize, k = 4 * g; d.sigBytes > k && (d = e.finalize(d)); d.clamp(); for (var p = this._oKey = d.clone(), b = this._iKey = d.clone(), n = p.words, j = b.words, h = 0; h < g; h++)n[h] ^= 1549556828, j[h] ^= 909522486; p.sigBytes = b.sigBytes = k; this.reset() }, reset: function () { var e = this._hasher; e.reset(); e.update(this._iKey) }, update: function (e) { this._hasher.update(e); return this }, finalize: function (e) {
      var d =
        this._hasher; e = d.finalize(e); d.reset(); return d.finalize(this._oKey.clone().concat(e))
    }
  })
})();

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
  var e = CryptoJS, f = e.lib.WordArray, e = e.enc; e.Utf16 = e.Utf16BE = { stringify: function (b) { var d = b.words; b = b.sigBytes; for (var c = [], a = 0; a < b; a += 2)c.push(String.fromCharCode(d[a >>> 2] >>> 16 - 8 * (a % 4) & 65535)); return c.join("") }, parse: function (b) { for (var d = b.length, c = [], a = 0; a < d; a++)c[a >>> 1] |= b.charCodeAt(a) << 16 - 16 * (a % 2); return f.create(c, 2 * d) } }; e.Utf16LE = {
    stringify: function (b) {
      var d = b.words; b = b.sigBytes; for (var c = [], a = 0; a < b; a += 2)c.push(String.fromCharCode((d[a >>> 2] >>> 16 - 8 * (a % 4) & 65535) << 8 & 4278255360 | (d[a >>>
        2] >>> 16 - 8 * (a % 4) & 65535) >>> 8 & 16711935)); return c.join("")
    }, parse: function (b) { for (var d = b.length, c = [], a = 0; a < d; a++) { var e = c, g = a >>> 1, j = e[g], h = b.charCodeAt(a) << 16 - 16 * (a % 2); e[g] = j | h << 8 & 4278255360 | h >>> 8 & 16711935 } return f.create(c, 2 * d) }
  }
})();




/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var Base = C_lib.Base;
  var C_enc = C.enc;
  var Utf8 = C_enc.Utf8;
  var C_algo = C.algo;

  /**
   * HMAC algorithm.
   */
  var HMAC = C_algo.HMAC = Base.extend({
    /**
     * Initializes a newly created HMAC.
     *
     * @param {Hasher} hasher The hash algorithm to use.
     * @param {WordArray|string} key The secret key.
     *
     * @example
     *
     *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
     */
    init: function (hasher, key) {
      // Init hasher
      hasher = this._hasher = new hasher.init();

      // Convert string to WordArray, else assume WordArray already
      if (typeof key == 'string') {
        key = Utf8.parse(key);
      }

      // Shortcuts
      var hasherBlockSize = hasher.blockSize;
      var hasherBlockSizeBytes = hasherBlockSize * 4;

      // Allow arbitrary length keys
      if (key.sigBytes > hasherBlockSizeBytes) {
        key = hasher.finalize(key);
      }

      // Clamp excess bits
      key.clamp();

      // Clone key for inner and outer pads
      var oKey = this._oKey = key.clone();
      var iKey = this._iKey = key.clone();

      // Shortcuts
      var oKeyWords = oKey.words;
      var iKeyWords = iKey.words;

      // XOR keys with pad constants
      for (var i = 0; i < hasherBlockSize; i++) {
        oKeyWords[i] ^= 0x5c5c5c5c;
        iKeyWords[i] ^= 0x36363636;
      }
      oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

      // Set initial values
      this.reset();
    },

    /**
     * Resets this HMAC to its initial state.
     *
     * @example
     *
     *     hmacHasher.reset();
     */
    reset: function () {
      // Shortcut
      var hasher = this._hasher;

      // Reset
      hasher.reset();
      hasher.update(this._iKey);
    },

    /**
     * Updates this HMAC with a message.
     *
     * @param {WordArray|string} messageUpdate The message to append.
     *
     * @return {HMAC} This HMAC instance.
     *
     * @example
     *
     *     hmacHasher.update('message');
     *     hmacHasher.update(wordArray);
     */
    update: function (messageUpdate) {
      this._hasher.update(messageUpdate);

      // Chainable
      return this;
    },

    /**
     * Finalizes the HMAC computation.
     * Note that the finalize operation is effectively a destructive, read-once operation.
     *
     * @param {WordArray|string} messageUpdate (Optional) A final message update.
     *
     * @return {WordArray} The HMAC.
     *
     * @example
     *
     *     var hmac = hmacHasher.finalize();
     *     var hmac = hmacHasher.finalize('message');
     *     var hmac = hmacHasher.finalize(wordArray);
     */
    finalize: function (messageUpdate) {
      // Shortcut
      var hasher = this._hasher;

      // Compute HMAC
      var innerHash = hasher.finalize(messageUpdate);
      hasher.reset();
      var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

      return hmac;
    }
  });
}());


module.exports = CryptoJS;