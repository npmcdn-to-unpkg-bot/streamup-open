  #!/bin/bash

  if [ ! -d /home/Desktop/Newfolder ]; then
    mkdir -p /home/Desktop/Newfolder;
    echo "folder created with success";
    else
    echo "folder already exists!";
  fi;
