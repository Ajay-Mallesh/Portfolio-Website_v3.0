# 🔐 Admin Login Troubleshooting Guide

## Problem: Login is stuck on "Logging in..."

### ✅ Step 1: Verify Supabase Configuration

First, check if your `.env` file has the correct Supabase credentials:

```bash
# Check if .env file exists and has content
type .env
```

Your `.env` file should contain:
```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

❌ **If missing or empty**: 
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy your Project URL and Anon Key
5. Add them to `.env` file
6. Restart your dev server (`npm run dev`)

---

### ✅ Step 2: Verify Supabase Admin Table Exists

Your Supabase project needs an `admin` table with users.

**Check if the table exists:**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to SQL Editor
4. Run this query to check:

```sql
SELECT * FROM admin LIMIT 1;
```

❌ **If you get "relation 'admin' does not exist"**:
Follow these steps to create it.

---

### ✅ Step 3: Create the Admin Table (If It Doesn't Exist)

Go to your Supabase SQL Editor and run this:

```sql
-- Create admin table
CREATE TABLE admin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Allow users to read their own role
CREATE POLICY "Users can read their own role"
  ON admin
  FOR SELECT
  USING (auth.email() = email);

-- Grant permissions
ALTER TABLE admin OWNER TO postgres;
GRANT SELECT ON admin TO anon, authenticated;
```

---

### ✅ Step 4: Create an Admin User

After creating the table, you need to add admin users:

**Option A: Using Supabase Auth (Recommended)**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Authentication → Users
4. Click "Add User"
5. Enter email and password
6. Click "Create User"
7. Copy the email

**Option B: Using SQL (If User Already Exists in Auth)**

In Supabase SQL Editor, run:

```sql
INSERT INTO admin (email, role)
VALUES ('your-email@example.com', 'admin');
```

**Example:**
```sql
INSERT INTO admin (email, role)
VALUES ('admin@example.com', 'admin');
```

---

### ✅ Step 5: Test the Login

1. Go to http://localhost:5173/admin-login
2. Enter the email and password you created
3. Click Login

❌ **Still not working?** Continue to Step 6.

---

### ✅ Step 6: Check Supabase Auth Configuration

Make sure Supabase Authentication is enabled:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Authentication → Providers
4. Ensure "Email" provider is enabled (should be by default)

---

### ✅ Step 7: Check Browser Console for Errors

1. Open your browser's Developer Tools (F12)
2. Go to Console tab
3. Try to login again
4. Look for error messages

**Common errors:**

| Error | Solution |
|-------|----------|
| `"Invalid login credentials"` | Wrong email or password. Try again or reset password. |
| `"Supabase URL not set"` | Check `.env` file has `VITE_SUPABASE_URL` |
| `"Anon key not set"` | Check `.env` file has `VITE_SUPABASE_ANON_KEY` |
| `"relation 'admin' does not exist"` | Create the admin table using SQL above |
| `"CORS error"` | Check Supabase project URL is correct in `.env` |

---

### ✅ Step 8: Restart Dev Server

After making any changes, restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🔍 Complete Verification Checklist

- [ ] `.env` file exists with Supabase URL and Anon Key
- [ ] Supabase project is active and accessible
- [ ] `admin` table exists in Supabase
- [ ] Admin user exists in both Auth and `admin` table
- [ ] User can log in to Supabase dashboard with their email/password
- [ ] RLS policies are set up correctly on `admin` table
- [ ] Dev server restarted after changes
- [ ] Browser console shows no errors
- [ ] Tried with correct email and password

---

## 🚀 Quick Setup (Full Process)

If you want to start fresh, follow this complete process:

### 1. Create Supabase Project
```bash
# Go to https://app.supabase.com
# Click "New Project"
# Fill in project details
# Copy URL and Anon Key
```

### 2. Update `.env` file
```bash
# Edit .env in root directory
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### 3. Create Admin Table
```bash
# In Supabase SQL Editor, run:
CREATE TABLE admin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text DEFAULT 'admin',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own role"
  ON admin
  FOR SELECT
  USING (auth.email() = email);
```

### 4. Create Admin User
```bash
# In Supabase:
# 1. Go to Authentication → Users
# 2. Click "Add User"
# 3. Enter email and password
# 4. Click "Create User"

# Then in SQL Editor:
INSERT INTO admin (email, role)
VALUES ('your-email@example.com', 'admin');
```

### 5. Restart Dev Server
```bash
npm run dev
```

### 6. Test Login
```bash
# Go to http://localhost:5173/admin-login
# Enter your email and password
# Click Login
```

---

## ❓ Still Having Issues?

### Check Database Connection
```sql
-- In Supabase SQL Editor, run:
SELECT * FROM admin;
```

If you see your email, the database is fine.

### Check Auth Service
```sql
-- In Supabase SQL Editor, run:
SELECT id, email, created_at FROM auth.users;
```

If you see your user, authentication is fine.

### Enable Debug Logging
Edit `src/contexts/AuthContext.tsx` and add this to see what's happening:

```typescript
const login = async (email: string, password: string) => {
  console.log('Attempting login with:', email);
  setLoading(true);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  console.log('Login response:', { data, error });
  setLoading(false);
  if (!error) {
    await fetchRole(email);
    return { error: null };
  }
  return { error: error.message };
};
```

---

## 📞 Support Resources

| Resource | Purpose |
|----------|---------|
| [Supabase Docs](https://supabase.com/docs) | Official documentation |
| [Supabase Dashboard](https://app.supabase.com) | Manage your project |
| [Browser Console (F12)](about:blank) | View error messages |
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Full setup guide |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Project setup guide |

---

## ✅ Once Login Works

After successful login:
1. You'll be redirected to `/admin-dashboard`
2. You'll see admin CRUD buttons on all pages
3. You can edit/delete content from the site

**Congratulations!** Your admin login is now working! 🎉

---

**Last Updated**: January 9, 2026
