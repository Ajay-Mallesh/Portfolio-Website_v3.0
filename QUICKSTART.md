# 🎯 Getting Started - Quick Reference

## First Time Here? 👋

Welcome to the Portfolio project! Here's the fastest way to get up and running.

---

## ⚡ 5-Minute Quick Start

### For Users (Want to see the website)
```bash
npm install
npm run dev
```
Then open http://localhost:5173 in your browser.

### For Developers (Want to work on code)
```bash
npm install
npm run dev
```
Then start editing files in `src/` folder. Changes auto-reload.

### For Production (Want to deploy)
```bash
npm run build
npm run preview
```
Deploy the `dist/` folder to Vercel, Netlify, or any static host.

---

## 📚 Documentation Roadmap

**Choose your path based on what you need:**

### 🚀 "Get it running quickly"
1. Run the 5-minute start above
2. Skip to next section

### 🛠️ "Set up the database"
1. Read [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. Create Supabase account and project
3. Run the SQL scripts in the guide
4. Add environment variables to `.env.local`

### 👨‍💻 "Understand the code"
1. Read [INDEX.md](./INDEX.md) for navigation
2. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for structure
3. Review `src/pages/*.tsx` files
4. Check component structure in `src/components/`

### 🎨 "Customize the design"
1. Check color scheme in [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md#-design-implementation)
2. Edit colors in component files
3. Update `tailwind.config.ts` if needed

### 📦 "Deploy to production"
1. Complete the Supabase setup
2. Read [SETUP_GUIDE.md](./SETUP_GUIDE.md#deployment) - Deployment section
3. Follow platform-specific instructions

### 🔑 "Set up admin access"
1. Read [SUPABASE_SETUP.md](./SUPABASE_SETUP.md#7-admin-table-if-not-exists)
2. Create admin table and add users
3. Test login at `/admin-login`

### ➕ "Add a new feature"
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md#adding-a-new-content-type)
2. Review existing page (e.g., `Projects.tsx`)
3. Follow the same pattern

---

## 📖 Complete Documentation Index

| Document | Best For | Time |
|----------|----------|------|
| [INDEX.md](./INDEX.md) | Navigation & overview | 5 min |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Understanding features | 10 min |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Installation & development | 20 min |
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Database configuration | 30 min |
| [HOOKS_GUIDE.md](./HOOKS_GUIDE.md) | Custom hooks reference | 15 min |
| [COMPLETION_CHECKLIST.md](./COMPLETION_CHECKLIST.md) | What's done & what's next | 5 min |

---

## 🎯 Typical User Journeys

### "Just want to see the website"
```
1. npm install
2. npm run dev
3. Open http://localhost:5173
4. Browse the website
5. Done! ✅
```

### "Want to customize the content"
```
1. npm install
2. npm run dev
3. Open Projects.tsx, Experience.tsx, etc.
4. Edit the hardcoded data arrays
5. Changes auto-reload 🔄
6. npm run build for production ✅
```

### "Want full database integration"
```
1. Create Supabase account
2. Follow SUPABASE_SETUP.md
3. Add environment variables
4. Data auto-loads from database ✅
5. Admin CRUD operations work! ✅
```

### "Want to deploy to production"
```
1. Complete Supabase setup
2. npm run build
3. Deploy dist/ folder to Vercel/Netlify
4. Add environment variables in platform settings
5. Website is live! 🚀
```

---

## 🔍 Need Help With Something Specific?

### Colors are wrong
→ Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md#-color-scheme)
→ Edit Tailwind classes in `src/components/`

### Can't login as admin
→ Check admin table in Supabase
→ Read [SUPABASE_SETUP.md](./SUPABASE_SETUP.md#7-admin-table-if-not-exists)

### Data not saving
→ Make sure Supabase is set up
→ Check environment variables in `.env.local`
→ Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### Want to add new content type
→ Follow pattern in [SETUP_GUIDE.md](./SETUP_GUIDE.md#adding-a-new-content-type)
→ Look at `Projects.tsx` for example
→ Create custom hook using existing ones as template

### Get Supabase connection error
→ Read Troubleshooting in [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)
→ Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md#troubleshooting)

---

## 📁 Quick File Reference

### Pages (in src/pages/)
- **Index.tsx** - Home page
- **Projects.tsx** - Projects with admin CRUD
- **ProjectDetails.tsx** - Single project details
- **Experience.tsx** - Work experience
- **Certifications.tsx** - Certifications
- **Internships.tsx** - Internships
- **Contact.tsx** - Contact form + messages
- **AdminLogin.tsx** - Admin login

### Components (in src/components/)
- **Navbar.tsx** - Navigation
- **Footer.tsx** - Footer
- **Layout.tsx** - Main layout wrapper

### Hooks (in src/hooks/)
- **useProjects.ts** - Projects data
- **useExperiences.ts** - Experiences data
- **useCertifications.ts** - Certifications data
- **useInternships.ts** - Internships data
- **useMessages.ts** - Messages data
- **useSocialMedia.ts** - Social links data

---

## ⚙️ Configuration Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (create this) |
| `vite.config.ts` | Vite build settings |
| `tailwind.config.ts` | Tailwind CSS config |
| `tsconfig.json` | TypeScript config |
| `package.json` | Dependencies |

---

## 🚨 Common Issues & Solutions

### "Port 5173 already in use"
```bash
# Use a different port
npm run dev -- --port 3000
```

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### "Supabase URL required"
```bash
# Create .env.local with:
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### "Admin buttons not showing"
→ Not logged in as admin
→ Go to `/admin-login`
→ Check admin table in Supabase

---

## ✅ Checklist Before Going Live

- [ ] Supabase project created
- [ ] Database tables created
- [ ] Admin users added to admin table
- [ ] Environment variables set
- [ ] Tested locally with `npm run dev`
- [ ] Built for production with `npm run build`
- [ ] Deployed to hosting platform
- [ ] Environment variables added to hosting
- [ ] Website is accessible online
- [ ] Admin login works
- [ ] CRUD operations work

---

## 📞 Quick Links

| Need | Go To |
|------|-------|
| Full overview | [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) |
| Setup help | [SETUP_GUIDE.md](./SETUP_GUIDE.md) |
| Database setup | [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) |
| Hook reference | [HOOKS_GUIDE.md](./HOOKS_GUIDE.md) |
| Navigation | [INDEX.md](./INDEX.md) |
| Completion status | [COMPLETION_CHECKLIST.md](./COMPLETION_CHECKLIST.md) |

---

## 🎓 Learning Resources

### For React developers
- Review pages in `src/pages/` to see patterns
- Check hooks in `src/hooks/` for data management
- See components in `src/components/` for reusable patterns

### For TypeScript developers
- All files have proper type definitions
- Check interfaces at top of each file
- See `src/hooks/` for hook type patterns

### For Tailwind CSS developers
- Colors are defined at top of components
- See [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for color scheme
- Check existing components for patterns

### For backend developers
- See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for schemas
- Check [HOOKS_GUIDE.md](./HOOKS_GUIDE.md) for API patterns
- Review `src/lib/supabaseClient.ts` for client setup

---

## 🚀 Ready to Start?

1. **Have 5 minutes?** → Run `npm install && npm run dev`
2. **Have 30 minutes?** → Read PROJECT_SUMMARY.md
3. **Have an hour?** → Follow SETUP_GUIDE.md
4. **Need database?** → Follow SUPABASE_SETUP.md
5. **Ready to deploy?** → Check SETUP_GUIDE.md Deployment

---

## ✨ You're All Set!

Everything is installed, documented, and ready to use.
Start building! 🎉

---

**Questions?** Check the appropriate documentation file above.
**Getting started?** Run `npm install && npm run dev`!
**Need help?** All answers are in the documentation files!

---

**Last Updated**: January 9, 2026
**Project Status**: ✅ Complete and Ready
