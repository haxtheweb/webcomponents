#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
filename=${DIR}/${1}/iconlist.txt
regex="(.*?\.svg)"
echo $filename

while read line; do
# reading each line
echo "$line"
if [[ $line =~ $regex ]]
  then
    svg=${BASH_REMATCH[1]}
    content="<svg style=\"width:24px;height:24px\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">${line/${svg}/}"
    touch ${DIR}/${1}/${svg}
    echo "${content}" > ${DIR}/${1}/${svg}
  else
    echo "no match"
  fi
done < $filename