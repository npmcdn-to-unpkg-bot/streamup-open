  #!/bin/bash

  if [ ! -d /home/br ]; then
    mkdir -p /home/br;
    echo "folder created with success";
    else
    echo "folder already exists!";
  fi;
