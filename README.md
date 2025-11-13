![](https://img.shields.io/static/v1?label=PhoneHub+BY&message=Francis&color=blue)

# PhoneHub

> A dynamic e-commerce platform that showcases a variety of mobile phone brands and models, allowing users to customize and order their preferred devices by selecting RAM sizes, colors, and storage capacities.

---

## 🏗️ Built With

### Core Technologies
- **MongoDB** - NoSQL database for scalable product and order management
- **Express.js** - Backend web framework for RESTful APIs
- **React** - Frontend library for building interactive user interfaces
- **Node.js** - JavaScript runtime for backend development

### Frontend Technologies
- **Tailwind CSS** - Utility-first CSS framework for responsive UI
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Chart.js** - Analytics and data visualization
- **Stripe.js** - Payment gateway integration

### Backend Technologies
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token for authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting and management
- **Nodemailer** - Email notifications (optional)
- **Stripe** - Payment processing API

---

## 🚀 Overview

**PhoneHub** is a full-stack e-commerce web application designed to provide users with a seamless phone shopping experience.  
It supports product filtering, secure payments, admin product management, and responsive design for both desktop and mobile users.

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js (>= 18.x)](https://nodejs.org/)
- [npm (>= 9.x)](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

You should also be familiar with:
- JavaScript (ES6+)
- React & Redux Toolkit
- RESTful API architecture
- Environment variable configuration

---

## ⚙️ Environment Variables

### **Server `.env`**

```bash
NODE_ENV=development
PORT=
MONGODB_URI=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
```

### **Client `.env`**

```bash
REACT_APP_STRIPE_PUBLIC_KEY=
VITE_STRIPE_PUBLIC_KEY=
```

---

## 💻 Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Gambit142/PhoneHub.git
cd PhoneHub
```

### 2. Install dependencies

#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
cd ../client
npm install
```

### 3. Configure environment variables
Create `.env` files in both `server/` and `client/` directories as shown above.

### 4. Start MongoDB
If running locally:
```bash
mongod
```

### 5. **Tips:**  
> Generate a secure JWT secret using:
> ```bash
> node server/src/utils/generateSecret.js
> ```

> Create the initial admin user using:
> ```bash
> node server/src/utils/createAdmin.js
> ```

> Seed the database with phone data by using:
> ```bash
> node server/src/utils/seedDatabase.js
> ```

### 5. Start the development servers

#### Backend:
```bash
npm run start
```

#### Frontend:
```bash
npm run dev
```

### 6. Access the app
Open your browser and go to:
```
http://localhost:5173
```

---


## 🧠 Technologies & Tools

| Category | Technologies |
|-----------|---------------|
| **Frontend** | React, Vite, Tailwind CSS, Redux Toolkit, Chart.js |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB |
| **Authentication** | JWT |
| **Media Storage** | Cloudinary |
| **Payments** | Stripe |
| **Email Service** | Nodemailer |
| **State Management** | Redux Toolkit |
| **Testing** | Jest |
| **Utilities** | bcryptjs, dotenv |

---

## 🧩 Features

- User registration and login (JWT-based authentication)
- Browse and filter phones by brand, RAM, storage, and color
- Secure payment integration with Stripe
- Product management dashboard for admin users
- Cloud-based image upload via Cloudinary
- Order tracking and user purchase history
- Responsive design optimized for mobile and desktop
- Real-time stock update and order status changes

---

## 🌱 Future Enhancements

- **Wishlist feature** for saving favorite products  
- **Multi-language support** for international users  
- **Product reviews and ratings** system  
- **AI-based product recommendation engine**  
- **Progressive Web App (PWA)** integration for offline usage  
- **Email verification and password recovery** functionality  
- **Integration with Google Pay / Apple Pay** for faster checkout  

---

## 👨‍💻 Author

👤 **Francis Ugorji**  
- GitHub: [@Gambit142](https://github.com/Gambit142)  
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/francis-ugorji/)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to open a pull request or check the [issues page](../../issues/).

---

## 🌟 Show your support

Give a ⭐️ if you like this project and found it helpful!

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

Special thanks to:
- The open-source community for the tools and frameworks used  
- Cloudinary and Stripe for providing free-tier APIs  
- Pexels for sample phone product images  
- Tailwind CSS team for an excellent styling framework  

---
