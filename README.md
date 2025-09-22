# WorkFlowX - Multi-Tenant SaaS Project Management Tool

**Author:** Jessie Borras  
**Website:** jessiedev.xyz

## Description

A Trello-style application designed for multiple organizations (tenants), each with its own isolated data and user base. This project demonstrates advanced multi-tenant architecture with complex authorization and data partitioning capabilities.

## Tech Stack

- **Frontend:** Next.js with TypeScript
- **Backend:** Node.js/Express
- **Database:** PostgreSQL with multi-tenant schema
- **Authentication:** JWT with tenant-aware authorization
- **Real-time:** Socket.io for live updates

## Features

- Multi-tenant architecture with complete data isolation
- Trello-style kanban boards with drag-and-drop functionality
- Role-based access control (RBAC) per tenant
- Real-time collaboration within tenant boundaries
- Tenant-specific customization and branding
- Scalable database schema with proper indexing

## Project Structure

```
Multi-Tenant SaaS Project Management Tool/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js/Express API server
├── database/          # PostgreSQL schema and migrations
├── shared/            # Shared types and utilities
└── docker/            # Docker configuration
```

## Getting Started

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up PostgreSQL database
4. Configure environment variables
5. Run database migrations
6. Start the development servers

## Multi-Tenant Architecture

This application implements a shared database, separate schema approach where:
- Each tenant has isolated data within the same database
- Tenant context is maintained throughout the request lifecycle
- Row-level security ensures data isolation
- Scalable design supports thousands of tenants

## License

MIT License# multi-tenant-saas-project-management-tool
