# The Wardrobe Studio – backend & admin panel

## Run locally

```
npm install
npm run dev
```

- Store: http://localhost:3000
- Admin panel: http://localhost:3000/admin
- API runs on port 7864 (Vite proxies `/api` and `/uploads` to it)

Settings live in `.env` (MongoDB URI, JWT secret, first admin login). On first start the server
creates the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` and imports the products and
categories from `src/data/products.ts` into MongoDB. After that, MongoDB is the source of truth.

## First steps in the admin panel

1. Log in with the admin email/password from `.env`, then change the password (Users → Edit).
2. **Settings → Razorpay**: paste Key ID + Key Secret, turn on "Accept online payments",
   click "Save & verify keys". Use `rzp_test_…` keys to try it, `rzp_live_…` for real payments.
3. **Settings → Email (SMTP)**: enter SMTP details (Gmail: smtp.gmail.com, port 587, an App
   Password) and click "Save & send test". Until SMTP works, sign-ups are auto-verified and no
   emails go out.

## Emails sent

| When | To |
| --- | --- |
| Sign up | Customer – verify email link |
| Email verified | Customer – thank-you / welcome |
| Forgot password | Customer – reset link |
| Order placed (COD/WhatsApp) or online payment confirmed | Customer – thank-you with order summary; admin alert (if set) |
| Admin changes order status | Customer – status update with tracking info |
| Customer cancels | Customer – cancellation notice |

## Production

The site now needs a Node.js server (Apache static hosting with `.htaccess` alone can't run the
API). On a VPS / Render / Railway / Hostinger Node hosting:

```
npm install
npm run build
npm start
```

`npm start` serves both the API and the built site from one port (`API_PORT` or `PORT`).
Set `APP_URL` in `.env` to your real domain so email links point to it, and set a long random
`JWT_SECRET`. Uploaded product images are stored in `uploads/`, so keep that folder between deploys.
