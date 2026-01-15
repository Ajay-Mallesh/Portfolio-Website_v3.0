# Architecture & Data Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Frontend (React)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Index.tsx (Home Page)                                          │
│  ├─ Profile Image Section                                       │
│  │  └─ useProfileImage Hook                                     │
│  │     ├─ Display: Shows primary image or initials              │
│  │     └─ Upload: JPEG/PNG files to storage                     │
│  │                                                               │
│  ├─ Technical Skills Section                                    │
│  │  └─ useTechnicalSkills Hook                                  │
│  │     ├─ Display: List all skills with levels                  │
│  │     └─ CRUD: Add/Delete skills                               │
│  │                                                               │
│  ├─ Other Skills Section                                        │
│  │  └─ useOtherSkills Hook                                      │
│  │     ├─ Display: List all skills with levels                  │
│  │     └─ CRUD: Add/Delete skills                               │
│  │                                                               │
│  └─ Resume Section                                              │
│     └─ useResume Hook                                           │
│        ├─ Display: List resumes with links                      │
│        └─ Upload: PDF/Word files to storage                     │
│                                                                   │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ API Calls via Supabase Client
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│                    Supabase Backend                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PostgreSQL Database                                            │
│  ├─ profile_image Table                                         │
│  │  ├─ Columns: id, image_url, image_type, file_name, is_primary
│  │  └─ Indexed on: is_primary, created_at                       │
│  │                                                               │
│  ├─ technical_skills Table                                      │
│  │  ├─ Columns: id, name, level, category, created_at          │
│  │  └─ Indexed on: name (unique), level                         │
│  │                                                               │
│  └─ other_skills Table                                          │
│     ├─ Columns: id, name, level, category, created_at          │
│     └─ Indexed on: name (unique), level                         │
│                                                                   │
│  Storage Buckets                                                │
│  ├─ /profile-images/                                            │
│  │  └─ Stores: JPEG, PNG profile photos (max 5MB)              │
│  │                                                               │
│  └─ /resumes/                                                   │
│     └─ Stores: PDF, Word documents                              │
│                                                                   │
│  Security (Row-Level Security)                                  │
│  ├─ All tables: Public read, Authenticated write                │
│  ├─ All buckets: Public read, Authenticated upload              │
│  └─ Enforced via RLS policies at database level                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Profile Image Upload Flow

```
Admin User clicks image edit button
         │
         ▼
┌────────────────────────────┐
│ Profile Image Dialog Opens │
└────────────┬───────────────┘
             │
             ▼
    ┌──────────────────┐
    │ Choose file      │ ◄─── File picker input
    │ (JPEG/PNG, <5MB) │      
    └────────┬─────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ handleProfileImageFileUpload()      │
│ ┌───────────────────────────────┐   │
│ │ Validate file format & size   │   │
│ │ Upload to 'profile-images'    │   │
│ │ Get public URL                │   │
│ │ Display image preview         │   │
│ └───────────────────────────────┘   │
└────────────┬────────────────────────┘
             │
             ▼ User clicks "Add Profile Image"
┌─────────────────────────────────────┐
│ handleSaveProfileImage()            │
│ ┌───────────────────────────────┐   │
│ │ Save to profile_image table   │   │
│ │ Set as primary if first image │   │
│ │ Update local state            │   │
│ └───────────────────────────────┘   │
└────────────┬────────────────────────┘
             │
             ▼
   ┌─────────────────────┐
   │ Image displays in   │
   │ profile section     │
   │ (circular avatar)   │
   └─────────────────────┘
```

### 2. Skills CRUD Flow

```
Admin clicks + button in Skills section
         │
         ▼
┌──────────────────────────┐
│ Skills Dialog Opens      │
└────────────┬─────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Enter Skill Details:   │
    │ - Name                 │
    │ - Level (1-10 slider)  │
    │ - Category (dropdown)  │
    └────────────┬───────────┘
                 │
                 ▼ User clicks "Add Skill"
      ┌──────────────────────────┐
      │ handleSaveTechnicalSkill │ or handleSaveOtherSkill
      │ ┌──────────────────────┐ │
      │ │ Validate skill name  │ │
      │ │ Call createSkill()   │ │
      │ │ Insert to database   │ │
      │ │ Update UI state      │ │
      │ └──────────────────────┘ │
      └────────────┬─────────────┘
                   │
                   ▼
   ┌─────────────────────────┐
   │ Skill appears in list   │
   │ User can delete on hover│
   └─────────────────────────┘

Delete Flow:
    User hovers over skill & clicks trash icon
                │
                ▼
   ┌─────────────────────────┐
   │ handleDeleteSkill()     │
   │ ┌───────────────────┐   │
   │ │ Delete from DB    │   │
   │ │ Update UI state   │   │
   │ └───────────────────┘   │
   └────────────┬────────────┘
                │
                ▼
   ┌─────────────────────────┐
   │ Skill removed from list │
   └─────────────────────────┘
```

### 3. Resume Upload Flow

