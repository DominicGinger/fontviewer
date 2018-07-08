const glyphs = document.querySelector('.glyphs');
let color = 'DimGrey';
let size = '96px'

document.querySelector('.font-family-selector').addEventListener('change', function(event) {
  opentype.load(`/fonts/${event.target.value}-Regular.ttf`, (err, font) => {
    if (err) {
      console.log(err);
    }
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(`
        @font-face {
          font-family: Lato;
          src: url(/fonts/${event.target.value}-Regular.ttf);
        }
      `));
    document.head.appendChild(style);
    showFont(font);
  });
});

document.querySelector('.font-size-selector').addEventListener('change', function(event) {
  const x = event.target.value;
  glyphs.style.fontSize = x;
  size = `${parseInt(x) + parseInt(x)}px`;
  console.log(size);
  document.querySelectorAll('.glyph').forEach(g => {
    g.style.maxWidth = size;
    g.style.minWidth = size;
    g.style.maxHeight = size;
    g.style.minHeight = size;
  });
});

document.querySelector('.color-selector').addEventListener('change', function(event) {
  color = event.target.value;
  glyphs.style.color = color;
});

document.querySelector('.file-reader').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const arrayReader = new FileReader();
    arrayReader.readAsArrayBuffer(file);
    arrayReader.onload = function(event) {
      let font;
      try {
        font = opentype.parse(event.target.result);
      } catch (err) {
        font = { supported: false };
      }
      showFont(font);
    }
  }
});

function showFont(font) {
  if (!font.supported) {
    glyphs.style.color = 'tomato';
    glyphs.style.fontFamily = '"Helvetica Neue", Helvetica, Arial';
    glyphs.innerHTML = 'Invalid font file or unsupported format';
    return;
  }
  const charCodes = Object.values(font.glyphs.glyphs).filter(glyph => glyph.unicode !== undefined).map(g => g.unicode)
  const fontName = Object.values(font.names.fontFamily)[0];

  const inner = charCodes.map(charCode => `<span class="glyph" data-unicode="${charCode}">${String.fromCharCode(charCode)}</span>`).join('\t');
  glyphs.innerHTML = inner;

  const fontFace = new window.FontFace(fontName, event.target.result);
  console.log(fontName)
  document.fonts.add(fontFace);

  document.querySelectorAll('.glyph').forEach(g => {
    g.style.maxWidth = size;
    g.style.minWidth = size;
    g.style.maxHeight = size;
    g.style.minHeight = size;

    g.addEventListener('mouseover', event => {
      const unicode = event.target.dataset.unicode;
      const details = document.querySelector('.details');
      details.style.visibility = 'visible';
      details.innerHTML = unicode;
      details.style.top = `${event.clientY}px`;
      details.style.left = `${event.clientX}px`;
    });
  });
  glyphs.style.color = color;
  glyphs.style.fontFamily = fontName;
}

