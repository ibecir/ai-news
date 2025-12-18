#!/bin/bash

cd /var/www/news-verifier

cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
deactivate
cd ..

cd frontend
npm install
echo "VITE_API_URL=/news/api/v1" > .env
npm run build
cd ..

echo "Setup complete!"