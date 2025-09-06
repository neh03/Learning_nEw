# EcoFinds - Sustainable Second-Hand Marketplace

A full-stack web application for buying and selling second-hand items, promoting sustainable consumption and circular economy.

## 🌱 Features

### Core Functionality
- **User Authentication**: Secure registration and login system
- **Product Management**: Create, edit, delete, and browse product listings
- **Shopping Cart**: Add items to cart and manage quantities
- **Purchase System**: Complete checkout process with order tracking
- **User Dashboard**: Profile management and activity overview
- **Search & Filtering**: Find products by category, price range, and keywords

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with green sustainability theme
- **Real-time Updates**: Dynamic cart updates and status tracking
- **Image Placeholders**: Ready for image upload functionality

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Development Tools
- **Concurrently** - Run multiple npm scripts
- **Nodemon** - Auto-restart server during development

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (running locally or MongoDB Atlas account)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecofinds-marketplace
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```bash
cd server
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecofinds
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will create the database automatically

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### 5. Run the Application

#### Development Mode (Recommended)
```bash
# Run both frontend and backend concurrently
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

#### Manual Setup (Alternative)
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## 📱 Usage

### Getting Started
1. Open your browser and navigate to `http://localhost:3000`
2. Create a new account or login with existing credentials
3. Browse products or start selling by adding your first item

### Key Features

#### For Buyers
- Browse products by category or search
- Add items to cart
- Complete purchases with checkout
- Track purchase history
- Leave reviews for sellers

#### For Sellers
- Create detailed product listings
- Manage your inventory
- Track sales and earnings
- Respond to customer inquiries

## 🗂️ Project Structure

```
ecofinds-marketplace/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts (Auth, Cart)
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── index.js          # Server entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/user/my-listings` - Get user's products

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Purchases
- `POST /api/purchases/checkout` - Process checkout
- `GET /api/purchases/history` - Get purchase history
- `GET /api/purchases/sales` - Get sales history
- `PUT /api/purchases/:id/status` - Update order status
- `POST /api/purchases/:id/review` - Add review

## 🎨 Customization

### Styling
The application uses custom CSS with a green sustainability theme. Key color variables:
- Primary Green: `#10b981`
- Secondary Green: `#059669`
- Background: `#f8fafc`
- Text: `#1e293b`

### Adding New Features
1. **Backend**: Add new routes in `server/routes/`
2. **Frontend**: Create new components in `client/src/components/`
3. **Database**: Add new models in `server/models/`

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend: `cd client && npm run build`
2. Deploy the `build` folder to your hosting service
3. Update API URLs to point to your backend

### Backend (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Deploy the `server` folder
3. Ensure MongoDB connection is configured

### Database (MongoDB Atlas)
1. Create a production cluster
2. Update connection string in environment variables
3. Configure network access and authentication

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: MongoDB connection failed
```
**Solution**: Ensure MongoDB is running and connection string is correct

#### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: Change PORT in `.env` file or kill the process using the port

#### CORS Issues
```
Access to fetch at 'localhost:5000' from origin 'localhost:3000' has been blocked by CORS policy
```
**Solution**: CORS is already configured in the backend, ensure both servers are running

### Development Tips
- Use browser developer tools to debug frontend issues
- Check server logs in terminal for backend errors
- Use MongoDB Compass to inspect database data
- Clear browser cache if experiencing stale data issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- All contributors who help make this project better

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**Happy Sustainable Shopping! 🌱**