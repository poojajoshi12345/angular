#!/bin/ksh
#Empty First Version
#intl_ibi_html \
# /home/cvs/webfocus/CVSROOT/admin_scripts/native2ascii.sh %r/%p %s

# Format strings present in the filter will be replaced as follows:
#    %c = canonical name of the command being executed
#    %R = the name of the referrer, if any, otherwise the value NONE
#    %p = path relative to repository
#    %r = repository (path portion of $CVSROOT)
#    %{s} = file name, file name, ...


Repository_and_Path=$1
shift
while [[ "$1" != ""  ]]; do
   filename=$1
   shift
   
#Returns the directory path of the "files" variable
directoryname="${filename%/*}"

LastDirectoryName=${Repository_and_Path##*/}
#File_extension_with the current date
dynamic_file_name="myfile_$(date  '+%Y_%m_%d_%H' )"

   
   
   
   echo ${Repository_and_Path} ${filename}>> /tmp/intl_return.txt
   
   
done
set >>  /tmp/intl_return.txt
echo ==Entries======= >> /tmp/intl_return.txt
FIRSTLINE=$(head -1 CVS/Entries)
TAGNAME=${FIRSTLINE##*/?}
echo BRANCHNAME=$TAGNAME >> /tmp/intl_return.txt
echo ========= >> /tmp/intl_return.txt
stdin=$(cat)
echo -n 'stdin="'>> /tmp/intl_return.txt
echo -n $stdin >> /tmp/intl_return.txt
echo  '"' >> /tmp/intl_return.txt