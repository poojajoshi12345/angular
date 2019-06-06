REM copies files from git to 82xx folder for cvs return
SET targetDir=C:\ibi\WebFOCUS82\ibx_82xx
SET sourceDir=%CD%\src\main\resources\META-INF\resources\ibx
copy %sourceDir%\resources\js\*.js %targetDir%\resources\js\
copy %sourceDir%\resources\css\*.css %targetDir%\resources\css\
