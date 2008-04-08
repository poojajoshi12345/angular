#!/bin/ksh

# set -x

  DEBUG=OFF

if [[ $# != 1 || -z $1 ]]; then
  exit
fi

# Make work directory
WORKDIR=/tmp/native2ascii.$$
[[ -d $WORKDIR ]] && rm -rf 
mkdir $WORKDIR

#
# WORKDIR=~Toshifumi_Kojima/test       # TESTING ONLY !!

cd $WORKDIR

DATADIR=~cvs/cron_files/intl/data
repos=/home/cvs/webfocus

#for file_to_translate in $DATADIR/*
#do
   file_to_translate=$1

   if [[ "$DEBUG" = "ON" ]]; then
     echo "file_to_translate = ${file_to_translate}"
   fi

   # each one of the file contains a set of shell variables that we need to use.
   #
   # Sample file containing information about files to translate file looks like this.
   #
   #     BRANCHNAME=branch765
   #     Repository_and_Path=$repos/intl_ibi_html/javaassist/intl/JA
   #     LastDirectoryName=JA
   #     checkoutdir=intl_ibi_html/javaassist/intl/JA
   #     checkoutfiles=intl_ibi_html/javaassist/intl/JA/junk.txt
   #     checkinpdir=ibi_html/javaassist/intl/JA
   #     checkinfiles=ibi_html/javaassist/intl/JA/junk.txt
   #  
   #
   . $file_to_translate

   if [[ "$DEBUG" = "ON" ]]; then
     echo "  BRANCHNAME            = ${BRANCHNAME}"
     echo "    Repository_and_Path = ${Repository_and_Path}"
     echo "    LastDirectoryName   = ${LastDirectoryName}"
   fi

   # make tag option
   TAGOPT=""
   if [[ "$BRANCHNAME" != "" ]]; then
     TAGOPT="-r ${BRANCHNAME} "
   fi

   # Get java_label path script
   getjavalbl=java_label
   cvs -d $repos co ${TAGOPT} -p tools/$getjavalbl >$getjavalbl
   chmod +x $getjavalbl

   # Get jdk path script
   getjdkpath=javadir
   cvs -d $repos co ${TAGOPT} -p tools/$getjdkpath >$getjdkpath
   chmod +x $getjdkpath

   # Get jdk path
   JDKBIN=$($WORKDIR/$getjdkpath -javahome)/bin
   if [[ "$JDKBIN" = "" ]]; then
      JDKBIN=/usr/java/jdk1.6.0_04/bin
   fi

   # Get encoding value script
   getencval=java_nls_getencodevalue
   cvs -d $repos co ${TAGOPT} -p tools/$getencval >$getencval
   chmod +x $getencval

   # Get encoding value
   encval=$($WORKDIR/$getencval ${LastDirectoryName})

   # Get last directoryname
   dynamic_dir_name=${file_to_translate##*/}
   temp_checkout=${WORKDIR}/${dynamic_dir_name}_checkout
   temp_checkin=${WORKDIR}/${dynamic_dir_name}_checkin

   if [[ "$DEBUG" = "ON" ]]; then
     echo "      dynamic_dir_name = ${dynamic_dir_name} "
     echo "         checkinpdir   = ${checkinpdir} "
     echo "         checkoutdir   = ${checkoutdir} "
     echo "         encoding      = ${encval}"
   fi

   mkdir -p  ${temp_checkout}/${checkoutdir} ${temp_checkin}/${checkinpdir}
   chmod 777  $temp_checkout $temp_checkin

   if [[ "$LastDirectoryName" != "EN" && ${#LastDirectoryName} = 2 ]]; then
     for fullfname in $checkinfiles; do
       file_prefix=$(expr substr ${fullfname##*/} 1 2)

       if [[ "$DEBUG" = "ON" ]]; then
         echo "  "
         echo "     fullfname         = intl_${fullfname}"
         echo "     file_prefix       = ${file_prefix}"
       fi

       if [[ "$file_prefix" = "$LastDirectoryName" ]]; then
         cd ${temp_checkin}
         rls=$(cvs -d $repos rls -e ${TAGOPT} ${fullname})
         if [[ -n $rls ]]; then  # rls say's its visible in the track
           cvs -d $repos co ${TAGOPT} ${fullfname}
         else                    # not visible
           mkdir -p ${fullname%/*}
           >${fullname}
           cvs -d $repos add ${fullname}
         fi

         cd ${temp_checkout}
         cvs -d $repos co ${TAGOPT} intl_${fullfname}

         filetype=${fullfname##*.}
         if   [[ "$filetype" = "js" || "$filetype" = "txt" ]]; then
           if   [[ "$filetype" = "js" ]]; then
             ${JDKBIN}/native2ascii -encoding ${encval} intl_${fullfname} \
                ${temp_checkin}/${fullfname}

             if [[ "$DEBUG" = "ON" ]]; then
               echo "The result of js! ----"
               cat  ${temp_checkin}/${fullfname}
               echo "----------------------"
             fi
           elif [[ "$filetype" = "txt" ]]; then
             ${JDKBIN}/native2ascii -encoding ${encval} intl_${fullfname} \
                intl_${fullfname}.wrk
             ${JDKBIN}/native2ascii -encoding UTF8 -reverse intl_${fullfname}.wrk \
                ${temp_checkin}/${fullfname}

             if [[ "$DEBUG" = "ON" ]]; then
               echo "The result of txt ----"
               cat  ${temp_checkin}/${fullfname}
               echo "----------------------"
             fi
           fi

           #  commit
           cd ${temp_checkin}
           cvs -d $repos commit -m "Ran native2ascii on this file, see the file intl_${fullfname} \nfor the actual file to return" ${fullfname}  
#
#  for DEBUG ONLY
#          ksh
         fi
       fi
     done
   fi


   rm -rf ${temp_checkin} ${temp_checkout}
   rm ${file_to_translate}

   rm -rf ${WORKDIR}

   if [[ "$DEBUG" = "ON" ]]; then
     echo " "
   fi

#done
