# 🔐 Admin User Setup Guide (Custom Authentication)

Your project uses a custom authentication system with your `admin` table. Here's how to set up admin users.

## Step 1: Generate SHA256 Password Hash

Your passwords are stored as SHA256 hashes. You need to generate a hash for your password.

### Using Node.js (Recommended)

Create a small script to generate the hash:

```javascript
// hash-password.js
const crypto = require('crypto');

const password = 'your-password-here'; // Change this to your desired password
const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('Password:', password);
console.log('Hash:', hash);
```

Run it:
```bash
node hash-password.js
```

This will output your SHA256 hash. Copy the hash value.

### Using an Online Tool (Not Recommended for Production)

If you don't want to use Node.js, you can use an online SHA256 generator:
https://www.tools.tinyrobot.com/sha256

⚠️ **Warning**: Only for development/testing. Never use online tools with real production passwords.

### Using Supabase SQL

You can also generate the hash directly in Supabase SQL Editor using the `pgcrypto` extension:

```sql
-- First, enable pgcrypto extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Generate SHA256 hash
SELECT encode(digest('your-password-here', 'sha256'), 'hex');
```

Copy the output - that's your hash.

---

## Step 2: Add Admin User to Database

Go to your Supabase SQL Editor and run this command:

```sql
INSERT INTO public.admin (email, password_hash, role)
VALUES ('your-email@example.com', 'your-hash-here', 'admin');
```

**Example:**
```sql
INSERT INTO public.admin (email, password_hash, role)
VALUES ('admin@example.com', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'admin');
```

---

## Step 3: Test Login

1. Go to `http://localhost:5173/admin-login`
2. Enter your email: `admin@example.com`
3. Enter your password: `your-password` (the plain text password you hashed)
4. Click **Login**

✅ You should be logged in and redirected to the admin dashboard!

---

## Creating Multiple Admin Users

Repeat the process for each admin:

```sql
-- User 1
INSERT INTO public.admin (email, password_hash, role)
VALUES ('admin1@example.com', 'hash-here', 'admin');

-- User 2
INSERT INTO public.admin (email, password_hash, role)
VALUES ('admin2@example.com', 'hash-here', 'admin');
```

---

## Changing an Admin Password

1. Generate a new SHA256 hash for the new password
2. Run this SQL:

```sql
UPDATE public.admin
SET password_hash = 'new-hash-here'
WHERE email = 'admin@example.com';
```

---

## Resetting a Forgotten Password

If you forgot the password:

1. Generate a new SHA256 hash
2. Update the database with the SQL above

There's no "recovery" email since this is custom auth.

---

## Common Issues

### "Invalid email or password" error

**Check these things:**

1. **Email is correct?**
   ```sql
   SELECT email FROM public.admin;
   ```
   Make sure your email matches exactly (case-sensitive).

2. **Password hash is correct?**
   ```sql
   SELECT email, password_hash FROM public.admin;
   ```
   Verify the hash matches what you generated.

3. **Using the plain text password?**
   - In the login form, enter your **plain text password** (not the hash)
   - The app will hash it and compare with the stored hash

### SHA256 hash is case-sensitive

Make sure you copy the entire hash correctly. A single character difference will fail.

---

## Security Notes

### ✅ Good Practices
- Use a strong, unique password (12+ characters, mix of letters, numbers, symbols)
- Store real passwords securely (use password manager)
- Don't share hashes or passwords
- Use HTTPS in production

### ⚠️ Issues with SHA256 for Passwords
- SHA256 without salt is weak against rainbow table attacks
- Consider adding a salt or using bcrypt for production
- This setup is fine for development/small projects

### 🔒 Improving Security

For production, consider:

1. **Add salt to passwords:**
   ```sql
   -- Add salt column
   ALTER TABLE public.admin ADD COLUMN password_salt text;
   
   -- Store: SHA256(password + salt)
   ```

2. **Use bcrypt library:**
   ```bash
   npm install bcryptjs
   ```
   Then update AuthContext to use bcrypt hashing.

---

## Password Generation Helper

Here's a complete Node.js script to generate hashes:

```javascript
// setup-admin.js
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

rl.question('Enter email: ', (email) => {
  rl.question('Enter password: ', (password) => {
    const hash = hashPassword(password);
    console.log('\n--- SQL to insert ---');
    console.log(`INSERT INTO public.admin (email, password_hash, role)`);
    console.log(`VALUES ('${email}', '${hash}', 'admin');`);
    console.log('\n--- Details ---');
    console.log(`Email: ${email}`);
    console.log(`Password (plain): ${password}`);
    console.log(`Hash (SHA256): ${hash}`);
    rl.close();
  });
});
```

Run it:
```bash
node setup-admin.js
```

---

## Verify Login is Working

After setting up an admin user:

1. **Test login:**
   ```
   URL: http://localhost:5173/admin-login
   Email: your-email@example.com
   Password: your-password
   ```

2. **Check browser console (F12)** for any error messages

3. **Verify you see admin buttons** on pages like:
   - Projects page (edit/delete buttons)
   - Certifications page (admin CRUD)
   - Contact page (messages table)

4. **Check localStorage:**
   ```javascript
   // In browser console (F12):
   localStorage.getItem('admin_user')
   ```
   Should show your admin user object.

---

## Database Queries for Debugging

```sql
-- List all admin users
SELECT id, email, role, created_at FROM public.admin;

-- Check specific user
SELECT * FROM public.admin WHERE email = 'admin@example.com';

-- Update password
UPDATE public.admin SET password_hash = 'new-hash' WHERE email = 'admin@example.com';

-- Delete user
DELETE FROM public.admin WHERE email = 'admin@example.com';
```

---

## Next Steps

✅ Set up your first admin user (follow Step 1-3 above)
✅ Test login at `/admin-login`
✅ See admin CRUD buttons appear on pages
✅ Edit/delete content as admin

---

**Questions?** Check the browser console (F12) for detailed error messages!

---

**Last Updated**: January 9, 2026
