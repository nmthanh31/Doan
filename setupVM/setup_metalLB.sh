#!/bin/bash

MASTER_IP="192.168.162.130"
SSH_USER="nmthanh"
SSH_PASS="1234"
POOL_RANGE="192.168.162.240-192.168.162.250"

echo "📁 Sao chép kubeconfig và cấp quyền cho user..."

sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no $SSH_USER@$MASTER_IP << EOF
sudo mkdir -p /home/$SSH_USER/.kube
sudo cp /etc/rancher/k3s/k3s.yaml /home/$SSH_USER/.kube/config
sudo chown -R $SSH_USER:$SSH_USER /home/$SSH_USER/.kube
EOF

echo "📦 Cài MetalLB..."

sshpass -p "$SSH_PASS" ssh $SSH_USER@$MASTER_IP << EOF
export KUBECONFIG=\$HOME/.kube/config

kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.14.5/config/manifests/metallb-native.yaml
sleep 5

kubectl create secret generic -n metallb-system memberlist --from-literal=secretkey="\$(openssl rand -base64 128)"

cat <<EOT > metallb-config.yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: my-ip-pool
  namespace: metallb-system
spec:
  addresses:
    - $POOL_RANGE
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: l2adv
  namespace: metallb-system
EOT

kubectl apply -f metallb-config.yaml

echo "📊 Kiểm tra trạng thái MetalLB:"
kubectl get pods -n metallb-system
EOF