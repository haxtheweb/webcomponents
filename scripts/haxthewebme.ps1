# make sure node is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Install node and npm first then re-run script"
  Write-Host "Go to https://nodejs.org/en/download/ to download and install"
  exit
}

# if yarn isn't installed, install it
if (-not (Get-Command yarn -ErrorAction SilentlyContinue)) {
  npm install -g yarn
}

git clone https://github.com/haxtheweb/webcomponents.git
Set-Location webcomponents
npm install -g @haxtheweb/create
yarn global add web-component-analyzer
yarn install