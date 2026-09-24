# bal er store

Professional e-commerce website for **TriZen Store** — premium tech & lifestyle products with bank transfer payments, full order management, and printable invoices.

## Features

- **Storefront**: Home, shop with search & categories, product pages, cart
- **Checkout**: Bank transfer payment with copyable bank details
- **Orders**: Place orders, order confirmation, track order by number + email
- **Admin Panel**: Dashboard, product management, order control, invoice printing
- **Invoices**: Professional printable invoices per order
- **Settings**: Configure bank details, shipping, tax, store info

## Quick Start

```bash
# Install dependencies
npm install

# Set up database
npx prisma db push
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: `admin@trizenstore.com`
- Password: `TriZen@2026`

Change credentials in `.env` before deploying to production.

## Admin Capabilities

| Section | What you can do |
|---------|-----------------|
| Dashboard | Revenue overview, recent orders |
| Orders | Filter by status, update status, payment ref, notes |
| Invoice | Print/download professional invoice |
| Products | Add new products |
| Settings | Bank account details, shipping, tax rate |

## Order Status Flow

1. **Pending Payment** — Customer placed order, awaiting bank transfer
2. **Payment Received** — Admin confirmed payment
3. **Processing** — Order being prepared
4. **Shipped** — Order dispatched
5. **Delivered** — Order completed

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- Prisma + SQLite
- Zustand (cart)

## Production

1. Set strong `JWT_SECRET` and `ADMIN_PASSWORD` in `.env`
2. Update bank details in Admin → Settings
3. Run `npm run build && npm start`