```
Admin clicks "Download CV" button
         │
         ▼
┌──────────────────────────┐
│ Resume Dialog Opens      │
└────────────┬─────────────┘
             │
             ▼
    ┌────────────────────┐
    │ Select Resume Type │  PDF File / Word Document / Link
    └────────────┬───────┘
                 │
                 ├─ Link
                 │   └─ Paste URL
                 │
                 └─ PDF/Word File
                     │
                     ▼ Choose file
         ┌──────────────────────────┐
         │ handleProfileImageUpload │
         │ (uses uploadResumeFile)  │
         │ ┌────────────────────┐   │
         │ │ Upload to 'resumes'│   │
         │ │ Get public URL     │   │
         │ └────────────────────┘   │
         └────────────┬─────────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │ Set as Primary (checkbox)│
         └────────────┬─────────────┘
                      │
                      ▼ Click "Add Resume"
         ┌──────────────────────────┐
         │ handleSaveResume()       │
         │ ┌────────────────────┐   │
         │ │ Save to DB         │   │
         │ │ Update primary     │   │
         │ └────────────────────┘   │
         └────────────┬─────────────┘
                      │
                      ▼
   ┌────────────────────────────┐
   │ Resume added to list       │
   │ Can download or delete     │
   └────────────────────────────┘
```

## Database Relationships

```
profile_image
├─ id (PK)
├─ image_url (TEXT)
├─ image_type (jpeg|png|link)
├─ file_name (TEXT)
├─ is_primary (BOOLEAN) ◄─── Only ONE primary at a time
└─ created_at (TIMESTAMP)

technical_skills
├─ id (PK)
├─ name (TEXT) ◄─── UNIQUE constraint
├─ level (1-10)
├─ category (TEXT)
└─ created_at (TIMESTAMP)

other_skills
├─ id (PK)
├─ name (TEXT) ◄─── UNIQUE constraint
├─ level (1-10)
├─ category (TEXT)
└─ created_at (TIMESTAMP)
```

## Hook Integration Points

```
Index.tsx Component
│
├─ useProfileImage()
│  ├─ images[] ◄─── Display in profile section
│  ├─ fetchImages() ◄─── Load on mount
│  ├─ createImage() ◄─── Save new image
│  ├─ deleteImage() ◄─── Delete image
│  └─ uploadImageFile() ◄─── Upload file to storage
│
├─ useTechnicalSkills()
│  ├─ skills[] ◄─── Display in skills grid
│  ├─ fetchSkills() ◄─── Load on mount
│  ├─ createSkill() ◄─── Add skill
│  └─ deleteSkill() ◄─── Remove skill
│
├─ useOtherSkills()
│  ├─ skills[] ◄─── Display in skills grid
│  ├─ fetchSkills() ◄─── Load on mount
│  ├─ createSkill() ◄─── Add skill
│  └─ deleteSkill() ◄─── Remove skill
│
└─ useResume()
   ├─ resumes[] ◄─── Display resume list
   ├─ fetchResumes() ◄─── Load on mount
   ├─ createResume() ◄─── Add resume
   └─ uploadResumeFile() ◄─── Upload file to storage
```

## State Management Structure

```
Home Component State
│
├─ Dialog Visibility States
│  ├─ showProfileImageDialog (boolean)
│  ├─ showTechnicalSkillsDialog (boolean)
│  └─ showOtherSkillsDialog (boolean)
│
├─ Form States
│  ├─ newProfileImageForm { image_url, image_type, file_name }
│  ├─ newTechnicalSkillForm { name, level, category }
│  └─ newOtherSkillForm { name, level, category }
│
├─ File Reference States
│  ├─ profileImageInputRef
│  └─ resumeFileInputRef
│
├─ Loading States
│  ├─ uploadingImage (boolean)
│  └─ uploadingResume (boolean)
│
└─ Hook State (from custom hooks)
   ├─ profileImages[] (from useProfileImage)
   ├─ technicalSkillsDB[] (from useTechnicalSkills)
   └─ otherSkillsDB[] (from useOtherSkills)
```

## Security Layers

```
┌──────────────────────────────────────────────┐
│         Application Level Security           │
├──────────────────────────────────────────────┤
│  if (role === "admin") {                    │
│    Show CRUD buttons                         │
│    Allow file uploads                        │
│  }                                           │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│    Supabase Client Configuration             │
├──────────────────────────────────────────────┤
│  - Sign up / Login via AuthContext          │
│  - Session token included in requests        │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│   Row Level Security (RLS) Policies          │
├──────────────────────────────────────────────┤
│  SELECT: ✓ Public read access               │
│  INSERT: ✓ Authenticated users only         │
│  UPDATE: ✓ Authenticated users only         │
│  DELETE: ✓ Authenticated users only         │
└──────────────────────────────────────────────┘
```

## File Upload Flow Diagram

```
User Selects File
       │
       ▼
┌──────────────────┐
│ Validation Layer │────────────┬─────────────┐
│ - File type      │            │             │
│ - File size      │        PASS  │          FAIL
│ - File name      │            ▼             │
└──────────────────┘   ┌────────────────┐    │
                       │ Supabase Upload│    │
                       │ - Encrypt      │    │
                       │ - Store        │    │
                       │ - Generate URL │    │
                       └────────┬───────┘    │
                                │            │
                                ▼            ▼
                        ┌──────────────┐  ┌──────────────┐
                        │ Save to DB   │  │ Show Error   │
                        │ Display URL  │  │ Toast        │
                        └──────────────┘  └──────────────┘
```

## Component Hierarchy

```
Layout
└─ Home (Index.tsx)
   ├─ Hero Section
   │  └─ Profile Image (with upload dialog)
   │
   ├─ Skills Section
   │  ├─ Technical Skills Container
   │  │  ├─ SkillBar components
   │  │  └─ Add Dialog
   │  │
   │  └─ Other Skills Container
   │     ├─ SkillBar components
   │     └─ Add Dialog
   │
   ├─ Resume Section
   │  └─ Resume Management Dialog
   │
   └─ Dialogs
      ├─ ProfileImageDialog
      ├─ TechnicalSkillsDialog
      ├─ OtherSkillsDialog
      └─ DeleteConfirmationDialog
```

