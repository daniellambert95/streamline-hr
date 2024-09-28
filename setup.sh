#!/bin/bash

# Create project directory
# mkdir streamline-hr && cd streamline-hr

# Set up server
mkdir server && cd server
npm init -y
npm install express typescript ts-node @types/express @types/node
npx tsc --init

# Create server tsconfig.json
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
EOL

# Create server directory structure
mkdir -p src/routes src/models src/controllers
touch src/index.ts

# Set up client
cd ..
npm create vite@latest client -- --template react-ts
cd client
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Update client's vite.config.ts
cat > vite.config.ts << EOL
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
EOL

# Update client's tailwind.config.js
cat > tailwind.config.js << EOL
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

# Create client directory structure
mkdir -p src/components src/pages
touch src/App.tsx src/main.tsx src/index.css

# Go back to project root
cd ..

# Create Dockerfile.client
cat > Dockerfile.client << EOL
FROM node:14

WORKDIR /app

COPY client/package*.json ./

RUN npm install

COPY client/ .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev"]
EOL

# Create Dockerfile.server
cat > Dockerfile.server << EOL
FROM node:14

WORKDIR /app

COPY server/package*.json ./

RUN npm install

COPY server/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
EOL

# Create docker-compose.yml
cat > docker-compose.yml << EOL
version: '3'
services:
  client:
    build:
      context: .
      dockerfile: Dockerfile.client
    ports:
      - "5173:5173"
    volumes:
      - ./client:/app
      - /app/node_modules
    depends_on:
      - server

  server:
    build:
      context: .
      dockerfile: Dockerfile.server
    ports:
      - "3000:3000"
    volumes:
      - ./server:/app
      - /app/node_modules
EOL

# Create .gitignore
cat > .gitignore << EOL
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Logs
*.log

# Environment variables
.env

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Vite
*.local
EOL

echo "Setup complete! Your Streamline HR app structure has been created."