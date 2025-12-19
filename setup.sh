#!/bin/bash
cd /var/www/news-verifier
git fetch origin
git reset --hard origin/main
git pull origin main

pkill -9 node
cd frontend
rm -rf dist/
npm install
npm run build
cd ../backend

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
nohup uvicorn app.main:app --host 127.0.0.1 --port 8001 &

cd /home/n8n/
docker compose up -d --build

echo "Setup complete!"