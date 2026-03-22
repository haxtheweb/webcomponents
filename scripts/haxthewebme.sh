#!/bin/bash

if ! command -v bzip2 &>/dev/null;then
  echo "bzip2 dependency is missing"

  # Git Bash/Cygwin provide bzip2 by default
  if command -v apt-get &>/dev/null; then
    echo "Installing with apt..."
    sudo apt-get update -qq && sudo apt-get install -y bzip2
  elif command -v dnf &>/dev/null; then
    echo "Installing with dnf..."
    sudo dnf install -y bzip2
  elif command -v yum &>/dev/null; then
    echo "Installing with yum..."
    sudo yum install -y bzip2
  elif command -v zypper &>/dev/null; then
    echo "Installing with zypper..."
    sudo zypper install -y bzip2
  elif command -v pacman &>/dev/null; then
    echo "Installing with pacman..."
    sudo pacman -Sy --noconfirm bzip2
  else
    echo "Error: No supported package manager found. Please install bzip2"
    exit
  fi
fi

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
  if [ "${machine}" == "Cygwin" ]; then
    echo "Install node and npm first then re-run script"
    echo "Go to https://nodejs.org/en/download/ to download and install"
    exit
  elif [ "${machine}" == "MinGw" ]; then
    echo "Install node and npm first then re-run script"
    echo "Go to https://nodejs.org/en/download/ to download and install"
    exit
  else
    while true; do
      read -rp "Download and run nvm install script? [y/n]: " confirm
      confirm_lowercase="${confirm,,}"

      if [[ "$confirm_lowercase" == "y" || "$confirm_lowercase" == "yes" ]]; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
        \. "$HOME/.nvm/nvm.sh"
        nvm install 24
        break
      elif [[ "$confirm_lowercase" == "n" || "$confirm_lowercase" == "no" ]]; then
        echo "Install node and npm first then re-run script"
        echo "Go to https://nodejs.org/en/download/ to download and install"
        exit
      else
        echo "Please enter yes or no."
      fi
  done
  fi
fi

# if yarn isn't installed install it
if ! command -v yarn;then
  npm -g install yarn
fi

clone_and_install () {
  git clone https://github.com/haxtheweb/webcomponents.git
  cd webcomponents
  npm install -g add @haxtheweb/create
  yarn global add web-component-analyzer
  yarn install
}

if [ "${machine}" == "Cygwin" ]; then
  git config --global core.autocrlf true
  clone_and_install
elif [ "${machine}" == "MinGw" ]; then
  git config --global core.autocrlf true
  clone_and_install
else
  clone_and_install
fi
