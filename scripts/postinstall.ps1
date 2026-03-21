# Where am I? Move to where I am. This ensures the source is properly sourced
$DIR = Get-Location
Set-Location -Path $DIR
Set-Location -Path "../node_modules/@haxtheweb/"

# Ensure our node modules are not nested in _deprecated dependencies
Get-ChildItem -Directory | ForEach-Object {
    Set-Location -Path $_.FullName
    Remove-Item -Recurse -Force -Path "node_modules"
    Set-Location -Path $DIR
}

# Go back a level so we can snag everything
Set-Location -Path "../../elements/"

# Walk each directory and update its demo automatically
Get-ChildItem -Directory | ForEach-Object {
    Set-Location -Path $_.FullName
    $p = $_.Name

    Remove-Item -Recurse -Force -Path "node_modules"
    
    # Drop symlink but NOT actual directories
    if (Test-Path "../../node_modules/@haxtheweb/$p") {
        Remove-Item -Force -Path "../../node_modules/@haxtheweb/$p"
    }
    
    # Create the symlink if the directory doesn't exist
    New-Item -ItemType Directory -Force -Path "../../node_modules/@haxtheweb/$p"

    if (Test-Path "$p.js") {
        New-Item -ItemType SymbolicLink -Name "$p.js" -Target "../../../elements/$p/$p.js" -Force -Path "../../node_modules/@haxtheweb/$p"
    }

    if (Test-Path "package.json") {
        New-Item -ItemType SymbolicLink -Name "package.json" -Target "../../../elements/$p/package.json" -Force -Path "../../node_modules/@haxtheweb/$p"
    }

    if (Test-Path "lib") {
        New-Item -ItemType SymbolicLink -Name "lib" -Target "../../../elements/$p/lib" -Force -Path "../../node_modules/@haxtheweb/$p"
    }

    if (Test-Path "locales") {
        New-Item -ItemType SymbolicLink -Name "locales" -Target "../../../elements/$p/locales" -Force -Path "../../node_modules/@haxtheweb/$p"
    }

    if (Test-Path "server") {
        New-Item -ItemType SymbolicLink -Name "server" -Target "../../../elements/$p/server" -Force -Path "../../node_modules/@haxtheweb/$p"
    }

    if (Test-Path "build") {
        New-Item -ItemType SymbolicLink -Name "build" -Target "../../../elements/$p/build" -Force -Path "../../node_modules/@haxtheweb/$p"
    }

    if (Test-Path "dist") {
        New-Item -ItemType SymbolicLink -Name "dist" -Target "../../../elements/$p/dist" -Force -Path "../../node_modules/@haxtheweb/$p"
    }

    # Check for nested directories and remove them
    if (Test-Path "lib/lib") {
        Write-Host "Found nested lib/lib in $p, deleting..."
        Remove-Item -Force -Path "lib/lib"
    }

    if (Test-Path "locales/locales") {
        Write-Host "Found nested locales/locales in $p, deleting..."
        Remove-Item -Force -Path "locales/locales"
    }

    Set-Location -Path $DIR
}

# Storybook test is bugged with default Invoke-Expression