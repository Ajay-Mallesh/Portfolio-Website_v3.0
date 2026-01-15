# Custom Hooks - Quick Reference Guide

## Overview
Custom hooks for managing data with Supabase integration. Each hook provides CRUD operations, loading states, and error handling.

## useProjects

### Import
```tsx
import { useProjects } from '@/hooks/useProjects';
```

### Usage
```tsx
const {
  projects,                    // Project[]
  loading,                    // boolean
  error,                      // string | null
  fetchProjects,              // () => Promise<void>
  createProject,              // (data) => Promise<Project>
  updateProject,              // (id, data) => Promise<Project>
  deleteProject               // (id) => Promise<void>
} = useProjects();
```

### Example
```tsx
const handleCreateProject = async () => {
  try {
    await createProject({
      title: 'My Project',
      synopsis: 'Project description',
      techStack: ['React', 'TypeScript'],
      abstract: 'Detailed abstract',
      outcomes: 'Project outcomes',
      github: 'https://github.com/...',
      live: 'https://...'
    });
  } catch (error) {
    console.error(error);
  }
};
```

---

## useExperiences

### Import
```tsx
import { useExperiences } from '@/hooks/useExperiences';
```

### Usage
```tsx
const {
  experiences,              // Experience[]
  loading,                 // boolean
  error,                   // string | null
  createExperience,        // (data) => Promise<Experience>
  updateExperience,        // (id, data) => Promise<Experience>
  deleteExperience         // (id) => Promise<void>
} = useExperiences();
```

### Example
```tsx
await createExperience({
  company: 'Acme Corp',
  role: 'Full Stack Developer',
  type: 'Full-time',
  duration: 'Jan 2023 - Dec 2023',
  location: 'Remote',
  description: 'Built web applications',
  skills: ['React', 'Node.js', 'PostgreSQL'],
  achievements: ['Led team', 'Shipped feature']
});
```

---

## useCertifications

### Import
```tsx
import { useCertifications } from '@/hooks/useCertifications';
```

### Usage
```tsx
const {
  certifications,          // Certification[]
  loading,                // boolean
  error,                  // string | null
  createCertification,    // (data) => Promise<Certification>
  updateCertification,    // (id, data) => Promise<Certification>
  deleteCertification     // (id) => Promise<void>
} = useCertifications();
```

### Example
```tsx
await createCertification({
  title: 'AWS Certified Solutions Architect',
  provider: 'Amazon Web Services',
  date: 'December 2023',
  skills: ['AWS', 'Cloud Architecture'],
  credentialUrl: 'https://...',
  issuedTo: 'Your Name',
  issuedBy: 'AWS',
  expiryDate: 'December 2025'
});
```

---

## useInternships

### Import
```tsx
import { useInternships } from '@/hooks/useInternships';
```

### Usage
```tsx
const {
  internships,            // Internship[]
  loading,               // boolean
  error,                 // string | null
  createInternship,      // (data) => Promise<Internship>
  updateInternship,      // (id, data) => Promise<Internship>
  deleteInternship       // (id) => Promise<void>
} = useInternships();
```

### Example
```tsx
await createInternship({
  company: 'Tech Startup',
  role: 'Frontend Intern',
  duration: 'Jun 2022 - Aug 2022',
  location: 'San Francisco, CA',
  description: 'Developed React components',
  skills: ['React', 'CSS', 'JavaScript']
});
```

---

## useMessages

### Import
```tsx
import { useMessages } from '@/hooks/useMessages';
```

### Usage
```tsx
const {
  messages,              // Message[]
  loading,              // boolean
  error,                // string | null
  createMessage,        // (data) => Promise<Message>
  deleteMessage         // (id) => Promise<void>
} = useMessages();
```

### Example
```tsx
// Create message (from contact form)
await createMessage({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I would like to discuss...'
});

// Delete message (admin only)
await deleteMessage(messageId);
```

