REM copies files from git to 82xx folder for cvs return
SET targetDir=C:\ibi\WebFOCUS82\ibx_82xx
SET sourceDir=%CD%\src\main\resources\META-INF\resources\ibx
xcopy %sourceDir%\resources\*.* %targetDir%\resources\*.* /s /e /y
