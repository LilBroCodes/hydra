$toolsDir   = "$(Split-Path -Parent $MyInvocation.MyCommand.Definition)"
$exePath    = Join-Path $toolsDir 'hydra-win.exe'

Install-ChocolateyShortcut -ShortcutFilePath "$env:ProgramData\Microsoft\Windows\Start Menu\Programs\Hydra.lnk" -TargetPath "$exePath"
Install-BinFile -Name hydra -Path $exePath
