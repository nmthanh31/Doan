echo "📡 Cài đặt NFS Server trên Master..."
sudo apt update
sudo apt install -y nfs-kernel-server

sudo mkdir -p /data/user-service /data/order-service /data/product-service
sudo chown nobody:nogroup /data/*-service
sudo chmod 777 /data/*-service

cat <<EOF | sudo tee /etc/exports
/data/user-service *(rw,sync,no_subtree_check,no_root_squash)
/data/order-service *(rw,sync,no_subtree_check,no_root_squash)
/data/product-service *(rw,sync,no_subtree_check,no_root_squash)
EOF

sudo exportfs -a
sudo systemctl restart nfs-kernel-server