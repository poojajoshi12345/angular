REM recreate ibx_testing worktree
git worktree remove %CD%\..\ibx_testing
rd /S /Q %CD%\..\ibx_testing
git worktree add %CD%\..\ibx_testing _testing

REM path to where webfocus is
set wfpath=C:\ibi\WebFOCUS82\webapps\webfocus

REM make the new ibx link
rd /S /Q %wfpath%\ibx
MKLINK /D %wfpath%\ibx %CD%\src\main\resources\META-INF\resources\ibx

REM make the new ibx_testing link
rd /S /Q %wfpath%\ibx_testing
MKLINK /D %wfpath%\ibx_testing %CD%\..\ibx_testing\src\test\resources\META-INF\resources\ibx\testing

REM make the new homepage link
rd /S /Q %wfpath%\ibxtools
MKLINK /D %wfpath%\homepage %CD%\..\ibxtools\webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\homepage

REM make the new ibxtools link
rd /S /Q %wfpath%\ibxtools
MKLINK /D %wfpath%\ibxtools %CD%\..\ibxtools\webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\ibxtools
