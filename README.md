# Business Management Platform

**Manage products, inventory, sales, expenses, and business performance — all in one place.**

Business Management Platform is a modern, reusable business management system designed for local retailers and small businesses. It provides customers with a simple digital product catalog while giving business owners a powerful admin dashboard to manage products, inventory, sales, expenses, and profit analytics.

The platform is initially being developed for **mobile accessories stores**, but its reusable architecture allows it to be adapted for other businesses such as shoe shops, clothing stores, electronics stores, beauty shops, and general retailers.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## ✨ Features

### 🛍️ Customer Catalog

- 📱 Mobile-friendly product catalog
- 🔍 Product search
- 🗂️ Product categories
- 🖼️ Product images
- 💰 Product prices
- 📦 Product availability
- 🚨 Out-of-stock indication
- 📱 QR-code access
- ⚡ Fast and responsive browsing

### 🔐 Admin Dashboard

- Secure admin authentication
- Business dashboard
- Product management
- Category management
- Product image management
- Inventory management
- Stock additions
- Stock adjustments
- Sales management
- Sales history
- Expense management

### 📦 Inventory Management

- Track available stock
- Automatically reduce stock after sales
- Add new stock
- Low-stock alerts
- Out-of-stock tracking
- Inventory transaction history
- Stock movement tracking

### 💰 Sales & Profit Management

- Record product sales
- Automatically calculate sales totals
- Track product cost
- Calculate revenue
- Calculate cost of goods sold
- Calculate gross profit
- Track business expenses
- Calculate net profit

### 📊 Business Analytics

- Daily sales summary
- Weekly sales summary
- Monthly sales summary
- Yearly sales summary
- Revenue analysis
- Profit/loss analysis
- Expense analysis
- Best-selling products
- Most profitable products
- Sales trends
- Profit trends
- Product performance analysis

### 📑 Reports

- Daily business reports
- Weekly business reports
- Monthly business reports
- Yearly business reports
- Custom date-range reports
- Sales reports
- Profit reports
- Inventory reports
- Expense reports
- PDF/Excel export *(planned)*

---

## 🎯 Initial Target

The first version of the platform is being developed for:

**📱 Mobile Accessories Stores**

Example product categories:

- Phone Cases
- Chargers
- USB Cables
- Earphones
- Headphones
- Power Banks
- Screen Protectors
- Smart Watches
- Bluetooth Speakers
- Other Mobile Accessories

The platform is designed so that the same system can later be customized and reused for other types of businesses.

---

## 🧠 Reusable Business Architecture

The system is being designed as a reusable business platform rather than a single-store application.

A business can have its own:

- Business name
- Logo
- Branding
- Products
- Categories
- Inventory
- Sales
- Expenses
- Admin users
- Analytics

This allows the platform to be adapted for different businesses without rebuilding the entire application.

Example:

```text
Business Management Platform
│
├── Mobile Accessories Store
│   ├── Products
│   ├── Sales
│   ├── Inventory
│   └── Analytics
│
├── Shoe Store
│   ├── Products
│   ├── Sales
│   ├── Inventory
│   └── Analytics
│
└── Clothing Store
    ├── Products
    ├── Sales
    ├── Inventory
    └── Analytics
