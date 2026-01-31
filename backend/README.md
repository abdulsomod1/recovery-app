# Crypto Wallet Backend

A NestJS-based backend for a crypto wallet application with PostgreSQL and Prisma.

## Features

- User authentication with JWT
- Wallet management
- Transaction handling
- Admin panel functionality
- PostgreSQL database with Prisma ORM

## Installation

```bash
$ npm install
```

## Database Setup

1. Install PostgreSQL and create a database
2. Update the `DATABASE_URL` in `.env` file
3. Run database migrations:

```bash
$ npx prisma migrate dev
$ npx prisma generate
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Wallets
- `GET /wallets` - Get user wallets
- `POST /wallets` - Create new wallet
- `GET /wallets/:id` - Get wallet details

### Transactions
- `GET /transactions` - Get user transactions
- `POST /transactions` - Create transaction
- `GET /transactions/:id` - Get transaction details

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

This project is [MIT licensed](LICENSE).
