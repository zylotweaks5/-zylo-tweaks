@echo off
setlocal
title ZYLO Link
net session >nul 2>&1 || (powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs" & exit /b)
powershell -NoProfile -ExecutionPolicy Bypass -Command "$t=[IO.File]::ReadAllText('%~f0');iex ($t.Substring($t.IndexOf('#PS'+'-START')+9))"
exit /b
#PS-START
# ZYLO Link - lets the ZYLO dashboard apply a fixed list of tweaks to THIS PC.
# Listens on 127.0.0.1 only, needs the pairing code below, and can only run the tweaks listed in $T. Read it all before you run it.
$ErrorActionPreference='Continue'
$Port=47831
$Allowed='https://zylotweaks5.github.io'
$chars='ABCDEFGHJKMNPQRSTUVWXYZ23456789'
$rng=[Security.Cryptography.RandomNumberGenerator]::Create();$by=New-Object byte[] 6;$rng.GetBytes($by)
$Code=-join ($by|ForEach-Object{$chars[$_ % $chars.Length]})
$B="$env:USERPROFILE\Desktop\ZYLO\Backup";New-Item -ItemType Directory -Force $B|Out-Null
$INI="$env:LOCALAPPDATA\FortniteGame\Saved\Config\WindowsClient\GameUserSettings.ini"
$LY='HKCU:\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers'
$GP='HKCU:\Software\Microsoft\DirectX\UserGpuPreferences'
$GB='HKCU:\Software\Microsoft\GameBar'
$FS='/Script/FortniteGame.FortGameUserSettings'
reg export 'HKCU\Software\Microsoft\GameBar' "$B\gamebar.reg" /y 2>$null|Out-Null
reg export 'HKCU\System\GameConfigStore' "$B\gameconfig.reg" /y 2>$null|Out-Null
reg export 'HKCU\Software\Microsoft\DirectX\UserGpuPreferences' "$B\gpu.reg" /y 2>$null|Out-Null
reg export 'HKCU\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers' "$B\layers.reg" /y 2>$null|Out-Null

function Running{[bool](Get-Process FortniteClient-Win64-Shipping -ErrorAction SilentlyContinue)}
function Get-FN{
 $m='C:\ProgramData\Epic\EpicGamesLauncher\Data\Manifests'
 if(Test-Path $m){foreach($f in Get-ChildItem "$m\*.item"){try{$j=Get-Content $f.FullName -Raw|ConvertFrom-Json;if($j.DisplayName -eq 'Fortnite'){$p=Join-Path $j.InstallLocation 'FortniteGame\Binaries\Win64\FortniteClient-Win64-Shipping.exe';if(Test-Path $p){return $p}}}catch{}}}
 $d='C:\Program Files\Epic Games\Fortnite\FortniteGame\Binaries\Win64\FortniteClient-Win64-Shipping.exe'
 if(Test-Path $d){return $d};return $null}
function NeedFN{$p=Get-FN;if(!$p){throw 'Fortnite install not found'};$p}
function RegSet($k,$n,$v,$t='DWord'){if(!(Test-Path $k)){New-Item -Path $k -Force|Out-Null};New-ItemProperty -Path $k -Name $n -Value $v -PropertyType $t -Force|Out-Null}
function RegDel($k,$n){if(Test-Path $k){Remove-ItemProperty -Path $k -Name $n -ErrorAction SilentlyContinue}}
function Layers($p,$flag,$on){
 $cur=$null;if(Test-Path $LY){$cur=(Get-ItemProperty -Path $LY -Name $p -ErrorAction SilentlyContinue).$p}
 $set=@();if($cur){$set=@(($cur -replace '^~\s*','') -split '\s+'|Where-Object{$_ -and $_ -ne $flag})}
 if($on){$set+=$flag}
 if($set.Count){RegSet $LY $p ('~ '+($set -join ' ')) 'String'}else{RegDel $LY $p}}
function IniSet($sec,$key,$val){
 if(!(Test-Path $INI)){throw 'Fortnite settings file not found. Launch Fortnite once first.'}
 if(Running){throw 'Close Fortnite first'}
 $bk="$B\GameUserSettings.ini.bak";if(!(Test-Path $bk)){Copy-Item $INI $bk}
 $ro=(Get-Item $INI).IsReadOnly;if($ro){(Get-Item $INI).IsReadOnly=$false}
 $out=New-Object System.Collections.Generic.List[string];$in=$false;$done=$false;$found=$false
 foreach($l in @(Get-Content $INI)){
  if($l -match '^\['){if($in -and -not $done){$out.Add("$key=$val");$done=$true};$in=($l -eq "[$sec]");if($in){$found=$true}}
  elseif($in -and $l -match ('^'+[regex]::Escape($key)+'=')){$out.Add("$key=$val");$done=$true;continue}
  $out.Add($l)}
 if($in -and -not $done){$out.Add("$key=$val");$done=$true}
 if(-not $found){$out.Add("[$sec]");$out.Add("$key=$val")}
 Set-Content -Path $INI -Value $out -Encoding UTF8
 if($ro){(Get-Item $INI).IsReadOnly=$true}}
function IniRestore{$bk="$B\GameUserSettings.ini.bak";if(!(Test-Path $bk)){throw 'No backup found yet'};if(Running){throw 'Close Fortnite first'};Copy-Item $bk $INI -Force}

$T=@{
 gm=@{a={RegSet $GB AutoGameModeEnabled 1;RegSet $GB AllowAutoGameMode 1};r={RegSet $GB AutoGameModeEnabled 1}}
 dvr=@{a={RegSet 'HKCU:\System\GameConfigStore' GameDVR_Enabled 0;RegSet 'HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR' AppCaptureEnabled 0};r={RegSet 'HKCU:\System\GameConfigStore' GameDVR_Enabled 1;RegSet 'HKCU:\Software\Microsoft\Windows\CurrentVersion\GameDVR' AppCaptureEnabled 1}}
 pw=@{a={powercfg /setactive SCHEME_MIN|Out-Null;if($LASTEXITCODE){throw 'powercfg failed'}};r={powercfg /setactive SCHEME_BALANCED|Out-Null;if($LASTEXITCODE){throw 'powercfg failed'}}}
 gpu=@{a={$p=NeedFN;RegSet $GP $p 'GpuPreference=2;' 'String'};r={$p=NeedFN;RegDel $GP $p}}
 fso=@{a={$p=NeedFN;Layers $p 'DISABLEDXMAXIMIZEDWINDOWEDMODE' $true};r={$p=NeedFN;Layers $p 'DISABLEDXMAXIMIZEDWINDOWEDMODE' $false}}
 dpi=@{a={$p=NeedFN;Layers $p 'HIGHDPIAWARE' $true};r={$p=NeedFN;Layers $p 'HIGHDPIAWARE' $false}}
 dns=@{a={ipconfig /flushdns|Out-Null;if($LASTEXITCODE){throw 'ipconfig failed'}};r={}}
 tmp=@{a={Remove-Item "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue};r={}}
 fdns=@{a={foreach($ad in @(Get-NetAdapter -Physical|Where-Object Status -eq 'Up')){Set-DnsClientServerAddress -InterfaceIndex $ad.ifIndex -ServerAddresses '1.1.1.1','1.0.0.1'}};r={foreach($ad in @(Get-NetAdapter -Physical|Where-Object Status -eq 'Up')){Set-DnsClientServerAddress -InterfaceIndex $ad.ifIndex -ResetServerAddresses}}}
 qos=@{a={Remove-NetQosPolicy -Name 'ZYLO Fortnite' -Confirm:$false -ErrorAction SilentlyContinue;New-NetQosPolicy -Name 'ZYLO Fortnite' -AppPathNameMatchCondition 'FortniteClient-Win64-Shipping.exe' -DSCPAction 46|Out-Null};r={Remove-NetQosPolicy -Name 'ZYLO Fortnite' -Confirm:$false -ErrorAction SilentlyContinue}}
 gfx=@{a={foreach($k in 'sg.ViewDistanceQuality','sg.ShadowQuality','sg.AntiAliasingQuality','sg.TextureQuality','sg.EffectsQuality','sg.PostProcessQuality','sg.FoliageQuality'){IniSet 'ScalabilityGroups' $k 0}};r={IniRestore}}
 fps=@{a={IniSet $FS 'FrameRateLimit' '0.000000'};r={IniRestore}}
}
function Run($id,$act){
 $ErrorActionPreference='Stop'
 try{$sb=$T[$id][$act];$null=& $sb;Write-Host "  $act $id : OK" -ForegroundColor Green;@{ok=$true;msg='OK'}}
 catch{Write-Host "  $act $id : FAILED - $($_.Exception.Message)" -ForegroundColor Red;@{ok=$false;msg=$_.Exception.Message}}}
function Status{
 $cpu=Get-CimInstance Win32_Processor|Select-Object -First 1
 $cs=Get-CimInstance Win32_ComputerSystem
 $gpu=@(Get-CimInstance Win32_VideoController|ForEach-Object{$_.Name})
 $fn=Get-FN
 @{link=$true;os=(Get-CimInstance Win32_OperatingSystem).Caption;cpu=$cpu.Name.Trim();threads=$cpu.NumberOfLogicalProcessors;ramGB=[math]::Round($cs.TotalPhysicalMemory/1GB,1);gpu=$gpu;fortnite=[bool]$fn;running=(Running);settings=(Test-Path $INI)}}
function Send($rs,$code,$obj){$rs.StatusCode=$code;$rs.ContentType='application/json';$b=[Text.Encoding]::UTF8.GetBytes(($obj|ConvertTo-Json -Compress -Depth 4));$rs.OutputStream.Write($b,0,$b.Length);$rs.Close()}

$h=New-Object System.Net.HttpListener
$h.Prefixes.Add("http://127.0.0.1:$Port/")
try{$h.Start()}catch{Write-Host "Could not start on port $Port. Is ZYLO Link already open?" -ForegroundColor Red;Read-Host 'Press Enter to close';exit}
Clear-Host
Write-Host ''
Write-Host '  ZYLO LINK is running' -ForegroundColor Cyan
Write-Host '  Enter this code in the ZYLO dashboard:' 
Write-Host "      $Code" -ForegroundColor Green
Write-Host ''
Write-Host '  Only your own browser on this PC can reach this window.'
Write-Host '  Close this window any time to disconnect.'
Write-Host '  Backups are saved to Desktop\ZYLO\Backup'
Write-Host ''
$bad=0
while($h.IsListening){
 $c=$h.GetContext();$rq=$c.Request;$rs=$c.Response
 try{
  $o=$rq.Headers['Origin']
  if($o -and $o -ne $Allowed){Send $rs 403 @{ok=$false;msg='Origin not allowed'};continue}
  if($o){$rs.Headers.Set('Access-Control-Allow-Origin',$o)}
  $rs.Headers.Set('Vary','Origin')
  $rs.Headers.Set('Access-Control-Allow-Headers','Content-Type, X-Zylo-Code')
  $rs.Headers.Set('Access-Control-Allow-Methods','GET, POST, OPTIONS')
  $rs.Headers.Set('Access-Control-Allow-Private-Network','true')
  if($rq.HttpMethod -eq 'OPTIONS'){$rs.StatusCode=204;$rs.Close();continue}
  if($bad -ge 10){Send $rs 429 @{ok=$false;msg='Locked. Restart ZYLO Link.'};continue}
  if($rq.Headers['X-Zylo-Code'] -ne $Code){$bad++;Write-Host '  Rejected a request with the wrong code' -ForegroundColor Yellow;Send $rs 401 @{ok=$false;msg='Wrong code'};continue}
  $bad=0
  $path=$rq.Url.AbsolutePath
  if($path -eq '/status' -and $rq.HttpMethod -eq 'GET'){Write-Host '  Dashboard connected';Send $rs 200 (Status)}
  elseif($path -eq '/tweak' -and $rq.HttpMethod -eq 'POST'){
   if($rq.ContentLength64 -gt 2000){Send $rs 413 @{ok=$false;msg='Too large'};continue}
   $body=(New-Object IO.StreamReader($rq.InputStream)).ReadToEnd()|ConvertFrom-Json
   $id=[string]$body.id;$act=[string]$body.action
   if(!$T.ContainsKey($id) -or ($act -ne 'apply' -and $act -ne 'restore')){Send $rs 400 @{ok=$false;msg='Unknown tweak'};continue}
   Send $rs 200 (Run $id $act)}
  elseif($path -eq '/launch' -and $rq.HttpMethod -eq 'POST'){
   try{Start-Process 'com.epicgames.launcher://apps/fn%3A4fe75bbc5a674f4f9b356b5c90567da5%3AFortnite?action=launch&silent=true';Write-Host '  Launching Fortnite via Epic';Send $rs 200 @{ok=$true;msg='Launching'}}
   catch{Send $rs 200 @{ok=$false;msg='Could not start the Epic launcher'}}}
  else{Send $rs 404 @{ok=$false;msg='Not found'}}
 }catch{try{Send $rs 500 @{ok=$false;msg='Server error'}}catch{}}
}
