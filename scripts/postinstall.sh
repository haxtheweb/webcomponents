#!/bin/bash
unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac
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
  if [ "${machine}" == "MinGw" ]; then
    # Check and create symlink function for Windows Git Bash
    create_symlink_win() {
      target="$1"
      link="$2"
      if [[ ! -e "$link" ]]; then
        cmd //c mklink //d "$(cygpath -w "$link")" "$(cygpath -w "$target")"
      elif [[ -L "$link" && "$(readlink "$link")" != "$target" ]]; then
        rm "$link"
        cmd //c mklink //d "$(cygpath -w "$link")" "$(cygpath -w "$target")"
      fi
    }
    if [ -f "${p}.js" ]; then
      create_symlink_win ../../../elements/${p}/${p}.js ../../node_modules/@haxtheweb/${p}/${p}.js
    fi
    if [ -f "package.json" ]; then
      create_symlink_win ../../../elements/${p}/package.json ../../node_modules/@haxtheweb/${p}/package.json
    fi
    if [ -d "lib" ]; then
      create_symlink_win ../../../elements/${p}/lib ../../node_modules/@haxtheweb/${p}/lib
    fi
    if [ -d "locales" ]; then
      create_symlink_win ../../../elements/${p}/locales ../../node_modules/@haxtheweb/${p}/locales
    fi
    if [ -d "server" ]; then
      create_symlink_win ../../../elements/${p}/server ../../node_modules/@haxtheweb/${p}/server
    fi
    if [ -d "build" ]; then
      create_symlink_win ../../../elements/${p}/build ../../node_modules/@haxtheweb/${p}/build
    fi
    if [ -d "src" ]; then
      create_symlink_win ../../../elements/${p}/src ../../node_modules/@haxtheweb/${p}/src
    fi
    if [ -d "dist" ]; then
      create_symlink_win ../../../elements/${p}/dist ../../node_modules/@haxtheweb/${p}/dist
    fi
  else
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
    if [ -d "src" ]; then
       ln -s ../../../elements/${p}/src ../../node_modules/@haxtheweb/${p}/src
    fi
    if [ -d "dist" ]; then
       ln -s ../../../elements/${p}/dist ../../node_modules/@haxtheweb/${p}/dist
    fi
  fi
  if [ -d "src/src" ]; then
    echo "Found nested src/src in $project, deleting..."
    unlink src/src
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