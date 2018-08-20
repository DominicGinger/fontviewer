// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({8:[function(require,module,exports) {
var glyphs = document.querySelector('.glyphs');
var color = '#3e3e3e';
var fontFamily = void 0;
var webFonts = {
  Hack: 'https://cdnjs.cloudflare.com/ajax/libs/hack-font/3.003/web/fonts/hack-bold-subset.woff',
  FontAwesome: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff'
};
var fonts = {};

document.querySelectorAll('.fonts .font').forEach(function (el) {
  return el.addEventListener('click', selectFont);
});

function selectFont(event) {
  document.querySelectorAll('.fonts .font').forEach(function (el) {
    return el.classList.remove('selected');
  });
  event.target.classList.add('selected');
  var fontName = event.target.textContent;
  if (Object.keys(fonts).includes(fontName)) {
    showArrayBuffer(fonts[fontName], true);
    return;
  }

  showWebFont(webFonts[fontName]);
}

function showWebFont(url) {
  fetch(url).then(function (res) {
    return res.blob();
  }).then(function (blob) {
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
      var ab = event.target.result;
      showArrayBuffer(ab, true, false);
    };
    fileReader.readAsArrayBuffer(blob);
  });
}

function showArrayBuffer(ab, displayFont) {
  var newFont = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var font = void 0;
  try {
    font = opentype.parse(ab);
  } catch (err) {
    font = { supported: false };
  }
  showFont(font, ab, displayFont);

  if (newFont) {
    var fontList = document.querySelectorAll('.fonts .font');
    fontList[fontList.length - 1].addEventListener('click', selectFont);
    fontList.forEach(function (el) {
      return el.classList.remove('selected');
    });
    fontList[fontList.length - 1].classList.add('selected');
  }
}

document.querySelector('.file-reader').addEventListener('change', function (event) {
  var file = event.target.files[0];
  if (file) {
    var arrayReader = new FileReader();
    arrayReader.readAsArrayBuffer(file);
    arrayReader.onload = function (event) {
      showArrayBuffer(event.target.result, true, true);

      localStorage.setItem(fontFamily, abToStr(event.target.result));
    };
  }
});

function showFont(font, ab, displayFont) {
  document.querySelector('.details').style.visibility = 'hidden';
  if (!font || !font.supported) {
    fontFamily = '"Helvetica Neue", Helvetica, Arial';
    glyphs.style.color = 'tomato';
    glyphs.style.fontFamily = fontFamily;
    glyphs.innerHTML = 'Invalid font file or unsupported format';
    return;
  }
  var charCodes = Object.values(font.glyphs.glyphs).filter(function (glyph) {
    return glyph.unicode !== undefined;
  }).map(function (g) {
    return g.unicode;
  });
  fontFamily = Object.values(font.names.fontFamily)[0];

  var fontFace = new window.FontFace(fontFamily, ab);
  document.fonts.add(fontFace);

  if (displayFont) {
    var inner = charCodes.map(function (charCode) {
      return '<span class="glyph" data-unicode="' + charCode + '">' + String.fromCharCode(charCode) + '</span>';
    }).join('\t');
    glyphs.innerHTML = inner;

    document.querySelectorAll('.glyph').forEach(function (g) {
      g.addEventListener('mousemove', showDetails);
      g.addEventListener('touchmove', showDetails);
    });

    glyphs.style.color = color;
    glyphs.style.fontFamily = fontFamily;
  }

  if (!Object.keys(fonts).includes(fontFamily) && !Object.keys(webFonts).includes(fontFamily)) {
    var li = document.createElement('li');
    li.classList.add('font');
    li.innerHTML = fontFamily;
    fonts[fontFamily] = ab;
    document.querySelector('.fonts').appendChild(li);
  }
  return fontFamily;
}

function showDetails(event) {
  var unicode = event.target.dataset.unicode;
  var details = document.querySelector('.details');
  var unicodeBox = details.querySelector('.unicode');
  var decimalBox = details.querySelector('.decimal');
  var htmlCodeBox = details.querySelector('.html');
  var charBox = details.querySelector('.char');

  details.style.visibility = 'hidden';
  details.classList.remove('trans');
  setTimeout(function () {
    details.style.visibility = 'visible';
    details.style.top = event.target.offsetTop - 50 + 'px';
    details.style.left = event.target.offsetLeft - 15 + 'px';
    unicodeBox.innerHTML = '0x' + ('0000' + parseInt(unicode).toString(16)).slice(-4);
    decimalBox.innerHTML = unicode;
    htmlCodeBox.innerHTML = '&amp;#' + unicode + ';';
    charBox.style.fontFamily = fontFamily;
    charBox.innerHTML = String.fromCharCode(unicode);

    details.classList.add('trans');

    details.addEventListener('mouseleave', function () {
      return details.style.visibility = 'hidden';
    });
  }, 1);
}

function abToStr(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function strToAb(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

for (var i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  var value = localStorage.getItem(key);
  showArrayBuffer(strToAb(value), false, true);
}
document.querySelectorAll('.fonts .font').forEach(function (el) {
  return el.classList.remove('selected');
});

document.querySelector('.url-input input').addEventListener('keypress', function (event) {
  if (event.charCode === 13) {
    showWebFont(event.target.value);
    event.target.value = '';
  }
});
},{}],12:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '55354' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[12,8], null)
//# sourceMappingURL=/fontviewer.c5e0a12c.map