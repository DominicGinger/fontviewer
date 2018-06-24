parcel:
	parcel index.html

build: clean-dist copy-static-files build-sass build-js build-one-file build-trim-white-space

clean-dist:
	rm -rf dist
	mkdir dist

copy-static-files:
	cp index.html dist

build-sass:
	./node_modules/node-sass/bin/node-sass index.scss -o dist --output-style compressed

build-js:
	./node_modules/uglify-es/bin/uglifyjs -c -m -o dist/index.js -- index.js

build-one-file:
	awk '/.*index.scss.*/{system("cat dist/index.css");next}1' dist/index.html > dist/index-css.html
	sed -i '' -e "s/body{/<style>body{/" dist/index-css.html
	sed -i '' -e "s/<\/head>/<\/style><\/head>/" dist/index-css.html
	awk '/.*index.js.*/{system("cat dist/index.js");next}1' dist/index-css.html > dist/index-js.html
	sed -i '' -e "s/const/<script>const/" dist/index-js.html
	sed -i '' -e "s/<\/body>/<\/script><\/body>/" dist/index-js.html
	rm -f dist/index.html dist/index-css.html dist/index.css dist/index.js
	mv dist/index-js.html dist/index.html
	
build-trim-white-space:
	tr -s ' ' < dist/index.html > dist/index-s.html
	tr -d '\n' < dist/index-s.html > dist/index-n.html
	rm -f dist/index.html dist/index-s.html
	mv dist/index-n.html dist/index.html

build-zip:
	gzip -9 -k -r dist/*
	mkdir dist/zipped
	mv dist/index.html.gz dist/zipped/index.html

