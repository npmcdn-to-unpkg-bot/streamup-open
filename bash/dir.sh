  #!/bin/bash

  if [ ! -d /home/$USER/Desktop/ME ]; then
    mkdir -p /home/$USER/Desktop/ME;
    echo "folder created with success";
  fi;
