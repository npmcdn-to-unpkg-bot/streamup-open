  #!/bin/bash

  if [ ! -d /home/bright ]; then
    mkdir -m 777  -p /home/bright;
    echo "folder created with success!";
  else
    echo "Folder already exists";
  fi;
  # mkdir -m 777 /home/Desktop/new