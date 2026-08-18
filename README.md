# Capstone - Real Estate Platform

A full-stack real estate platform that connects clients with property agents. Clients can browse and search available properties, while agents can create and manage property listings and respond to inquiries.

The frontend is built with **Next.js and React**, while the backend is powered by **Node.js, Express, PostgreSQL, and Prisma**.

## Features

- Property listings and property details
- Property search and filtering
- Agent authentication and dashboard
- Client authentication, dashboard and property inquiries
- Admin dashboard
- JWT-based authentication and authorization
- Role-based access control
- PostgreSQL database with Prisma ORM
- Responsive UI

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend

- Node.js
- Express
- PostgreSQL
- Prisma
- JWT
- bcrypt

## Admin Dashboard

Capstone includes a full admin panel for managing agents, clients, 
properties, and inquiries.

![Admin dashboard demo](client/public/capstone/capstone-1.gif)

### Overview
Real-time counts across the platform.

![Admin overview](client/public/capstone/capstone-2.png)

### Managing properties
Admins can view, edit, reassign, or delete any listing - including 
reassigning a property to a different agent.

![Admin properties](client/public/capstone/capstone-3.png)

### Managing agents & clients
Full CRUD with safeguards - e.g. an admin can't delete an agent who 
still has active listings, or a client with inquiries on record.

![Admin agents](client/public/capstone/capstone-4.png)
![Admin clients](client/public/capstone/capstone-5.png)

### Admin access

Live admin credentials are available on request — reach out at [dicksonboateng@proton.me](mailto:dicksonboateng@proton.me) and I'll share login details for a walkthrough.