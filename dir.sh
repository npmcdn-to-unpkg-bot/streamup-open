  #!/bin/bash

  if [ ! -d /home/Elysee ]; then
    mkdir -m 777  -p /home/Elysee;
    echo "folder created with success!";
  else
    echo "Folder already exists";
  fi;
  # mkdir -m 777 /home/Desktop/new