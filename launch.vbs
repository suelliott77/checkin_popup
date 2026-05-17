Dim WshShell, AppDir
Set WshShell = CreateObject("WScript.Shell")
AppDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\") - 1)
WshShell.CurrentDirectory = AppDir
WshShell.Run """" & AppDir & "\node_modules\.bin\electron.cmd"" """ & AppDir & """", 0, False
Set WshShell = Nothing
