#!/bin/bash

MASTER_IP="192.168.182.130"
WORKER1_IP="192.168.182.131"
WORKER2_IP="192.168.182.132"
SSH_USER="nmthanh"
SSH_PASS="1234"

# Script cài Docker
DOCKER_INSTALL=$(cat << 'EOF'
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
EOF
)

# Cài Docker trên tất cả node
for IP in $MASTER_IP $WORKER1_IP $WORKER2_IP; do
    echo "🔧 Cài Docker trên $IP..."
    sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$IP "$DOCKER_INSTALL"
done

# Cài K3s Master
echo "🚀 Cài K3s Master..."
sshpass -p "$SSH_PASS" ssh $SSH_USER@$MASTER_IP "curl -sfL https://get.k3s.io | sh -s - --disable=traefik --write-kubeconfig-mode 644"

# Copy kubeconfig về đúng vị trí cho user
sshpass -p "$SSH_PASS" ssh $SSH_USER@$MASTER_IP "mkdir -p ~/.kube && sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config && sudo chown $SSH_USER:$SSH_USER ~/.kube/config"

# Lấy token từ Master
NODE_TOKEN=$(sshpass -p "$SSH_PASS" ssh $SSH_USER@$MASTER_IP "sudo cat /var/lib/rancher/k3s/server/node-token" | tr -d '\r')

# Cài Worker node
for IP in $WORKER1_IP $WORKER2_IP; do
    echo "🔧 Cài Worker tại $IP..."
    sshpass -p "$SSH_PASS" ssh $SSH_USER@$IP "curl -sfL https://get.k3s.io | K3S_URL=https://$MASTER_IP:6443 K3S_TOKEN=$NODE_TOKEN sh -"
done

# Kiểm tra cụm
sshpass -p "$SSH_PASS" ssh $SSH_USER@$MASTER_IP "kubectl get nodes"