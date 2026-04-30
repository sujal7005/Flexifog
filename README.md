# Flexifog - Ecommerce Website

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Plixifog is a modern, full-stack ecommerce platform built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides a seamless shopping experience with features like user authentication, product browsing, shopping cart, payment processing, and an admin panel for managing the store.

## Features

- **User Authentication**: Secure sign-in and sign-up with JWT-based authentication.
- **Product Catalog**: Browse products across various categories including laptops, mobiles, cameras, audio devices, kitchen appliances, and more.
- **Shopping Cart**: Add, update, and remove items from the cart with real-time updates.
- **Payment Integration**: Secure payment processing (integration details can be added).
- **Admin Panel**: Manage products, orders, users, and analytics through a dedicated dashboard.
- **Responsive Design**: Mobile-friendly UI built with React and Tailwind CSS.
- **Search and Filters**: Advanced search and filtering options for products.
- **Order Management**: Track orders, view history, and manage transactions.
- **Discount Codes**: Apply promotional codes for discounts.
- **Contact and Support**: Integrated contact forms and FAQ section.

## Tech Stack

### Frontend
- **React**: Component-based UI library
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Context API**: State management for cart and user data

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing

### Additional Tools
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Multer**: File upload handling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sujal7005/plixifog.git
   cd plixifog
   ```

2. **Install server dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**:
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**:
   - Create a `.env` file in the `server` directory with the following variables:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     STRIPE_SECRET_KEY=your_stripe_secret_key (if using Stripe)
     ```

5. **Start the server**:
   ```bash
   cd server
   npm start
   ```

6. **Start the client**:
   ```bash
   cd ../client
   npm run dev
   ```

7. **Access the application**:
   - Frontend: http://localhost:5173 (default Vite port)
   - Backend: http://localhost:5000

## Usage

- **As a Customer**: Browse products, add to cart, checkout, and track orders.
- **As an Admin**: Access the admin panel at `/admin` to manage the store.

## API Endpoints

The backend provides RESTful APIs for various functionalities. Key endpoints include:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Products**: `/api/products`, `/api/products/:id`
- **Cart**: `/api/cart`
- **Orders**: `/api/orders`
- **Users**: `/api/users`
- **Admin**: `/api/admin/*`

Refer to the `server/routes` directory for detailed route definitions.

## Project Structure

```
plixifog/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context for state management
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── uploads/            # File uploads
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact [sujal0705gupta@gmail.com] or open an issue on GitHub.

---

Built with ❤️ using MERN Stack.
