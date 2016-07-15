  #!/bin/bash

  if [ ! -d /home/bright ]; then
    mkdir -m 777  -p /home/StreamUpBox;
    echo "folder created with success!";
  else
    echo "Folder already exists";
  fi;
  