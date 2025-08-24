# **SyncGlow** - Skin Analysis


**AI-powered skin analysis and personalized skincare recommendations.
SyncGlow helps users analyze their skin using advanced AI, track their progress, and get SyncGlow skincare product for your skin type,all in one platform.**

## **Features**

🔬 **Skin Analyzer** – Get instant AI-based skin health analysis.

📊 **History Tracking** – Track your skin progress over time.

🛍️ **SyncGlow Skincare Product** – Personalized skincare product for the different skin types.

🧾 **Orders & Purchases** – Manage and view your past purchases.

👤 **Profile Management** – Secure account management.

👩‍⚕️ **Expert Consultation** – Connect with dermatologists for professional advice.

## **Tech Stack**

### **Frontend**

⚛️ **React.js
 – UI framework**

🎨 **TailwindCSS
 – Styling**

⚡ **Vite
 – Fast bundler**

### **Backend**

⚡ **FastAPI
 – High-performance Python backend**

🐍 **Python
 – Core backend language**

🔬 **Face++ API
 – AI-powered skin analysis**

### **Auth & Database**

🛠️ **Supabase
 – Authentication + PostgreSQL Database**

## 🔑 **Environment Variables**
#### **Create a .env file inside backend/:**
``` 
FACEPLUSPLUS_API_KEY=your_facepp_api_key

FACEPLUSPLUS_API_SECRET=your_facepp_api_secret

```
#### **For frontend (.env.local):**
```
VITE_SUPABASE_URL=your_supabase_project_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```


## **Usage**

**Sign up / Log in with Supabase Auth.**

**Upload a skin photo → sent to backend → analyzed by Face++ API.**

**View results (skin type, acne, spots, etc.) on the dashboard.**

**Track history of past analyses.**

**Get SyncGlow skincare product tailored to different skin types.**

**Connect with dermatologists for professional skin.**


## **Future Work**

**Advanced Analysis API with Subscription
Enable premium users to access deeper AI-powered insights.**

**Dermatologist Platform:
Functional consultation booking system + dashboard for dermatologists to register and manage their services.**

**AI Product Recommendation Engine
Automatically suggest skincare products after each analysis, tailored to the detected skin type.**

## **License**

MIT License – free to use, modify, and distribute with attribution.