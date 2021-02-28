#!/bin/sh
# Optional branch for 1st argument
# Last argument is always the commit message


echo "=========================================================="
echo ">>>> SUBMODULE INIT"
git submodule update --recursive --remote --init
echo "=========================================================="
echo ">>>> SUBMODULE INIT"
git submodule foreach --recursive git checkout master
echo "=========================================================="