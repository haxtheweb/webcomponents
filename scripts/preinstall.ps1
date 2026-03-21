# Where am I? Move to where I am. This ensures source is properly sourced
$DIR = Get-Location
Set-Location -Path $DIR

# Go back a level so we can snag everything
Set-Location -Path "../elements/"

# Walk each directory and blow away node_modules in case we installed incorrectly
Get-ChildItem -Directory | ForEach-Object {
    Set-Location -Path $_.FullName
    Remove-Item -Recurse -Force -Path "node_modules"
    Set-Location -Path $DIR
}