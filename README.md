# Visitor Management System – Frontend

The Visitor Management System (VMS) is a React-based web app for managing visitor check-ins, host availability, notifications, and reports. It offers role-based dashboards, real-time updates, and a responsive design for efficient visitor flow management.

---

## 🚀 Features

- **Authentication & Role-Based Access**

  - Secure login for Super Admin, Admin, Receptionist, and Host roles.
  - Tailored dashboards and feature access per role.

- **Host Availability Management**

  - Hosts can set start and end date-times for availability.
  - Timezone-aware input and display.

- **Visitor Check-In**

  - Receptionists can check visitors in based on host schedules.
  - Smart error handling for unavailable hosts.

- **Reports & PDF Exports**

  - Admins and Super Admins can view visit logs.
  - Export monthly reports including:
    - Total visits
    - Top visit reasons
    - Top hosts

- **Notifications Page**

  - Hosts can view all and unread notifications from visitor activity.
  - Persistent storage in the backend.

- **Responsive Design**
  - Clean, professional styling.

---

## 🛠 Tech Stack

- **Framework**: React (Vite)
- **Routing**: React Router
- **Data Fetching**: SWR & SWR Mutation
- **Styling**: CSS3 & Inline CSS
- **State Management**: React Context API
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Deployment**: Vercel

---

## FOLDER STRUCTURE

```
src/
  ├── api/               # Axios instance for API calls
  ├── components/        # Shared UI components
  ├── context/           # Auth & global state
  ├── pages/             # Soldier Pages
  ├── admin/             # Admin Pages
  ├── host/              # Host Pages
  ├── utils/             # Helper functions
```

---

## Roles and permissions

| Role         | Permissions                                 |
| ------------ | ------------------------------------------- |
| Super Admin  | Full access, manage users, reports, exports |
| Admin        | Manage visits, reports, exports             |
| Receptionist | Check-in visitors                           |
| Host         | Set availability, view notifications        |

---

## 📦 Installation & Setup

1. **Clone the repository**

```bash
   git clone https://github.com/Trans-Business-Machines/Frontend-2
   cd Frontend-2
```

2. **Install the dependencies**

```bash
   npm install
```

3 2. **Start the development server**

```bash
  npm run dev
```

---

## License

This project is licensed under the MIT License – feel free to adapt and use it.
