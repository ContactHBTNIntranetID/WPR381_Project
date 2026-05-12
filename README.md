Smart Event Management & Ticketing Platform
WPR381 Project 2026 — Advanced Events (Pty) Ltd

Project Overview
A full-stack web application built for Advanced Events (Pty) Ltd to replace manual spreadsheets and disconnected tools. The platform handles event management, ticket booking, user authentication and customer enquiries — all in one secure, role-based system.

👥 Team Members & Roles
NameStudent NoRole
[Member 1][Name][Student No]Team Lead / Project Coordinator
[Member 2] Jininy Nkomo - 575936 - Backend Developer
[Member 3][Name][Student No]Security / Auth Developer
[Member 4][Name][Student No]Frontend Developer
[Member 5] Eduard Herman - 602125 Database Engineer

Tech Stack

Runtime: Node.js
Framework: Express.js
Templating: EJS (Embedded JavaScript)
Database: MongoDB Atlas (M0 Free Tier)
ODM: Mongoose
Auth: express-session + bcrypt
Styling: Bootstrap / Tailwind CSS
Dev Tool: nodemon
Version Control: Git & GitHub


 Project Structure
WPR381_PROJECT/
│
├── config/
│   └── db.js                  # MongoDB Atlas connection
│
├── models/
│   ├── User.js                # User schema
│   ├── Event.js               # Event schema
│   ├── Booking.js             # Booking schema
│   └── Enquiry.js             # Enquiry schema
│
├── seed/
│   └── seed.js                # Populates DB with sample data
│
├── .env                       # Environment variables (NOT in GitHub)
├── .gitignore
├── app.js                     # Main entry point
├── package.json
└── README.md

⚙️ Setup Instructions
1. Clone the repository
bash
git clone https://github.com/yourusername/WPR381_PROJECT.git
cd WPR381_PROJECT
2. Install dependencies
bash
npm install
3. Create your .env file
Create a file called .env in the root of the project and add the following:
env
MONGO_URI=
SESSION_SECRET=
PORT=

⚠️ Replace YOUR_PASSWORD with the actual Atlas database password. Never commit this file to GitHub.

4. Seed the database
Run this once to populate MongoDB Atlas with sample users, events, bookings and enquiries:
bash
node seed/seed.js
Expected output:
✅ MongoDB Connected: eventplatformcluster.kq2ojsg.mongodb.net
✅ Database seeded successfully!
   ADMIN → admin@advancedevents.co.za | password: admin123
   USER1 → jane@example.com           | password: user123
   USER2 → john@example.com           | password: user123
5. Run the development server
bash
npm run dev
Or without nodemon:
bash
node app.js
6. Open in browser
http://localhost:3000

🔑 Demo Login Credentials
Role    Email                       Password
Admin   admin@advancedevents.co.za  admin123
User    jane@example.com            user123
User    john@example.com            user123

📄 Pages
Page                          Route                            Access
Home/Event Listing            /events                          Public
Register                      /auth/register                   Public
Login                         /auth/login                      Public
Event Management              /admin/events                    Admin only
Admin Dashboard               /admin/dashboard                 Admin only
Booking & History             /bookings/dashboard              Logged in users
Contact / Enquiry             /enquiry/contact                 Public
Enquiry Inbox                 /enquiry/inbox                   Admin only

📦 NPM Scripts
json"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
Add these to your package.json if not already there.


🗄️ Database

Provider: MongoDB Atlas (M0 Free Tier)
Database name: eventdb (auto-created on first connection)
Collections: users, events, bookings, enquiries


.gitignore
Make sure your .gitignore contains:
node_modules/
.env

GitHub Repository
https://github.com/ContactHBTNIntranetID/WPR381_Project