# make sure node is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        Write-Host "Install node and npm first then re-run script."
        Write-Host "Go to https://nodejs.org/en/download/ to download and install"
        exit
    }

    while ($true) {
        $confirm = Read-Host "Install Node.js via winget and fnm? [y/n]"
        $confirm = $confirm.ToLower()

        if ($confirm -eq "y" -or $confirm -eq "yes") {
            winget install Schniz.fnm
            # Reset PATH
            $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" +
                        [System.Environment]::GetEnvironmentVariable("PATH", "User")
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
            exit
        } else {
            Write-Host "Please enter yes or no."
        }
    }
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