#!/bin/sh

#echo Stopping LogMeIn Hamachi service

#unload daemon
/usr/bin/sudo -u `logname` /bin/launchctl unload /Library/LaunchAgents/com.logmein.hamachimb.plist
sleep 4
/bin/launchctl unload /Library/LaunchDaemons/com.logmein.hamachi.plist

#echo Removing application files

#driver files 
# for safety we delete /Library/Extensions/hamns.kext also
rm -rf /Library/Extensions/ham.kext
rm -rf /Library/Extensions/hamns.kext
rm -rf /System/Library/Extensions/ham.kext

#launch files
rm -f  /Library/LaunchDaemons/com.logmein.hamachi.plist
