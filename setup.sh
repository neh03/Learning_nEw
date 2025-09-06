#!/bin/bash

echo "🌱 EcoFinds Marketplace Setup Script"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v14 or higher) first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "⚙️ Creating environment configuration..."
    cat > server/.env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecofinds
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
EOL
    echo "✅ Environment file created at server/.env"
    echo "⚠️  Please update the JWT_SECRET in server/.env for production use"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running locally, or update MONGODB_URI in server/.env for MongoDB Atlas"
echo "2. Run 'npm run dev' to start both frontend and backend servers"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy sustainable shopping! 🌱"