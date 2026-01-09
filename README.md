
---

## 📘 Backend README (`README.md`)

```markdown
# FinTrack Pro Backend

A Node.js + Express + MongoDB backend for FinTrack Pro.  
Provides secure JWT authentication, expense management, and bill gallery API routes.

---

## 🚀 Features
- Node.js + Express REST API
- MongoDB with Mongoose
- JWT authentication & middleware
- CRUD for expenses
- Bill Gallery (upload, view, delete bills via Cloudinary)
- Secure protected routes

---

## 📦 Installation
```bash
# Clone the repo
git clone https://github.com/AsanI2003/fin-track-project-backend.git
cd fin-track-project-backend

# Install dependencies
npm install


🔧 Environment Variables
Create a .env file in the project root:

PORT=5000
MONGO_URI=mongodb://localhost:27017/fintrack
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

🛠️ Development
npm run dev
Backend runs on http://localhost:5000 (localhost in Bing).

📦 Production
npm run build
npm start

also i deployed backend but frontend and database side got errors.
versel link - https://vercel.com/asan-indusaras-projects/fin-track-project-backend/5h2m4VueMHaBXSkWJTcmr8hR6nos
