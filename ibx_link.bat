REM this creates hard links between the git repository and the WebFOCUS install location.
REM so you don't have to manually move files when developing.
set wfpath=C:\ibi\WebFOCUS82\webapps\webfocus
rd /S /Q %wfpath%\ibx
MKLINK /D %wfpath%\ibx %CD%\src\main\resources\META-INF\resources\ibx
MKLINK /D %wfpath%\ibx\testing %CD%\src\test\resources\META-INF\resources\ibx\testing
