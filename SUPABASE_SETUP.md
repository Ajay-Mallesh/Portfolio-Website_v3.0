# Supabase Setup Guide for Portfolio

## Overview
This document provides instructions for setting up Supabase tables and connecting your portfolio application to the database.

## Required Environment Variables

Add these to your `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

### 1. Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  synopsis TEXT NOT NULL,
  abstract TEXT,
  techStack TEXT[] NOT NULL,
  github TEXT,
  live TEXT,
  outcomes TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### 2. Experiences Table

```sql
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Full-time', 'Part-time', 'Contract', 'Internship')),
  duration TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  achievements TEXT[],
  created_at TIMESTAMP DEFAULT now()
);
```

### 3. Certifications Table

```sql
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  date TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  credentialUrl TEXT,
  issuedTo TEXT,
  issuedBy TEXT,
  expiryDate TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### 4. Internships Table

```sql
CREATE TABLE internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  duration TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### 5. Messages Table

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### 6. Social Media Table

```sql
CREATE TABLE social_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### 7. Admin Table (if not exists)

```sql
CREATE TABLE admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT now()
);
```

## Row Level Security (RLS) Policies

### For public read (projects, experiences, certifications, internships, social_media)

```sql
-- Enable read access for all users
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert" ON projects
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Allow admin update" ON projects
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Allow admin delete" ON projects
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin'
  );
```

Repeat similar policies for: experiences, certifications, internships, social_media

### For messages (admin only)

```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to insert" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin to read" ON messages
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Allow admin to delete" ON messages
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'admin'
  );
```

## Using the Custom Hooks

### In Projects.tsx:

```tsx
import { useProjects } from '@/hooks/useProjects';

const Projects = () => {
  const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects();
  
  // Use these functions in your component...
};
```

### In Experience.tsx:

```tsx
import { useExperiences } from '@/hooks/useExperiences';

const Experience = () => {
  const { experiences, loading, error, createExperience, updateExperience, deleteExperience } = useExperiences();
  
  // Use these functions...
};
```

### In Certifications.tsx:

```tsx
import { useCertifications } from '@/hooks/useCertifications';

const Certifications = () => {
  const { certifications, loading, error, createCertification, updateCertification, deleteCertification } = useCertifications();
  
  // Use these functions...
};
```

### In Internships.tsx:

```tsx
import { useInternships } from '@/hooks/useInternships';

const Internships = () => {
  const { internships, loading, error, createInternship, updateInternship, deleteInternship } = useInternships();
  
  // Use these functions...
};
```

### In Contact.tsx:

```tsx
import { useMessages } from '@/hooks/useMessages';
import { useSocialMedia } from '@/hooks/useSocialMedia';

const Contact = () => {
  const { messages, loading: messagesLoading, deleteMessage } = useMessages();
  const { socialLinks, loading: socialLoading, createSocialLink, updateSocialLink, deleteSocialLink } = useSocialMedia();
  
  // Use these functions...
};
```

## Integration Checklist

- [ ] Create all database tables
- [ ] Set up RLS policies
- [ ] Add environment variables to `.env.local`
- [ ] Replace local state with custom hooks in Projects.tsx
- [ ] Replace local state with custom hooks in Experience.tsx
- [ ] Replace local state with custom hooks in Certifications.tsx
- [ ] Replace local state with custom hooks in Internships.tsx
- [ ] Replace local state with custom hooks in Contact.tsx
- [ ] Replace local state with custom hooks in ProjectDetails.tsx
- [ ] Test all CRUD operations
- [ ] Test admin authentication and authorization

## Troubleshooting

### Error: "VITE_SUPABASE_URL is required"
Make sure your `.env.local` file has the correct environment variables:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Error: "relation 'projects' does not exist"
Make sure you've created all the required tables in Supabase.

### Error: "new row violates row-level security policy"
Make sure the user is authenticated and has the correct role for the action they're trying to perform.

## Next Steps

After setting up the database:
1. Migrate all page components to use the custom hooks
2. Test all CRUD operations end-to-end
3. Set up file storage for project diagrams and certificates (optional)
4. Implement email notifications for new messages (optional)
