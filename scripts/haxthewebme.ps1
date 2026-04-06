# make sure node is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Host "Install node and npm first then re-run script."
    Write-Host "Go to https://nodejs.org/en/download/ to download and install"
    return
  }

  while ($true) {
    $confirm = Read-Host "Install Node.js via winget and fnm? [y/n]"
    $confirm = $confirm.ToLower()

    if ($confirm -eq "y" -or $confirm -eq "yes") {
      winget install Schniz.fnm
      # Reset PATH for fnm
      $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" +
                  [System.Environment]::GetEnvironmentVariable("PATH", "User")
      # Grant user permissions to run npm after it's installed
      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

      # Activate fnm in current shell
      fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
      # Add fnm to PowerShell startup profile
      if (-not (Test-Path $PROFILE)) { New-Item $PROFILE -Force }
      Add-Content -Path $PROFILE -Value "`nfnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression"
      Write-Host "Added fnm init to PowerShell profile."
      fnm install --lts --use
      break
    } elseif ($confirm -eq "n" -or $confirm -eq "no") {
      Write-Host "Install node and npm first then re-run script"
      Write-Host "Go to https://nodejs.org/en/download/ to download and install"
      return
    } else {
      Write-Host "Please enter yes or no."
    }
  }
}

# if package isn't installed, install it
if (-not (Get-Command yarn -ErrorAction SilentlyContinue)) {
  npm install -g yarn
}

if (-not (Get-Command hax -ErrorAction SilentlyContinue)) {
  npm install -g @haxtheweb/create
}

if (-not (Get-Command web-component-analyzer -ErrorAction SilentlyContinue)) {
  yarn global add web-component-analyzer
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  if(-not (Test-Path -Path "webcomponents")) {
    Write-Host "Install Git for Windows CLI from https://git-scm.com/install/windows"
    Write-Host "Or clone" -NoNewline
    Write-Host " haxtheweb/webcomponents " -ForegroundColor Blue -NoNewline
    Write-Host "with GitHub Desktop and re-run script in the new directory"
    return
  }
} else {
  git clone https://github.com/haxtheweb/webcomponents.git
  Set-Location webcomponents
}

yarn install