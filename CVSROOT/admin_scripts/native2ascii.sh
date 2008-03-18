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
   echo ${Repository_and_Path} ${filename}>> /tmp/intl_return.txt
done
