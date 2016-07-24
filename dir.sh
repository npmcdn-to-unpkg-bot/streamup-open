  #!/bin/bash

  if [ ! -d /home/StreamUpBox ]; then
    sudo mkdir -m 777  -p /home/StreamUpBox;
    echo "Folder created with success!";
  else
    ##changing the folder owner for full permission
    sudo chown  $USER /home/StreamUpBox    
  fi;
