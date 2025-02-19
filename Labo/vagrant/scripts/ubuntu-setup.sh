#!/bin/bash

# Mise à jour du système
echo "Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# Installation de Docker
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing Docker..."
    sudo apt-get install docker.io -y
else
    echo "Docker is already installed."
fi

# Activation de Docker au démarrage
echo "Enabling Docker to start on boot..."
sudo systemctl enable docker

# Configuration d'IPs statiques sur l'interface réseau enp0s8
echo "Configuring static IPs on enp0s8..."
sudo ip address add 10.10.2.100/24 dev enp0s8
sudo ip address add 10.10.2.101/24 dev enp0s8
sudo ip address add 10.10.2.102/24 dev enp0s8

# Construction de l'image Docker Nginx
NGINX_DIR="/vagrant/docker/nginx"
if [ -d "$NGINX_DIR" ]; then
    echo "Building custom Nginx Docker image..."
    cd "$NGINX_DIR" || exit 1
    sudo docker build -t mynginx .
else
    echo "Nginx directory not found at $NGINX_DIR. Exiting."
    exit 1
fi
sudo docker network create --driver bridge --subnet=10.10.2.0/24 --gateway=10.10.2.1 backend_network


# Lancement des containers Nginx avec des IPs spécifiques et le redémarrage automatique au boot de la vm
echo "Starting Nginx containers with specific IP addresses..."
sudo docker run --net backend_network --ip 10.10.2.100 --name mynginx1 -d mynginx --restart unless-stopped
sudo docker run --net backend_network --ip 10.10.2.101 --name mynginx2 -d mynginx --restart unless-stopped
sudo docker run --net backend_network --ip 10.10.2.102 --name mynginx3 -d mynginx --restart unless-stopped

# Installation de Python3, pip3, et Flask
echo "Installing Python3, pip3, and Flask..."
if ! command -v python3 &> /dev/null; then
    echo "Installing Python3..."
    sudo apt install python3 -y
fi

if ! command -v pip3 &> /dev/null; then
    echo "Installing pip3..."
    sudo apt install python3-pip -y
fi

if ! python3 -m pip show flask &> /dev/null; then
    echo "Installing Flask..."
    sudo pip3 install flask
fi

# Lancement de l'application Flask
FLASK_DIR="/vagrant/scripts/f5_configurator"
if [ -d "$FLASK_DIR" ]; then
    echo "Starting Flask application..."
    cd "$FLASK_DIR" || exit 1
    FLASK_APP=app.py FLASK_RUN_HOST=0.0.0.0 FLASK_RUN_PORT=5000 nohup flask run &> /dev/null &
else
    echo "Flask application directory not found at $FLASK_DIR. Exiting."
    exit 1
fi

# Résumé de la configuration
echo "Setup complete. Access your services at the following URLs:"
echo "- Nginx1: http://10.10.2.100"
echo "- Nginx2: http://10.10.2.101"
echo "- Nginx3: http://10.10.2.102"
echo "- Flask App: http://192.168.10.10:5000"
