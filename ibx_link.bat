REM this creates hard links between the git repository and the WebFOCUS install location.
REM so you don't have to manually move files when developing.
set wfpath=C:\ibi\WebFOCUS82\webapps\webfocus

REM remove the old links
rd /S /Q %wfpath%\ibx
rd /S /Q %wfpath%\ibx_testing

REM make the new links
MKLINK /D %wfpath%\ibx %CD%\src\main\resources\META-INF\resources\ibx
MKLINK /D %wfpath%\ibx_testing %CD%\src\test\resources\META-INF\resources\ibx\testing
