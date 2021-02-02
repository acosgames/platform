# Optional branch for 1st argument
# Last argument is always the commit message


echo "=========================================================="
echo ">>>> SUBMODULE INIT"
git submodule update --init --recursive --remote
echo "=========================================================="