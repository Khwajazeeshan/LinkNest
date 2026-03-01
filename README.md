# LinkNest: Your links, one place 🔗

LinkNest is a premium, all-in-one link management platform (link-in-bio) built with **Next.js**, **Tailwind CSS**, and **MongoDB**. It empowers creators to share their entire digital presence through a single, stunning link.

## ✨ Features

- **🔒 Robust Authentication**: Secure login, signup, and email verification powered by JWT and Bcrypt.
- **🏠 Beautiful Landing Page**: A modern, high-conversion hero section to welcome users.
- **📊 Personalized Dashboard**: Manage your identity, security, and links in a clean, intuitive interface.
- **🔗 Link Management**: 
    - Add multiple platform links (Twitter, YouTube, Instagram, etc.).
    - Update or delete existing links.
    - Automated link cleanup when a user deletes their account.
- **👤 Dynamic Profiles**: Custom user-specific routes (`linknest.co/[username]`) to showcase all your links on a mobile-optimized profile page.
- **💅 Premium UI/UX**: Custom-designed CSS system with smooth animations, glassmorphism effects, and responsiveness.
- **🚀 Advanced Security**: Password resets via email and secure session handling.

## 🛠️ Technology Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend**: Next.js API Routes (Serverless)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Styling**: Vanilla CSS + Tailwind CSS utilities
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Email**: [Nodemailer](https://nodemailer.com/)

## 📂 Project Structure

```text
LinkNest/
├── src/
│   ├── app/                # Next.js Pages & API Routes
│   │   ├── auth/           # Login, Signup, Password Recovery
│   │   ├── api/            # Backend Endpoints (Auth, Links)
│   │   ├── [handler]/      # Dynamic User Profile Page
│   │   ├── generate/       # Link Creation Page
│   │   └── mylinks/        # Link Management Dashboard
│   ├── components/         # Reusable UI Components
│   │   ├── navbar/         # Navigation System
│   │   └── Section1/       # Landing Page Sections
│   ├── models/             # Mongoose Schemas (User, Link)
│   ├── config/             # DB Connection Config
│   ├── utils/              # Helper functions (Token verify, etc.)
│   └── globals.css         # Core Design System & Tokens
├── public/                 # Static Assets
└── package.json            # Dependencies & Scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/LinkNest.git
   cd LinkNest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   Create a `.env` file in the root directory and add:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   DOMAIN=http://localhost:3000
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.


## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ by [Khawaja Zeeshan]
