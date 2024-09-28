#!/bin/bash

# Create project directory
mkdir streamline-hr && cd streamline-hr

# Set up server
mkdir server && cd server
cat > package.json << EOL
{
  "name": "streamline-hr-server",
  "version": "1.0.0",
  "description": "Server for Streamline HR app",
  "main": "src/index.ts",
  "scripts": {
    "start": "ts-node src/index.ts",
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1",
    "ts-node": "^10.4.0",
    "typescript": "^4.5.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.13",
    "@types/node": "^16.11.12",
    "ts-node-dev": "^1.1.8"
  }
}
EOL

# Create tsconfig.json
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

# Create src/index.ts
mkdir src
cat > src/index.ts << EOL
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Streamline HR Server!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(\`Server is running on port \${port}\`);
});
EOL

cd ..

# Set up client
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
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://server:3000',
        changeOrigin: true,
      }
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

# Update the global CSS in index.css
cat > src/index.css << EOL
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

cd ..

# Create Dockerfile.client
cat > Dockerfile.client << EOL
FROM node:16

WORKDIR /app

COPY client/package*.json ./

RUN npm install

COPY client/ .

EXPOSE 5173

CMD ["npm", "run", "dev"]
EOL

# Create Dockerfile.server
cat > Dockerfile.server << EOL
FROM node:16

WORKDIR /app

COPY server/package*.json ./

RUN npm install

COPY server .

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
    environment:
      - VITE_API_URL=http://server:3000

  server:
    build:
      context: .
      dockerfile: Dockerfile.server
    ports:
      - "3000:3000"
    volumes:
      - ./server:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
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