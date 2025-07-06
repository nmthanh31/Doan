#!/bin/bash

# Cập nhật hệ thống
sudo apt update
sudo apt install -y docker.io unzip net-tools nfs-kernel-server

# Thêm user hiện tại vào nhóm docker
sudo usermod -aG docker $USER
newgrp docker

# Cài đặt K3s (server node) không dùng traefik
curl -sfL https://get.k3s.io | sh -s -- server --disable=traefik

# Kiểm tra trạng thái dịch vụ
systemctl status docker
systemctl status k3s

# Hiển thị node-token để các node khác join vào cluster
sudo cat /var/lib/rancher/k3s/server/node-token

# Cấu hình MetalLB
kubectl create namespace metallb-system
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.12/config/manifests/metallb-native.yaml

# Cấu hình MetalLB IP range thủ công
mkdir -p ~/k8s/metallb
cd ~/k8s/metallb/
cat <<EOF > metallb-config.yaml
# Tự điền IP range phù hợp nếu cần, hoặc giữ trống
EOF
kubectl apply -f metallb-config.yaml

# Tạo pod test
kubectl run nginx --image=nginx --port=80
kubectl expose pod nginx --port=80 --type=LoadBalancer

# Cài đặt & cấu hình NFS để dùng PersistentVolume
mkdir -p /data/user-service
mkdir -p /data/order-service
mkdir -p /data/product-service
chown nobody:nogroup /data/user-service /data/order-service /data/product-service
chmod 777 /data/user-service /data/order-service /data/product-service

echo "/data/user-service *(rw,sync,no_subtree_check,no_root_squash)" | sudo tee -a /etc/exports
echo "/data/order-service *(rw,sync,no_subtree_check,no_root_squash)" | sudo tee -a /etc/exports
echo "/data/product-service *(rw,sync,no_subtree_check,no_root_squash)" | sudo tee -a /etc/exports

exportfs -a
systemctl restart nfs-kernel-server

# Giải nén dữ liệu
cd /home/nmthanh/
unzip Data.zip
cd Data/
mv order_items.csv orders.csv /data/order-service/
mv products.csv static/ /data/product-service/
mv users.csv /data/user-service/

# Cấp quyền cho kubeconfig để CI sử dụng
cp /etc/rancher/k3s/k3s.yaml ~/kubeconfig-for-ci.yaml
cat ~/kubeconfig-for-ci.yaml | base64 -w 0

# Cho phép cổng API server của K3s nếu cần
ufw allow 6443/tcp
ufw reload

# Cài runner GitHub Actions
mkdir -p ~/actions-runner && cd ~/actions-runner
curl -o actions-runner-linux-x64-2.324.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.324.0/actions-runner-linux-x64-2.324.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.324.0.tar.gz
./config.sh --url https://github.com/nmthanh31/Doan --token A764P7ZHIURQCZRXUOUMONLIH2WY6

# Chạy runner
./run.sh

# (Tuỳ chọn) Cài ngrok để expose cổng 6443 nếu chạy CI/CD từ bên ngoài
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
ngrok config add-authtoken 2xzHOIeOf50AiVQDWFkRvu5K5DS_2fsqPjXQfwFSAy8iFcJdJ
ngrok tcp 6443
