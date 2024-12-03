#!/usr/bin/env bash
source <(curl -s https://raw.githubusercontent.com/tteck/Proxmox/main/misc/build.func)
# Copyright (c) 2021-2024 tteck
# Author: tteck (tteckster)
# License: MIT
# https://github.com/tteck/Proxmox/raw/main/LICENSE

function header_info {
clear
cat <<"EOF"
    _   __          __        ____           __
   / | / /___  ____/ /__     / __ \___  ____/ /
  /  |/ / __ \/ __  / _ \   / /_/ / _ \/ __  / 
 / /|  / /_/ / /_/ /  __/  / _, _/  __/ /_/ /  
/_/ |_/\____/\__,_/\___/  /_/ |_|\___/\__,_/   
 
EOF
}
header_info
echo -e "Loading..."
APP="Node-Red"
var_disk="4"
var_cpu="1"
var_ram="1024"
var_os="debian"
var_version="12"
variables
color
catch_errors

function default_settings() {
  CT_TYPE="1"
  PW=""
  CT_ID=$NEXTID
  HN=$NSAPP
  DISK_SIZE="$var_disk"
  CORE_COUNT="$var_cpu"
  RAM_SIZE="$var_ram"
  BRG="vmbr0"
  NET="dhcp"
  GATE=""
  APT_CACHER=""
  APT_CACHER_IP=""
  DISABLEIP6="no"
  MTU=""
  SD=""
  NS=""
  MAC=""
  VLAN=""
  SSH="no"
  VERB="no"
  echo_default
}

function post_install() {
  echo "Installing nvm..."
  su - root -c "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash"
  su - root -c "source ~/.bashrc && nvm install 22 && nvm alias default 22 && nvm use 22"

  echo "Installing Node-RED..."
  su - root -c "source ~/.bashrc && npm install -g --unsafe-perm node-red"

  echo "Creating Node-RED service..."
  cat <<EOF | tee /etc/systemd/system/node-red.service
[Unit]
Description=Node-RED
After=network.target

[Service]
Environment="PATH=/root/.nvm/versions/node/v22.11.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=/root/.nvm/versions/node/v22.11.0/bin/node-red
WorkingDirectory=/root
User=root
Group=root
Restart=always

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable node-red
  systemctl start node-red

  echo "Node-RED installation complete. Visit http://${IP}:1880 to access the Node-RED editor."
}

start
build_container
description
post_install

msg_ok "Completed Successfully!\n"
echo -e "${APP} should be reachable by going to the following URL.
         ${BL}http://${IP}:1880${CL} \n"
