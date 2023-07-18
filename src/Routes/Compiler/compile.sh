#!/bin/bash

# Generate random filename
RANDOM_FILENAME=`cat /dev/urandom | tr -dc 'A-Za-z0-9' | fold -w 20 | head -n 1`
RANDOM_FILENAME=_$RANDOM_FILENAME
readonly RANDOM_FILENAME

# random filename for a C file
RANDOM_FILENAME_CPP=$RANDOM_FILENAME.cpp
readonly RANDOM_FILENAME
array="${@}"

echo "${array[*]}" > $RANDOM_FILENAME_CPP

g++ $RANDOM_FILENAME_CPP -o $RANDOM_FILENAME

# run programm if no errors
if [ -f "$RANDOM_FILENAME" ];
    then
    ./$RANDOM_FILENAME
    else echo "CE"
fi
rm $RANDOM_FILENAME_CPP

if [ -f "$RANDOM_FILENAME" ];
    then
        rm $RANDOM_FILENAME
fi
