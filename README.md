# Smart Event Management & Ticketing Platform  
**WPR381 Project 2026 — Advanced Events (Pty) Ltd**

---

## 📖 Project Overview
A full-stack web application designed to streamline event management and ticketing for **Advanced Events (Pty) Ltd**.  
The platform replaces manual spreadsheets and disconnected tools with a secure, role-based system that supports:

- Event creation and management  
- Ticket booking and booking history  
- User authentication and role-based access (Admin/User)  
- Customer enquiries and admin inbox management  
- Analytics dashboard with charts for bookings, popular events, and capacity usage  

---

## 🛠 Technologies Used
- **Backend:** Node.js, Express  
- **Database:** MongoDB (Mongoose ODM)  
- **Frontend:** EJS templates, CSS  
- **Analytics:** Chart.js  

---

## 👥 Team Members & Roles
| Name | Student No | Role |
|------|------------|------|
| [Member 1] | [Student No] | Team Lead / Project Coordinator |
| Jininy Nkomo | 575936 | Backend Developer |
| Nthabeleng Mathabathe | 600382 | Security / Auth Developer |
| Stephen van der Merwe | 601789 | Frontend Developer |
| Eduard Herman | 602125 | Database Engineer |

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone : https://github.com/ContactHBTNIntranetID/WPR381_Project
   cd WPR381_PROJECT

2. Install dependencies
npm install

3. Create .env file
MONGO_URI=mongodb+srv://<cluster>/<dbname>
SESSION_SECRET=yourRandomSecretKey
PORT=3000

4. Run the development server
node index.js

5. Visit in browser

http://localhost:3000/ → Home page (search + events grid)

http://localhost:3000/admin-dashboard → Admin analytics (requires admin login)

http://localhost:3000/enquiry/inbox → Enquiry inbox (admin only)



© 2026 Advanced Events (Pty) Ltd