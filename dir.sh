  #!/bin/bash

  if [ ! -d /home/StreamUpBox ]; then
    mkdir -m 777  -p /home/StreamUpBox;
    echo "Folder created with success!";
  else
    echo "Folder already exists";
  fi;
  