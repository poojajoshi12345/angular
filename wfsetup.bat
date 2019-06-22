REM recreate ibx_testing worktree
git worktree remove %CD%\..\ibx_testing
rd /S /Q %CD%\..\ibx_testing
git worktree add %CD%\..\ibx_testing _testing

REM path to where webfocus is
set wfpath=C:\ibi\WebFOCUS82\webapps\webfocus

REM make the new ibx link
rename %wfpath%\WEB-INF\lib\webfocus-webjars-ibx-HEAD-SNAPSHOT.jar webfocus-webjars-ibx-HEAD-SNAPSHOT.jar_
rd /S /Q %wfpath%\ibx
MKLINK /D %wfpath%\ibx %CD%\src\main\resources\META-INF\resources\ibx

REM make the new ibx_testing link
rd /S /Q %wfpath%\ibx_testing
MKLINK /D %wfpath%\ibx_testing %CD%\..\ibx_testing\src\test\resources\META-INF\resources\ibx\testing

REM make the new homepage and ibxtools link
rename %wfpath%\WEB-INF\lib\webfocus-webjars-ibxtools-HEAD-SNAPSHOT.jar webfocus-webjars-ibxtools-HEAD-SNAPSHOT.jar_
rd /S /Q %wfpath%\homepage
git clone http://wfbucket.ibi.com:7990/scm/wp/webfocus-webjars-projects.git ..\ibxtools
MKLINK /D %wfpath%\homepage %CD%\..\ibxtools\webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\homepage
rd /S /Q %wfpath%\ibxtools
MKLINK /D %wfpath%\ibxtools %CD%\..\ibxtools\webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\ibxtools

REM make the new 3rd party resources link
rename %wfpath%\WEB-INF\lib\webfocus-webjars-3rdparty-resources-HEAD-SNAPSHOT.jar webfocus-webjars-3rdparty-resources-HEAD-SNAPSHOT.jar_
rd /S /Q %wfpath%\3rdparty_resources
git clone http://wfbucket.ibi.com:7990/scm/wp/webfocus-webjars-3rdparty-resources.git ..\3rdparty_resources
MKLINK /D %wfpath%\3rdparty_resources %CD%\..\3rdparty_resources\src\main\resources\META-INF\resources\3rdparty_resources

REM copy un-minified jquery into install
copy /y %CD%\src\main\resources\META-INF\resources\ibx\resources\etc\jquery\jquery.js %wfpath%\3rdparty_resources\jquery\js\jquery-3.3.1.min.js
copy /y %CD%\src\main\resources\META-INF\resources\ibx\resources\etc\jquery\jquery-ui-1.12.1\jquery-ui.js %wfpath%\3rdparty_resources\jquery\js\jquery-ui-1.12.1.min.js