---

## useSocialMedia

### Import
```tsx
import { useSocialMedia } from '@/hooks/useSocialMedia';
```

### Usage
```tsx
const {
  socialLinks,           // SocialMedia[]
  loading,              // boolean
  error,                // string | null
  createSocialLink,     // (data) => Promise<SocialMedia>
  updateSocialLink,     // (id, data) => Promise<SocialMedia>
  deleteSocialLink      // (id) => Promise<void>
} = useSocialMedia();
```

### Example
```tsx
// Add social link
await createSocialLink({
  label: 'GitHub',
  href: 'https://github.com/yourname',
  icon_name: 'Github'
});

// Update social link
await updateSocialLink(linkId, {
  href: 'https://github.com/newname'
});

// Delete social link
await deleteSocialLink(linkId);
```

---

## Common Patterns

### Loading State
```tsx
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### Form Submission
```tsx
const handleSubmit = async (formData) => {
  try {
    await createProject(formData);
    // Reset form
    setFormData({});
    // Close modal
    setShowModal(false);
  } catch (error) {
    // Error already shown via toast
  }
};
```

### Delete with Confirmation
```tsx
const handleDelete = async (id) => {
  if (!confirm('Are you sure?')) return;
  try {
    await deleteProject(id);
  } catch (error) {
    // Error already shown via toast
  }
};
```

### Conditional Rendering
```tsx
{loading && <p>Loading...</p>}
{items.length === 0 && <p>No items found</p>}
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

---

## Error Handling

All hooks include built-in error handling:
- Errors are logged to console
- Toast notification shows error message
- Component receives error state
- Failed operations don't modify local state

### Example
```tsx
const { createProject, error } = useProjects();

try {
  await createProject(data);
} catch (err) {
  // Error already shown in toast
  // Can also access from error state
  console.log(error);
}
```

---

## Type Definitions

### Project
```tsx
interface Project {
  id: string;
  title: string;
  synopsis: string;
  abstract?: string;
  techStack: string[];
  github?: string;
  live?: string;
  outcomes?: string;
  created_at?: string;
}
```

### Experience
```tsx
interface Experience {
  id: string;
  company: string;
  role: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  duration: string;
  location: string;
  description: string;
  skills: string[];
  achievements?: string[];
  created_at?: string;
}
```

### Certification
```tsx
interface Certification {
  id: string;
  title: string;
  provider: string;
  date: string;
  skills: string[];
  credentialUrl?: string;
  issuedTo?: string;
  issuedBy?: string;
  expiryDate?: string;
  created_at?: string;
}
```

### Internship
```tsx
interface Internship {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string;
  skills: string[];
  created_at?: string;
}
```

### Message
```tsx
interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  created_at?: string;
}
```

### SocialMedia
```tsx
interface SocialMedia {
  id: string;
  label: string;
  href: string;
  icon_name: string;
  created_at?: string;
}
```

---

## Integration Steps

1. **Import the hook** in your component
2. **Destructure the values** you need
3. **Use the data** in your component
4. **Call the functions** for CRUD operations
5. **Handle loading/error states** for UX
6. **Test with Supabase** tables

---

## Troubleshooting

### Hook returns empty array
- Make sure Supabase table exists
- Check RLS policies allow SELECT
- Verify environment variables are set

### Error on create/update
- Validate all required fields
- Check table column names match
- Verify RLS policies allow INSERT/UPDATE

### Error on delete
- Make sure RLS policies allow DELETE
- Verify user has admin role

---

## Best Practices

1. ✅ Always check loading state before rendering lists
2. ✅ Provide error messages to users
3. ✅ Validate form data before submission
4. ✅ Use try-catch for error handling
5. ✅ Close modals after successful operations
6. ✅ Reset forms after submission
7. ✅ Confirm before delete operations
8. ✅ Provide toast feedback for all actions

---

**Last Updated**: January 9, 2026
