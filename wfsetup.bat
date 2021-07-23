REM path to where webfocus is
set wfpath=C:\ibi\WebFOCUS82\webapps\webfocus

REM make the new ibx link
rename %wfpath%\WEB-INF\lib\webfocus-webjars-ibx-*.jar webfocus-webjars-ibx-*.jar_
rd /S /Q %wfpath%\ibx
MKLINK /D %wfpath%\ibx %CD%\src\main\resources\META-INF\resources\ibx

REM recreate ibx_testing worktree
rd /S /Q %wfpath%\ibx_testing
git worktree remove %CD%\..\ibx_testing
rd /S /Q %CD%\..\ibx_testing
git worktree add %CD%\..\ibx_testing _testing

REM make the new ibx_testing link
REM rd /S /Q %wfpath%\ibx_testing
MKLINK /D %wfpath%\ibx_testing %CD%\..\ibx_testing\src\test\resources\META-INF\resources\ibx\testing

REM make the new homepage and ibxtools link
rename %wfpath%\WEB-INF\lib\webfocus-webjars-ibxtools-*.jar webfocus-webjars-ibxtools-*.jar_
git clone http://wfbucket.ibi.com:7990/scm/wp/webfocus-webjars-projects.git ..\ibxtools
rd /S /Q %wfpath%\homepage
MKLINK /D %wfpath%\homepage %CD%\..\ibxtools\webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\homepage
rd /S /Q %wfpath%\ibxtools
MKLINK /D %wfpath%\ibxtools %CD%\..\ibxtools\webfocus-webjars-ibxtools\src\main\resources\META-INF\resources\ibxtools

REM make the new tools, caster, and component links
rename %wfpath%\WEB-INF\lib\webfocus-webjars-tools*.jar webfocus-webjars-tools*.jar_
git clone http://wfbucket.ibi.com:7990/scm/wp/webfocus-webjars-tools.git ..\tools
rd /S /Q %wfpath%\tools
MKLINK /D %wfpath%\tools %CD%\..\tools\src\main\resources\META-INF\resources\tools
rd /S /Q %wfpath%\caster
MKLINK /D %wfpath%\caster %CD%\..\tools\src\main\resources\META-INF\resources\caster
rd /S /Q %wfpath%\component
MKLINK /D %wfpath%\component %CD%\..\tools\src\main\resources\META-INF\resources\component

REM REM make the new 3rd party resources link
rename %wfpath%\WEB-INF\lib\webfocus-webjars-3rdparty-resources-*.jar webfocus-webjars-3rdparty-resources-*.jar_
git clone http://wfbucket.ibi.com:7990/scm/wp/webfocus-webjars-3rdparty-resources.git ..\3rdparty_resources
rd /S /Q %wfpath%\3rdparty_resources
MKLINK /D %wfpath%\3rdparty_resources %CD%\..\3rdparty_resources\src\main\resources\META-INF\resources\3rdparty_resources

REM REM make the new Bindows
@REM rename %wfpath%\WEB-INF\lib\webfocus-webjars-bindows-*.jar webfocus-webjars-bindows-*.jar_
@REM git clone https://wfbucket.ibi.com:8443/scm/wp/webfocus-webjars-bindows.git ..\bindows
@REM rd /S /Q %wfpath%\bindows
@REM MKLINK /D %wfpath%\bindows %CD%\..\bindows\src\main\resources\META-INF\resources\bindows

REM make the new intl properties/strings resources link
rename %wfpath%\WEB-INF\lib\webfocus-intl-*.jar webfocus-intl-*.jar_
git clone http://wfbucket.ibi.com:7990/scm/wp/webfocus-intl.git ..\intl
mkdir %wfpath%\WEB-INF\classes\com\ibi
rd /S /Q %wfpath%\WEB-INF\classes\com\ibi\intl
MKLINK /D %wfpath%\WEB-INF\classes\com\ibi\intl %CD%\..\intl\src\main\resources\com\ibi\intl
