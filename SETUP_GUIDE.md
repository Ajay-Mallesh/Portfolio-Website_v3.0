# Portfolio Website - Complete Setup Guide

## Project Overview

A modern, professional portfolio website built with React, TypeScript, Vite, and Tailwind CSS featuring:

- **Professional Design**: Dark theme with emerald-400/cyan-400 gradient accents
- **Responsive Layout**: Mobile-optimized with Tailwind CSS
- **Admin Dashboard**: Integrated CRUD operations on the same pages (not separate dashboard)
- **Multiple Pages**: Home, Projects, Experience, Certifications, Internships, Contact, ProjectDetails
- **Authentication**: Supabase authentication with role-based access control
- **Real-time Updates**: Using React hooks with Supabase real-time capabilities (optional)

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **lucide-react** - Icons
- **shadcn/ui** - Component library
- **Sonner** - Toast notifications

### Backend & Database
- **Supabase** - Database, authentication, real-time
- **PostgreSQL** - Data storage

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Navbar.tsx      # Navigation bar
│   ├── Footer.tsx      # Footer component
│   └── ...
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   ├── Projects.tsx    # Projects listing
│   ├── ProjectDetails.tsx # Individual project details
│   ├── Experience.tsx  # Experience listing
│   ├── Certifications.tsx
│   ├── Internships.tsx
│   ├── Contact.tsx     # Contact form + messages admin
│   ├── AdminLogin.tsx  # Admin login
│   └── NotFound.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
│   ├── useProjects.ts      # Projects data management
│   ├── useExperiences.ts   # Experiences data management
│   ├── useCertifications.ts
│   ├── useInternships.ts
│   ├── useMessages.ts
│   ├── useSocialMedia.ts
│   └── use-mobile.tsx
├── lib/               # Utilities
│   ├── supabaseClient.ts
│   └── utils.ts
├── App.tsx            # Main app with routing
└── main.tsx           # Entry point
```

## Installation

### Prerequisites
- Node.js 16+ and npm
- Supabase account
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Portfolio_Lovable
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up Supabase database**
   - Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for creating tables and policies

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## Features

### User Features
- ✨ View portfolio, projects, experience, certifications, internships
- 📧 Send contact messages
- 🔗 Access to social media profiles
- 📱 Fully responsive design
- ⚡ Smooth animations and transitions

### Admin Features
- 🔐 Secure login with Supabase authentication
- ➕ Add/Edit/Delete projects
- ➕ Add/Edit/Delete experiences
- ➕ Add/Edit/Delete certifications
- ➕ Add/Edit/Delete internships
- 💬 View and manage contact messages
- 🔗 Manage social media links
- ✅ Role-based access control

## Design System

### Color Scheme
- **Primary Background**: `slate-900` (#0f172a)
- **Secondary Background**: `slate-800` (#1e293b)
- **Primary Accent**: `emerald-400` (#4ade80)
- **Secondary Accent**: `cyan-400` (#22d3ee)
- **Button Colors**: `emerald-600` (#16a34a), `cyan-600` (#0891b2)
- **Text Primary**: `white` (#ffffff)
- **Text Secondary**: `slate-300` (#cbd5e1)
- **Text Muted**: `slate-400` (#78716c)

### Typography
- **Headings**: Bold, 24-48px
- **Body**: Regular, 14-16px
- **Labels**: Medium, 12-14px

### Components
- **Cards**: `bg-slate-800/50` with `border-emerald-600/30`
- **Buttons**: Emerald or cyan with smooth transitions
- **Inputs**: `bg-slate-700/50` with focus states
- **Modals**: Dark overlay with slide-in animation

## Authentication

### Login Flow
1. Navigate to `/admin-login`
2. Enter email and password registered in Supabase
3. System checks `admin` table for role
4. If role is "admin", redirects to `/admin-dashboard` or individual pages
5. Admin CRUD buttons become visible on all content pages

### Role-Based Access
- Check `role === "admin"` in AuthContext
- Conditionally render admin features: `{role === 'admin' && <AdminButtons />}`

## CRUD Operations

### Pattern Used
All pages follow the same CRUD pattern:

1. **Create**: Click "Add [Item]" button → Open modal → Fill form → Save
2. **Read**: Data fetches on component mount
3. **Update**: Click edit icon → Open modal → Modify → Save
4. **Delete**: Click delete icon → Confirm → Remove from list

### Implementation
Each page uses a custom hook (`useProjects`, `useExperiences`, etc.) that handles:
- State management
- Supabase queries
- Error handling
- Toast notifications

## Supabase Integration

### Custom Hooks
Pre-built hooks for each content type:
- `useProjects` - Projects CRUD
- `useExperiences` - Experiences CRUD
- `useCertifications` - Certifications CRUD
- `useInternships` - Internships CRUD
- `useMessages` - Messages management
- `useSocialMedia` - Social links CRUD

### Usage Example
```tsx
const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
```

## Pages & Routes

| Route | Component | Features |
|-------|-----------|----------|
| `/` | Index.tsx | Home page with portfolio intro, education, skills |
| `/projects` | Projects.tsx | Project listing with admin CRUD |
| `/projects/:id` | ProjectDetails.tsx | Full project details with admin edit/delete |
| `/experience` | Experience.tsx | Work experience timeline with admin CRUD |
| `/certifications` | Certifications.tsx | Certifications grid with admin CRUD |
| `/internships` | Internships.tsx | Internships listing with admin CRUD |
| `/contact` | Contact.tsx | Contact form + admin messages view |
| `/admin-login` | AdminLogin.tsx | Admin authentication |
| `*` | NotFound.tsx | 404 page |

## Development Workflow

### Adding a New Content Type
1. Create Supabase table with fields and RLS policies
2. Create custom hook (e.g., `useSkills.ts`) in `src/hooks/`
3. Create page component in `src/pages/`
4. Add route to `App.tsx`
5. Import and use the hook in the page component
6. Add CRUD modals and buttons

### Styling
- Use Tailwind classes for responsive design
- Follow the color scheme (slate, emerald, cyan)
- Use Framer Motion for animations
- Test on mobile (use Tailwind's `md:` breakpoint)

### Type Safety
- Define TypeScript interfaces for data models
- Use strict mode in tsconfig
- Validate data before database operations

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically on push

### Deploy to Netlify
1. Build: `npm run build`
2. Deploy folder: `dist`
3. Add environment variables in Netlify dashboard

### Deploy to Supabase Storage
- Set up bucket for project images
- Update upload functions in components
- Update policies for read access

## Performance Optimizations

### Implemented
- Code splitting with React.lazy()
- Image optimization
- CSS minimization (Tailwind)
- Tree shaking with Vite

### Recommended
- Add React Query for caching
- Implement pagination for large lists
- Add image CDN (Cloudinary, Imgix)
- Set up Analytics (Supabase Analytics, Vercel Analytics)

## Security Best Practices

### Implemented
- Role-based access control (RLS)
- Secure authentication (Supabase Auth)
- Environment variable protection
- Input validation

### Recommended
- Add rate limiting for API calls
- Implement email verification
- Add CSRF protection
- Monitor admin activities
- Regular security audits

## Troubleshooting

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase Connection Issues
- Verify environment variables in `.env.local`
- Check Supabase project URL and anon key
- Ensure tables exist in database
- Check RLS policies are correct

### Authentication Issues
- Verify admin email in `admin` table
- Check if role is set to "admin"
- Clear browser cache and login again

### Styling Issues
- Run `npm run dev` and check console
- Verify Tailwind config in `tailwind.config.ts`
- Check for conflicting CSS classes

## Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test locally
3. Commit: `git commit -m "Add new feature"`
4. Push: `git push origin feature/new-feature`
5. Create Pull Request

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for database help
- Review component documentation in source files
- Check TypeScript types for API contracts

## Future Enhancements

- [ ] File upload for project diagrams/code samples
- [ ] Email notifications for contact form
- [ ] Blog system with markdown support
- [ ] Dark mode toggle
- [ ] Internationalization (i18n)
- [ ] Analytics dashboard
- [ ] SEO optimization
- [ ] Performance monitoring
- [ ] Comments on projects
- [ ] Like/Star projects functionality
