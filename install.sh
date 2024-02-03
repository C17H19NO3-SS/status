#!/usr/bin/bash

if ! command -v bun &> /dev/null
then
    echo "bun komutu bulunamadı. indiriliyor..."
    curl -fsSL https://bun.sh/install | bash
fi

if (( $EUID != 0 )); then
    echo "Root olarak çalıştır."
    exit
fi

touch /etc/systemd/system/express.service
mkdir /home/pi/.status-viewer/
touch /home/pi/.status-viewer/index.js
touch /home/pi/.status-viewer/index.config.js
mkdir /home/pi/.status-viewer/views
touch /home/pi/.status-viewer/views/index.ejs
touch /home/pi/.status-viewer/views/scripts.ejs
touch /home/pi/.status-viewer/views/styles.ejs

echo "$(curl https://raw.githubusercontent.com/soulsnattcher/status/main/index.js)" > /home/pi/.status-viewer/index.js
echo "$(curl https://raw.githubusercontent.com/soulsnattcher/status/main/index.config.js)" > /home/pi/.status-viewer/index.config.js
echo "$(curl https://raw.githubusercontent.com/soulsnattcher/status/main/views/index.ejs)" > /home/pi/.status-viewer/views/index.ejs
echo "$(curl https://raw.githubusercontent.com/soulsnattcher/status/main/views/scripts.ejs)" > /home/pi/.status-viewer/views/scripts.ejs
echo "$(curl https://raw.githubusercontent.com/soulsnattcher/status/main/views/styles.ejs)" > /home/pi/.status-viewer/views/styles.ejs

chown pi -R /home/pi/.status-viewer/

echo "[Unit]
Description=express
After=network-online.target

[Service]
User=root
Group=root

ExecStart=/home/pi/.bun/bin/bun run /home/pi/.status-viewer/index.js

[Install]
WantedBy=multi-user.target" > /etc/systemd/system/express.service

systemctl daemon-reload
systemctl enable --now express

clear

echo "Kurulum bitti."
