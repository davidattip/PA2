#!/bin/bash

# Définir les variables
LOCAL_FRONTEND_PATH="/Users/davidvucong/PA2A_POST/PA2/frontend/"
LOCAL_BACKEND_PATH="/Users/davidvucong/PA2A_POST/PA2/backend/"
EXCLUDE_FILE="/Users/davidvucong/PA2A_POST/PA2/.rsync-exclude"
REMOTE_USER="debian"
REMOTE_HOST="92.222.216.216"
REMOTE_FRONTEND_PATH="/var/www/html/frontend/"
REMOTE_BACKEND_PATH="/var/www/html/backend/"
REMOTE_PASS="FcB5Tah6km5m"

# Fonction pour exécuter une commande à distance
execute_remote_command() {
    sshpass -p $REMOTE_PASS ssh -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST "source ~/.nvm/nvm.sh && $1"
}

# Synchroniser les fichiers frontend
rsync -avz --progress --delete --exclude-from=$EXCLUDE_FILE $LOCAL_FRONTEND_PATH $REMOTE_USER@$REMOTE_HOST:$REMOTE_FRONTEND_PATH

# Synchroniser les fichiers backend
rsync -avz --progress --delete --exclude-from=$EXCLUDE_FILE $LOCAL_BACKEND_PATH $REMOTE_USER@$REMOTE_HOST:$REMOTE_BACKEND_PATH

# Arrêter et supprimer les applications PM2
execute_remote_command "pm2 stop all && pm2 delete all"

# Installer les dépendances et redémarrer les applications
execute_remote_command "cd /var/www/html/backend && npm install && pm2 start npm --name backend -- run dev-prod"
execute_remote_command "cd /var/www/html/frontend && npm install && npm run build && pm2 start npm --name frontend -- run dev-prod"

