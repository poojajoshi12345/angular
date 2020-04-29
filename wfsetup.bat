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
git clone http://wfbucket.ibi.com:7990/scm/wp/webfocus-webjars-projects.git ..\ibxtools
rd /S /Q %wfpath%\homepage
MKLINK /D %wfpath%\homepage %CD%\..\ibxtools\webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\homepage
rd /S /Q %wfpath%\ibxtools
MKLINK /D %wfpath%\ibxtools %CD%\..\ibxtools\webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\ibxtools

REM make the new tools, caster, and component links
REM rename %wfpath%\WEB-INF\lib\webfocus-webjars-tools-HEAD-SNAPSHOT.jar webfocus-webjars-tools-HEAD-SNAPSHOT.jar_
REM git clone http://wfbucket.ibi.com:7990/scm/wp/webfocus-webjars-tools.git ..\tools
REM rd /S /Q %wfpath%\tools
REM MKLINK /D %wfpath%\tools %CD%\..\tools\src\main\resources\META-INF\resources\tools
REM rd /S /Q %wfpath%\caster
REM MKLINK /D %wfpath%\caster %CD%\..\tools\src\main\resources\META-INF\resources\caster
REM rd /S /Q %wfpath%\component
REM MKLINK /D %wfpath%\component %CD%\..\tools\src\main\resources\META-INF\resources\component


REM REM make the new 3rd party resources link
REM rename %wfpath%\WEB-INF\lib\webfocus-webjars-3rdparty-resources-HEAD-SNAPSHOT.jar webfocus-webjars-3rdparty-resources-HEAD-SNAPSHOT.jar_
REM git clone http://wfbucket.ibi.com:7990/scm/wp/webfocus-webjars-3rdparty-resources.git ..\3rdparty_resources
REM rd /S /Q %wfpath%\3rdparty_resources
REM MKLINK /D %wfpath%\3rdparty_resources %CD%\..\3rdparty_resources\src\main\resources\META-INF\resources\3rdparty_resources

REM make the new intl properties/strings resources link
rename %wfpath%\WEB-INF\lib\webfocus-intl-HEAD-SNAPSHOT.jar webfocus-intl-HEAD-SNAPSHOT.jar_
git clone http://wfbucket.ibi.com:7990/scm/wp/webfocus-intl.git ..\intl
mkdir %wfpath%\WEB-INF\classes\com\ibi
rd /S /Q %wfpath%\WEB-INF\classes\com\ibi\intl
MKLINK /D %wfpath%\WEB-INF\classes\com\ibi\intl %CD%\..\intl\src\main\resources\com\ibi\intl
