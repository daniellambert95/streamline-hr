#!/bin/bash

# Create project directory
mkdir streamline-hr && cd streamline-hr

# Create .env file
cat > .env << EOL
# Database Configuration
POSTGRES_USER=your_username_here
POSTGRES_PASSWORD=your_password_here
POSTGRES_DB=your_database_name_here
DATABASE_URL=postgres://your_username_here:your_password_here@postgres:5432/your_database_name_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Node Environment
NODE_ENV=development
EOL

# Set up server
mkdir server && cd server

# Create server directory structure
mkdir -p src/{controllers,middleware,routes,types,uploads}

# Create package.json with updated dependencies
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
    "@node-rs/bcrypt": "^1.3.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.17.1",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "pg": "^8.13.1",
    "react-icons": "^5.4.0",
    "recharts": "^2.15.0",
    "ts-node": "^10.4.0",
    "typescript": "^4.5.4"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/multer": "^1.4.12",
    "@types/node": "^16.11.12",
    "@types/pg": "^8.11.10",
    "@types/react-icons": "^2.2.7",
    "@types/recharts": "^1.8.29",
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
    "forceConsistentCasingInFileNames": true,
    "typeRoots": ["./node_modules/@types", "./src/types"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
EOL

# Create db.ts
cat > src/db.ts << EOL
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('✅ Connected to the PostgreSQL database');
});

export default pool;
EOL

# Create basic server setup
cat > src/index.ts << EOL
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateJWT } from './middleware/authMiddleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/loginRoute').default);
app.use('/api/profile', authenticateJWT, require('./routes/userProfileRoute').default);
app.use('/api/upload', authenticateJWT, require('./routes/uploadRoute').default);
app.use('/api/jobs', authenticateJWT, require('./routes/jobsRoute').default);

app.listen(port, '0.0.0.0', () => {
  console.log(\`Server is running on port \${port}\`);
});
EOL

# Create auth middleware
cat > src/middleware/authMiddleware.ts << EOL
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};
EOL

cd ..

# Set up client (Vite + React + TypeScript)
npm create vite@latest client -- --template react-ts
cd client
npm install
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom react-icons recharts
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
      - JWT_SECRET=\${JWT_SECRET}
      - DATABASE_URL=postgres://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@postgres:5432/\${POSTGRES_DB}
    depends_on:
      - postgres

  postgres:
    image: postgres:14
    container_name: postgres_streamline_hr
    restart: always
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
      POSTGRES_DB: \${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOL

# Create database setup script
cat > setup-db.sh << EOL
#!/bin/bash

# Load environment variables from .env file
set -a
[ -f .env ] && source .env
set +a

set -e
trap 'echo "An error occurred. Exiting..."; exit 1' ERR

until docker exec -i postgres_streamline_hr pg_isready -U \${POSTGRES_USER}; do
  echo "Waiting for PostgreSQL to start..."
  sleep 2
done

echo "Setting up the database schema..."

docker exec -i postgres_streamline_hr psql -U \${POSTGRES_USER} -d \$POSTGRES_DB <<-EOSQL
  -- Users Table
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'recruiter', 'employee')),
    manager BOOLEAN DEFAULT FALSE,
    subscription VARCHAR(50) NOT NULL DEFAULT 'basic',
    user_image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  -- Add other tables as needed
EOL

chmod +x setup-db.sh

echo "Setup complete! Next steps:"
echo "1. Update the .env file with your credentials"
echo "2. Run 'docker-compose up --build'"
echo "3. Run './setup-db.sh' to initialize the database"
echo "4. Create an initial admin user manually: Use your own credentials"
echo "5. Run './populate-db.sh' to add sample data"
