set wfpath=C:\ibi\WebFOCUS82\webapps\webfocus
rd /S /Q %wfpath%\ibx
MKLINK /D %wfpath%\ibx %CD%\src\main\resources\META-INF\resources\ibx
