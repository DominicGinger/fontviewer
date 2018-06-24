function showGlyphs(j) {
    let chars = '';
    for (let i = 0; i < 16*16*16; i++) {
      const value = String.fromCharCode(parseInt(i*j, 16));
      chars += `${value}\t`;
    }
    document.querySelector('.glyphs').innerHTML = chars;
}
showGlyphs(1);

const links = document.querySelectorAll('.aside li');

function removeSelected() {
[].forEach.call(links, function(link) {
  link.classList.remove('selected');
});
}

function addSelected(link) {
  link.classList.add('selected');
}

[].forEach.call(links, function(link, idx) {
  console.log(link, idx);
  link.addEventListener('click', function(event) {
    showGlyphs(idx + 1);
    removeSelected();
    addSelected(event.target);
  });
});

