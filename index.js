const glyphs = document.querySelector('.glyphs');
let color = '#3e3e3e';
let fontFamily;
const fonts = [];

document.querySelectorAll('.fonts .font').forEach(el => el.addEventListener('click', selectFont))

function selectFont(event) {
  document.querySelectorAll('.fonts .font').forEach(el => el.classList.remove('selected'))
  event.target.classList.add('selected');
  const fontName = event.target.textContent;
  if (fonts.includes(fontName)) {
    glyphs.style.fontFamily = fontName;
    return;
  }
  opentype.load(`/fonts/${fontName}-Regular.ttf`, (err, font) => {
    if (err) {
      console.log(err);
    }
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(`
        @font-face {
          font-family: ${fontName};
          src: url(/fonts/${fontName}-Regular.ttf);
        }
      `));
    document.head.appendChild(style);
    showFont(font);
    fonts.push(fontName);
  });
}

function showArrayBuffer(ab) {
  let font;
  try {
    font = opentype.parse(ab);
  } catch (err) {
    font = { supported: false };
  }
  const fontFamily = showFont(font);
  const fontList = document.querySelectorAll('.fonts .font');
  fontList[fontList.length-1].addEventListener('click', selectFont)
  fontList.forEach(el => el.classList.remove('selected'))
  fontList[fontList.length-1].classList.add('selected')
}

document.querySelector('.file-reader').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const arrayReader = new FileReader();
    arrayReader.readAsArrayBuffer(file);
    arrayReader.onload = function(event) {
      showArrayBuffer(event.target.result);

      localStorage.setItem(fontFamily, abToStr(event.target.result));
    }
  }
});

function showFont(font) {
  document.querySelector('.details').style.visibility = 'hidden';
  if (!font.supported) {
    fontFamily = '"Helvetica Neue", Helvetica, Arial';
    glyphs.style.color = 'tomato';
    glyphs.style.fontFamily = fontFamily;
    glyphs.innerHTML = 'Invalid font file or unsupported format';
    return;
  }
  const charCodes = Object.values(font.glyphs.glyphs).filter(glyph => glyph.unicode !== undefined).map(g => g.unicode)
  fontFamily = Object.values(font.names.fontFamily)[0];

  const inner = charCodes.map(charCode => `<span class="glyph" data-unicode="${charCode}">${String.fromCharCode(charCode)}</span>`).join('\t');
  glyphs.innerHTML = inner;

  const fontFace = new window.FontFace(fontFamily, event.target.result);
  document.fonts.add(fontFace);

  document.querySelectorAll('.glyph').forEach(g => {
    g.addEventListener('mousemove', showDetails);
    g.addEventListener('touchmove', showDetails);
  });

  glyphs.style.color = color;
  glyphs.style.fontFamily = fontFamily;

  const li = document.createElement('li');
  li.classList.add('font');
  li.innerHTML = fontFamily;
  fonts.push(fontFamily);
  document.querySelector('.fonts').appendChild(li);

  return fontFamily;
}

function showDetails(event) {
  const unicode = event.target.dataset.unicode;
  const details = document.querySelector('.details');
  const unicodeBox = details.querySelector('.unicode');
  const decimalBox = details.querySelector('.decimal');
  const htmlCodeBox = details.querySelector('.html');
  const charBox = details.querySelector('.char');

  details.style.visibility = 'hidden';
  details.classList.remove('trans');
  setTimeout(() => {
    details.style.visibility = 'visible';
    details.style.top = `${event.target.offsetTop-50}px`;
    details.style.left = `${event.target.offsetLeft-15}px`;
    unicodeBox.innerHTML = '0x' + ('0000' + parseInt(unicode).toString(16)).slice(-4);
    decimalBox.innerHTML = unicode;
    htmlCodeBox.innerHTML = `&amp;#${unicode};`;
    charBox.style.fontFamily = fontFamily;
    charBox.innerHTML = String.fromCharCode(unicode);

    details.classList.add('trans');

    details.addEventListener('mouseleave', () => details.style.visibility = 'hidden');
  }, 1);
}

function abToStr(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function strToAb(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

for (var i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  showArrayBuffer(strToAb(value));
  console.log('Key: ' + key);
}
