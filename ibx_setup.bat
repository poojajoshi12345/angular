REM remove _testing worktree
git worktree remove %CD%\..\ibx_testing
rd /S /Q %CD%\..\ibx_testing

git worktree add %CD%\..\ibx_testing _testing

REM this creates hard links between the git repository and the WebFOCUS install location.
REM so you don't have to manually move files when developing.
set wfpath=C:\ibi\WebFOCUS82\webapps\webfocus

REM remove the old links
rd /S /Q %wfpath%\ibx
rd /S /Q %wfpath%\ibx_testing

REM make the new links
MKLINK /D %wfpath%\ibx %CD%\src\main\resources\META-INF\resources\ibx
MKLINK /D %wfpath%\ibx_testing %CD%\..\ibx_testing\src\test\resources\META-INF\resources\ibx\testing
