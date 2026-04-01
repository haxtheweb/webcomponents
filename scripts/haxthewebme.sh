#!/bin/bash

install_if_missing() {
  local pkg="$1"

  if ! command -v "$pkg" &>/dev/null; then
    echo "$pkg dependency is missing"
    # Git Bash/Cygwin usually already have common utils
    if command -v apt-get &>/dev/null; then
      echo "Installing $pkg with apt..."
      sudo apt-get update -qq && sudo apt-get install -y "$pkg"
    elif command -v dnf &>/dev/null; then
      echo "Installing $pkg with dnf..."
      sudo dnf install -y "$pkg"
    elif command -v yum &>/dev/null; then
      echo "Installing $pkg with yum..."
      sudo yum install -y "$pkg"
    elif command -v zypper &>/dev/null; then
      echo "Installing $pkg with zypper..."
      sudo zypper install -y "$pkg"
    elif command -v pacman &>/dev/null; then
      echo "Installing $pkg with pacman..."
      sudo pacman -Sy --noconfirm "$pkg"
    elif command -v apk &>/dev/null; then
      echo "Installing $pkg with apk..."
      sudo apk update -q && sudo apk add "$pkg"
    else
      echo "Error: No supported package manager found. Please install $pkg manually"
      exit
    fi
  fi
}

install_if_missing bzip2
install_if_missing curl
install_if_missing unzip

unameOut="$(uname -s)"
case "${unameOut}" in
    Linux*)     machine=Linux;;
    Darwin*)    machine=Mac;;
    CYGWIN*)    machine=Cygwin;;
    MINGW*)     machine=MinGw;;
    *)          machine="UNKNOWN:${unameOut}"
esac

unable_to_install(){
  echo "Install node and npm first then re-run script"
  echo "Go to https://nodejs.org/en/download/ to download and install"
  exit
}

source_shell(){
  CURRENT_SHELL="$(basename "$SHELL")"
  if [ "$CURRENT_SHELL" = "zsh" ]; then
    source ${ZDOTDIR:-$HOME}/.zshrc
  elif [ "$CURRENT_SHELL" = "fish" ]; then
    source $HOME/.config/fish/conf.d/fnm.fish
  elif [ "$CURRENT_SHELL" = "bash" ]; then
    source $HOME/.bashrc
  else
    echo "Could not infer shell type. Please run 'source <your shell config>' manually."
    echo "Then re-run script"
    exit
  fi
}

# make sure node is installed
if ! command -v node; then
  while true; do
    read -rp "Install Node.js via fnm? [y/n]: " confirm
    confirm_lowercase="${confirm,,}"

    if [[ "$confirm_lowercase" == "y" || "$confirm_lowercase" == "yes" ]]; then
      if [[ "${machine}" == "Cygwin" || "${machine}" == "MinGw" ]]; then
        if ! command -v winget; then echo "Winget is not available"; unable_to_install; fi

        winget install Schniz.fnm
        # Simplest way to refresh PATH changes from Windows side
        export PATH="$PATH:$HOME/AppData/Local/Microsoft/WinGet/Links/"
        # $PROFILE environment variable isn't inherited by Git Bash, intentionally single quotes so Bash doesn't expand
        powershell -C 'if (-not (Test-Path $PROFILE)) { New-Item $PROFILE -Force }'
        powershell -C 'Add-Content -Path $PROFILE -Value "`nfnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression"'
        # Write to PowerShell start profile so Node works outside Git Bash
        echo "Added fnm init to PowerShell profile."

        # Write to bashrc
        echo 'eval "$(fnm env --use-on-cd --shell bash)"' >> ~/.bashrc
        source "$HOME/.bashrc"
        fnm install --lts --use
      else
        curl -fsSL https://fnm.vercel.app/install | bash -s -- --force-install
        source_shell
        fnm install --lts --use
      fi
      break
    elif [[ "$confirm_lowercase" == "n" || "$confirm_lowercase" == "no" ]]; then
      unable_to_install
    else
      echo "Please enter yes or no."
    fi
  done
fi

# if yarn isn't installed install it
if ! command -v yarn;then
  npm -g install yarn
fi

clone_and_install () {
  if [[ "$PWD" == *webcomponents* && -d ".git/" ]]; then
    echo "Already cloned repository to working directory, continuing"
  else
    git clone https://github.com/haxtheweb/webcomponents.git
    cd webcomponents
  fi
  npm install -g add @haxtheweb/create
  yarn global add web-component-analyzer
  [ ! -d node_modules ] && { [ -f yarn.lock ] && rm yarn.lock; yarn install; }
  
  printf "Use \033[34myarn run haxsite\033[0m to work on the HAXcms interface\n"
  printf "Run \033[34mcd elements/<ELEMENTNAME>\033[0m, then \033[34myarn start\033[0m to work on a specific element\n"
}

if [[ "${machine}" == "Cygwin" || "${machine}" == "MinGw" ]]; then
  git config --global core.autocrlf true
  clone_and_install
else
  clone_and_install
fi
