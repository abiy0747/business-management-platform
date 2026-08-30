# Business Management Platform

**A modern business management platform for managing products, inventory, sales, expenses, and profit — all from one dashboard.**

A full-stack multi-seller platform that allows businesses to manage their store, products, stock, sales, expenses, and analytics. Each seller has their own business data and public catalog.

🔗 **Live Demo:** `https://bizadmin.vercel.app`

🔗 **Admin Login:** `https://bizadmin.vercel.app/admin/login`

🔑 **Demo Account**

**Email**: abiy@gmail.com

**Password**: Abiy@0747

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge\&logo=next.js\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge\&logo=prisma\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge\&logo=cloudinary\&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge\&logo=vercel\&logoColor=white)

---

## ✨ Features

* 🏪 **Multi-Seller Support** — Multiple businesses can use the same platform
* 📦 **Product Management** — Add, edit, delete, and manage products
* 🗂️ **Category Management** — Organize products by categories
* 📊 **Inventory Management** — Track stock and product availability
* 💰 **Sales Management** — Record sales and calculate totals
* 💵 **Profit & Loss** — Track revenue, costs, expenses, and profit
* 📈 **Business Analytics** — View sales, revenue, cost, and profit statistics
* 💸 **Expense Management** — Manage business expenses
* 🖼️ **Image Uploads** — Upload product and store images with Cloudinary
* ⚙️ **Store Settings** — Customize store information, logo, banners, and contact details
* 🌐 **Public Catalog** — Each seller can have their own online product catalog

---

## 🛠️ Tech Stack

| Layer          | Technology           |
| -------------- | -------------------- |
| Framework      | Next.js (App Router) |
| Language       | TypeScript           |
| Database       | PostgreSQL           |
| ORM            | Prisma               |
| Styling        | Tailwind CSS         |
| Image Storage  | Cloudinary           |
| Authentication | Auth.js / NextAuth   |
| Hosting        | Vercel               |

---

## 📁 Project Structure

```text
business-management-platform/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── api/            # API routes
│   └── ...             # Public pages
├── components/         # Reusable components
├── lib/                # Utilities & Prisma
├── prisma/
│   └── schema.prisma   # Database schema
├── public/             # Static assets
└── package.json
```

---

## 🚀 Getting Started

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd business-management-platform
npm install
npm run dev
```

Create `.env.local` with your PostgreSQL, authentication, and Cloudinary environment variables.

---

## 🗺️ Roadmap


* [ ] Advanced analytics
* [ ] Low-stock notifications
* [ ] Seller subscription plans


---

## 👤 Author

**Abiy**

GitHub: [@abiy0747](https://github.com/abiy0747)

---

## 📄 License

This project is licensed under the MIT License.
