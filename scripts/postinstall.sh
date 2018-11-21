#!/bin/bash
# where am i? move to where I am. This ensures source is properly sourced
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
# go back a level so we can snag everything
cd ../elements/
# walk each directory and update it's demo automatically
for project in */ ; do
  cd ${project}
  p=${project::-1}
  rm -rf node_modules
  ln -s ../../node_modules
  rm ../../node_modules/@lrnwebcomponents/${p}
  mkdir ../../node_modules/@lrnwebcomponents/${p}
  ln -s ../../../elements/${p}/${p}.js ../../node_modules/@lrnwebcomponents/${p}/${p}.js
  ln -s ../../../elements/${p}/lib ../../node_modules/@lrnwebcomponents/${p}/lib
  cd ../
done