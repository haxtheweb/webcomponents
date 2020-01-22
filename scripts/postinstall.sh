#!/bin/bash
# where am i? move to where I am. This ensures source is properly sourced
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
# go back a level so we can snag everything
cd ../elements/
# walk each directory and update it's demo automatically
for project in */ ; do
  cd $DIR
  cd ../elements/${project}
  p="$(basename -- $project)"
  rm -rf node_modules
  symlink-dir ../../node_modules node_modules
  DIRECTORY="../../node_modules/@lrnwebcomponents/${p}"
  if [ -d "$DIRECTORY" ]; then
    rm -rf ../../node_modules/@lrnwebcomponents/${p}
  fi
  mkdir ../../node_modules/@lrnwebcomponents/${p}
  cd ../../node_modules/@lrnwebcomponents/${p}
  if [ -f "../../../elements/${p}/${p}.js" ]; then
    symlink-dir ../../../elements/${p}/${p}.js ${p}.js
  fi
  if [ -d "../../../elements/${p}/lib" ]; then
    symlink-dir ../../../elements/${p}/lib lib
  fi
  if [ -d "../../../elements/${p}/build" ]; then
    symlink-dir ../../../elements/${p}/build build
  fi
  if [ -d "../../../elements/${p}/src" ]; then
    symlink-dir ../../../elements/${p}/src src
  fi
  if [ -d "../../../elements/${p}/dist" ]; then
    symlink-dir ../../../elements/${p}/dist dist
  fi
done
