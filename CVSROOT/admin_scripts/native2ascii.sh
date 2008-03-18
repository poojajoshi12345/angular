#!/bin/ksh
#
# This script generated a script file that is read by a cron job.
# The purpose of the cron job is to run native 2 ascii on all
# the files it is passed.
# 
# Written by Peter Lenahan and Toshi Kojima 3/18/2008
#
# 
# /home/cvs/webfocus/CVSROOT/admin_scripts/native2ascii.sh %r/%p %s

# Format strings present in the filter will be replaced as follows:
#    %c = canonical name of the command being executed
#    %R = the name of the referrer, if any, otherwise the value NONE
#    %p = path relative to repository
#    %r = repository (path portion of $CVSROOT)
#    %{s} = file name, file name, ...

#
# Output from this file goes into a dynamically generated filename 
# in the directory below.
#
dynamic_file_name="$(date  '+%Y_%m_%d_%H')_$$"
OUTPUT=/home/cvs/cron_files/intl/data/${dynamic_file_name}
TEMP=/tmp/${dynamic_file_name}
# Get the Branch name that we are returning files to.

FIRSTLINE=$(head -1 CVS/Entries)
TAGNAME=${FIRSTLINE##*/?}
echo BRANCHNAME=$TAGNAME >> $TEMP



Repository_and_Path=$1
shift
inputdir=${Repository_and_Path##*webfocus/intl_}
LastDirectoryName=${Repository_and_Path##*/}
outputdir=${Repository_and_Path##*webfocus/}



echo Repository_and_Path=$Repository_and_Path >> $TEMP
echo LastDirectoryName=$LastDirectoryName >> $TEMP
echo checkoutdir="${outputdir}" >> $TEMP
echo checkinpdir="${inputdir}" >> $TEMP

#
# Multiple files may be in a single return, so collect their names.
#
while [[ "$1" != ""  ]]; do
   filename=$1
   shift
   checkoutfiles="${checkoutfiles} ${outputdir}/${filename} "
   checkinfiles="${checkinfiles} ${inputdir}/${filename} "
done

echo -n 'checkoutfiles="'>> $TEMP
echo -n $checkoutfiles >> $TEMP
echo '"' >> $TEMP

echo -n 'checkinfiles="' >> $TEMP
echo -n $checkinfiles >> $TEMP
echo '"' >> $TEMP
chmod +x $TEMP
cp -p $TEMP $OUTPUT
rm $TEMP
