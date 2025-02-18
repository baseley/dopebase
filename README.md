# Dopebase - All-in-one Web & Mobile Development Platform Powered by AI

---

### **Dopebase: The Next-Generation Open-Source App Builder**

#### **Redefining the Frontier of Digital Creations**

In a world driven by dynamic digital landscapes, Dopebase emerges as a revolutionary open-source app builder platform, positioned as a formidable alternative to WordPress. Engineered with the contemporary developer in mind, it offers a canvas that is both expansive and intuitive, ready to facilitate your most ambitious projects. Here is why Dopebase stands a cut above the rest:

- **Scalable Websites and Blogs**: Create adaptable websites and blogs that grow with your ambitions. From personal blogs to large-scale corporate websites, Dopebase supports it all, ensuring that your platform can handle the influx of traffic as it scales.

- **Innovative SaaS Products**: Build SaaS products of the future, today. Dopebase offers a conducive environment to foster innovation, allowing you to craft SaaS products that meet the evolving needs of the market, always staying a step ahead of the competition.

- **AI Agents at Your Fingertips**: Leverage the power of artificial intelligence to create AI agents capable of transforming user experiences. Dopebase nurtures a space where technology meets creativity, enabling the development of AI agents that are not just responsive but intuitively understand user needs.

- **Cross-Platform Mobile Apps**: Develop mobile apps that resonate with your audience, across all platforms. Whether it is Android or iOS, Dopebase ensures a seamless transition, providing tools that empower developers to create apps that offer a unified user experience across all platforms.

**Dive Deeper with Dopebase**

Join a community of forward-thinking developers who are leveraging Dopebase to bring their visions to life. With a rich feature set and a robust framework at your disposal, the potential is limitless. Build with Dopebase, and craft digital experiences that are not just modern but monumental, reshaping the digital landscape one creation at a time.

[Get Started with Dopebase](https://dopebase.com) | [Explore Features](https://dopebase.com)

# Project Setup Guide

Welcome to the project! This guide will walk you through installing and setting up everything you need to get started.

## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (Recommended: Latest LTS version) - [Download here](https://nodejs.org/)
- **PostgreSQL** (Database) - [Download here](https://www.postgresql.org/download/)
- **PgAdmin** (Optional but useful for database management) - [Download here](https://www.pgadmin.org/download/)
- **Git** (Version Control) - [Download here](https://git-scm.com/downloads)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_PROJECT_NAME.git
cd YOUR_PROJECT_NAME
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup PostgreSQL Database

1. **Install PostgreSQL** if you haven’t already.
2. Open **PgAdmin** and create a new database:
   - Name: `your_database_name`
   - Username: `your_postgres_username` (default: `postgres`)
   - Password: `your_secure_password`
3. Check your PostgreSQL port (default: `5432`). If changed, note the new port.
4. Ensure PostgreSQL is running.

### 4. Create a `.env` File

Create a `.env` file in the project root and add the following:

```env
DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@localhost:<PORT>/<DATABASE_NAME>"
GITHUB_APP_CLIENT_ID=<YOUR_GITHUB_CLIENT_ID>
GITHUB_APP_CLIENT_SECRET=<YOUR_GITHUB_CLIENT_SECRET>
NEXTAUTH_URL=http://localhost:3000
```

- Replace `<USERNAME>` with your PostgreSQL username.
- Replace `<PASSWORD>` with your database password.
- Replace `<PORT>` with your PostgreSQL port (default is `5432`).
- Replace `<DATABASE_NAME>` with the name of your database.
- Replace `<YOUR_GITHUB_CLIENT_ID>` and `<YOUR_GITHUB_CLIENT_SECRET>` with values from your GitHub OAuth app (found in GitHub Developer settings).

### 5. Run Database Migrations 

Since dopebase uses Prisma or another ORM, run migrations:

```bash
npx prisma migrate dev
```

### 6. Start the Development Server

```bash
npm run dev
```

Your project should now be running at [http://localhost:3000](http://localhost:3000) 🎉.

## Additional Notes

- If you encounter database connection issues, ensure PostgreSQL is running and your `.env` file is correctly configured.
- If GitHub authentication is not working, verify your Client ID and Secret in the GitHub Developer settings.

Enjoy coding!

