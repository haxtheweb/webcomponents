#!/bin/bash
unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac

# make sure node is installed
if ! command -v node;then
  echo "Install node and npm first then re-run script"
  echo "Go to https://nodejs.org/en/download/ to download and install"
  exit
fi

clone_and_install () {
  git clone https://github.com/elmsln/lrnwebcomponents.git
  cd lrnwebcomponents
  yarn global add symlink-dir
  yarn global add @wcfactory/cli
  yarn global add polymer-cli
  yarn global add @web/test-runner
  yarn global add @web/test-runner-commands
  yarn global add @web/test-runner-puppeteer
  yarn global add @web/test-runner-playwright
  yarn global add lerna
  yarn global add web-component-analyzer
  yarn install
}

# if yarn isn't installed install it
if ! command -v yarn;then
  npm -g install yarn
fi

if [ "${machine}" == "Cygwin" ]; then
  git config --global core.autocrlf true
  clone_and_install
elif [ "${machine}" == "MinGw" ]; then
  git config --global core.autocrlf true
  clone_and_install
else
  clone_and_install
fi
