# Stripe CLI Installation Script for Windows
Write-Host "Installing Stripe CLI for Windows..." -ForegroundColor Green

# Create temp directory
$tempDir = "$env:TEMP\stripe-cli-install"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

try {
    # Get latest release
    Write-Host "Fetching latest Stripe CLI release..." -ForegroundColor Blue
    $releases = Invoke-RestMethod -Uri "https://api.github.com/repos/stripe/stripe-cli/releases/latest"
    $latestVersion = $releases.tag_name
    
    # Find Windows download
    $windowsAsset = $releases.assets | Where-Object { $_.name -like "*windows*x86_64*" }
    
    if (-not $windowsAsset) {
        throw "Windows x86_64 release not found"
    }
    
    $downloadUrl = $windowsAsset.browser_download_url
    $fileName = $windowsAsset.name
    
    Write-Host "Downloading Stripe CLI v$latestVersion..." -ForegroundColor Blue
    
    # Download file
    $zipPath = "$tempDir\$fileName"
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
    
    Write-Host "Extracting files..." -ForegroundColor Blue
    
    # Extract zip
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $tempDir)
    
    # Find executable
    $extractedDir = Get-ChildItem -Path $tempDir -Directory | Select-Object -First 1
    $stripeExe = Get-ChildItem -Path $extractedDir.FullName -Name "stripe.exe" -Recurse | Select-Object -First 1
    
    if (-not $stripeExe) {
        throw "stripe.exe not found"
    }
    
    $stripeExePath = Join-Path $extractedDir.FullName $stripeExe
    
    # Create bin directory
    $binDir = "$env:USERPROFILE\bin"
    if (-not (Test-Path $binDir)) {
        New-Item -ItemType Directory -Path $binDir | Out-Null
    }
    
    # Copy executable
    $destinationPath = "$binDir\stripe.exe"
    Copy-Item -Path $stripeExePath -Destination $destinationPath -Force
    
    Write-Host "Stripe CLI installed successfully!" -ForegroundColor Green
    Write-Host "Location: $destinationPath" -ForegroundColor Gray
    
    # Check PATH
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$binDir*") {
        Write-Host "Adding $binDir to your PATH..." -ForegroundColor Yellow
        [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$binDir", "User")
        Write-Host "PATH updated! Restart your terminal." -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Installation complete!" -ForegroundColor Green
    Write-Host "Next steps:" -ForegroundColor Blue
    Write-Host "1. Restart your terminal" -ForegroundColor White
    Write-Host "2. Run: stripe login" -ForegroundColor White
    Write-Host "3. Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe" -ForegroundColor White
    
} catch {
    Write-Host "Installation failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Manual installation:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/stripe/stripe-cli/releases" -ForegroundColor White
    Write-Host "2. Download Windows x86_64 release" -ForegroundColor White
    Write-Host "3. Extract and add to PATH" -ForegroundColor White
} finally {
    # Cleanup
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force
    }
}
