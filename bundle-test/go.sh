#!/bin/sh

echo "#"
echo "# ===== BUILD ====="
echo "#"

npm run build

echo "\n"
echo "#"
echo "# ===== NODE ES6 TEST ====="
echo "#"
echo "# Import bundle with node via es6 'import' syntax..."
echo "#"

node ./test-node-esm.mjs

echo "\n"
echo "#"
echo "# ===== NODE UMD TEST ====="
echo "#"
echo "# Import UMD bundle with node via 'require' syntax"
echo "#"

node ./test-node-umd.js

echo "\n"
echo "# "
echo "# ===== BROWSER TESTS ====="
echo "# "
echo "# 1) Test UMD bundle with script-tag import:"
echo "#"
echo "#  >>> http://localhost:8000/bundle-test/test-umd-script.html"
echo "# "
echo "# 2) Test UMD bundle with AMD import:"
echo "#"
echo "#  >>> http://localhost:8000/bundle-test/test-umd-amd.html"
echo "#"
echo "# (check browser console for raw parse result)"
echo "#"
echo "\n"

(cd ..; python -m SimpleHTTPServer 8000)
