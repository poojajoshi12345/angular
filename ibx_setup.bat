REM get git to checkout the _testing branch into the _testing directory
git worktree remove -f ../ibx_testing
md ../ibx_testing
git worktree add ../ibx_testing _testing

REM creates symbolic links to main ibx directory and testing
call ibx_link.bat

REM remap _testing testing directory to the install testing directory
set wfpath=C:\ibi\WebFOCUS82\webapps\webfocus
rd /S /Q %wfpath%\ibx\testing
MKLINK /D %wfpath%\ibx\testing %CD%\..\ibx_testing\src\test\resources\META-INF\resources\ibx\testing
