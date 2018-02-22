#!/bin/bash
PATH_FILE=./node_modules/react-native/local-cli/core/__fixtures__/files/package.json
# PATH_FILE=./node_modules/test.json
if [ -e $PATH_FILE ]
then
    rm $PATH_FILE 
else
    echo "FILE DOSE NOT EXIST"
fi