#!/bin/bash

# Đăng nhập root nếu cần
sudo -i

# Cập nhật hệ thống
sudo apt update

# Cài Docker
sudo apt install -y docker.io

# Thêm user vào nhóm docker (không cần sudo khi chạy docker)
sudo usermod -aG docker $USER

# Áp dụng thay đổi nhóm ngay lập tức
newgrp docker

# Cài đặt K3s Agent - Thay <IP_CUA_VM_MASTER> và <TOKEN_LAY_TU_MASTER> bằng giá trị thực tế
# Dưới đây là dòng đã được dùng thực tế
curl -sfL https://get.k3s.io | K3S_URL=https://192.168.182.130:6443 K3S_TOKEN=K10463588140eb9744f5d209811e9afaf35ae30780f504858c4d769de5261942389::server:29ecceaeae17645e77e8f2b06b190f0c sh -s -- agent

# Kiểm tra trạng thái dịch vụ k3s-agent
systemctl status k3s

# Ping thử máy master
ping 192.168.182.130

# Cài đặt client NFS
sudo apt install -y nfs-common

# Mount thử NFS để kiểm tra kết nối ổn
mount 192.168.182.130:/data/user-service /mnt
ls /mnt

# Cấu hình IP tĩnh nếu cần (chỉnh sửa bằng netplan)
vi /etc/netplan/50-cloud-init.yaml
netplan apply

# Đặt hostname (nếu có thay đổi)
vi /etc/hostname
reboot

# Tạo thư mục mount local để kiểm thử mount NFS
mkdir -p /data/user-service && sudo chmod 777 /data/user-service
ls /data/
