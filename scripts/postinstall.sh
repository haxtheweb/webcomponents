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
  DIRECTORY="../../node_modules/@lrnwebcomponents/${p}"
  if [ -d "$DIRECTORY" ]; then
    rm ../../node_modules/@lrnwebcomponents/${p}
    mkdir ../../node_modules/@lrnwebcomponents/${p}
    if [ -f "${p}.js" ]; then
      ln -s ../../../elements/${p}/${p}.js ../../node_modules/@lrnwebcomponents/${p}/${p}.js
    fi
    if [ -d "lib" ]; then
      ln -s ../../../elements/${p}/lib ../../node_modules/@lrnwebcomponents/${p}/lib
    fi
    if [ -d "build" ]; then
      ln -s ../../../elements/${p}/build ../../node_modules/@lrnwebcomponents/${p}/build
    fi
    if [ -d "src" ]; then
      ln -s ../../../elements/${p}/src ../../node_modules/@lrnwebcomponents/${p}/src
    fi
    if [ -d "dist" ]; then
      ln -s ../../../elements/${p}/dist ../../node_modules/@lrnwebcomponents/${p}/dist
    fi
  fi
  cd ../
done