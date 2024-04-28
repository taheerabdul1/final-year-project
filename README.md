# FundMosque: Mosque Donation Management System (Final Year Project)

Welcome to the repository for FundMosque, a donation management system designed to streamline the donation process for mosques. This project serves as my final year project.

## Features

* Easy donation collection and tracking
* Secure user management (including administrator accounts)
* Campaign Management
* Announcements
* Administrator Dashboard
* Report Generation

## Getting Started

**Prerequisites:**

* Node.js and npm installed on your system
* MongoDB database (local or hosted)

**Installation:**

1. **Clone or fork** this repository.
2. **Navigate** to the project root directory.
3. **Set up environment variables:**
   - Create a `.env` file in the `/server` directory.
   - Add the following lines, replacing the placeholders with your actual values:

     ```
     URI=mongodb://localhost:27017   # Replace with your MongoDB connection string
     PASSCODE=your_secret_passcode   # Replace with a secure passcode for admin users
     ```

4. **Install dependencies:**
   - Open a terminal and navigate to the `/server` directory:

     ```bash
     cd server
     ```

   - Install backend dependencies:

     ```bash
     npm install
     ```

   - Open a new terminal and navigate to the `/client` directory:

     ```bash
     cd ../client
     ```

   - Install frontend dependencies:

     ```bash
     npm install
     ```

5. **Start the application:**

   - Open a terminal and navigate to the `/server` directory:

     ```bash
     cd server
     ```

   - Start the server:

     ```bash
     npm start
     ```

This will start the FundMosque application.

## Help

If you encounter any issues or have questions, feel free to open an issue in this repository.

## Authors

* Abdul Taheer

## Version History

* 0.1 - Initial Release

## Images

![Homepage when user is not logged in](/docs/homepage.png)
![Register page](/docs/register.png)
![Login page](/docs/login.png)
![Homepage when user is logged in](/docs/homepageloggedin.png)
![Make a donation page](/docs/makedonation.png)
![View mosques page](/docs/mosquespage.png)
![Profile page](/docs/profilepage.png)
![Campaigns page](/docs/campaigns.png)
![Announcements](/docs/announcement.png)
![Admin dashboard page](/docs/admindashboard.png)
![Admin dashboard page](/docs/admindashboard2.png)
![Logout page](/docs/logout.png)