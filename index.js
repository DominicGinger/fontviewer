function drawGlyphs(n) {
  let chars = '';
  const base = n*16*16*16;
  document.querySelector('.glyphs').innerHTML = '';
  for (let i = base; i < base+16*16*16; i++) {
    const value = String.fromCharCode(i);
    chars += `${value}\t`;
  }
  document.querySelector('.glyphs').innerHTML += chars;
  window.scrollTo(0, 0);
}

drawGlyphs(0);

const links = document.querySelectorAll('.aside li');
const glyphs = document.querySelector('.glyphs');

function removeSelected() {
  [].forEach.call(links, function(link) {
    link.classList.remove('selected');
  });
}

function addSelected(link) {
  link.classList.add('selected');
}

[].forEach.call(links, function(link, idx) {
  link.addEventListener('click', function(event) {
    drawGlyphs(idx);
    removeSelected();
    addSelected(event.target);
  });
});

document.querySelector('.font-family-selector').addEventListener('change', function(event) {
  glyphs.style.fontFamily = event.target.value;
});

document.querySelector('.font-size-selector').addEventListener('change', function(event) {
  glyphs.style.fontSize = event.target.value;
});

document.querySelector('.color-selector').addEventListener('change', function(event) {
  glyphs.style.color = event.target.value;
});

document.querySelector('.file-reader').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
      console.log(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', function() {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(`
        @font-face {
          font-family: "${file.name}";
          src: url(${reader.result}) format("woff");
        }
      `));
      document.head.appendChild(style);
      glyphs.style.fontFamily = `"${file.name}"`;
    });
  }
});
