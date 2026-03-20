#!/bin/bash

# where am i? move to where I am. This ensures source is properly sourced
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
cd ../node_modules/@haxtheweb/
# ensure our node modules are not nested in _deprecated dependencies
for project in */ ; do
  cd ${project}
  rm -rf node_modules
  cd ../
done
# go back a level so we can snag everything
cd ../../elements/
# walk each directory and update it's demo automatically
for project in */ ; do
  cd ${project}
  p="$(basename -- $project)"
  rm -rf node_modules
  # drop symlink but NOT actual directories
  unlink ../../node_modules/@haxtheweb/${p}
  # if it was a folder, then this will just fail without an issue
  mkdir ../../node_modules/@haxtheweb/${p}
  if [ -f "${p}.js" ]; then
    ln -s ../../../elements/${p}/${p}.js ../../node_modules/@haxtheweb/${p}/${p}.js
  fi
  if [ -f "package.json" ]; then
    ln -s ../../../elements/${p}/package.json ../../node_modules/@haxtheweb/${p}/package.json
  fi
  if [ -d "lib" ]; then
      ln -s ../../../elements/${p}/lib ../../node_modules/@haxtheweb/${p}/lib
  fi
  if [ -d "locales" ]; then
    ln -s ../../../elements/${p}/locales ../../node_modules/@haxtheweb/${p}/locales
  fi
  if [ -d "server" ]; then
    ln -s ../../../elements/${p}/server ../../node_modules/@haxtheweb/${p}/server
  fi
  if [ -d "build" ]; then
      ln -s ../../../elements/${p}/build ../../node_modules/@haxtheweb/${p}/build
  fi
  if [ -d "dist" ]; then
      ln -s ../../../elements/${p}/dist ../../node_modules/@haxtheweb/${p}/dist
  fi
  if [ -d "lib/lib" ]; then
    echo "Found nested lib/lib in $project, deleting..."
    unlink lib/lib
  fi
  if [ -d "locales/locales" ]; then
    echo "Found nested locales/locales in $project, deleting..."
    unlink locales/locales
  fi
  cd ../
done
# this ensures that the storybook tooling works
cd $DIR
cd ../node_modules/storybook-prebuilt
yarn install --prod