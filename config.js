#I didn't create this out of fun. In fact I hate the premisis I had the create this at all to mask my utter stupidity/lack of undertstanding with LXC containers. 
  #!/bin/bash

set -e

# Update and install prerequisites
apt update && apt upgrade -y
apt install -y curl wget sudo nano build-essential

# Install nvm (Node Version Manager)
echo "Installing nvm..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Source nvm into the current shell session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and use Node.js v22
echo "Installing Node.js v22..."
nvm install 22
nvm alias default 22
nvm use 22

# Verify installation
node -v
npm -v

# Install Node-RED
echo "Installing Node-RED..."
npm install -g --unsafe-perm node-red

# Create a service for Node-RED
echo "Creating Node-RED service..."
cat <<EOF | sudo tee /etc/systemd/system/node-red.service
[Unit]
Description=Node-RED
After=network.target

[Service]
Environment="PATH=$HOME/.nvm/versions/node/v22.11.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=$HOME/.nvm/versions/node/v22.11.0/bin/node-red
WorkingDirectory=$HOME
User=$USER
Group=$USER
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable Node-RED service
sudo systemctl daemon-reload
sudo systemctl enable node-red.service
sudo systemctl start node-red.service

echo "Node-RED installation complete. Visit http://<your-ip>:1880 to access the Node-RED editor."
