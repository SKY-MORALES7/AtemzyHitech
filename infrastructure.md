# Dynamic Project Management Architecture & Infrastructure Guide
**Client**: Atemzy Hitech Engineering Services Ltd  
**Document**: `infrastructure.md`  
**Purpose**: Enable dynamic project publishing and real-time updates on the frontend without managing a complex backend server, while maintaining **Web3Forms** for zero-maintenance user form submissions.

---

## Executive Summary

Currently, project portfolio items are statically stored in `src/data/projects.js`.  
You can make projects **fully dynamic**—allowing your team to add new projects, upload photos, and edit deliverables from an intuitive visual dashboard—**without building, deploying, or paying for a heavy custom backend server**.

Your forms (Contact Desk and Quotation Requests) will **continue using Web3Forms**, ensuring seamless delivery to your corporate inbox with zero operational overhead.

---

## 3 Recommended Serverless / Headless Architectures

### Comparison Matrix

| Feature | **1. Supabase (Recommended)** | **2. Sanity.io / Strapi Cloud** | **3. Airtable / Google Sheets API** |
| :--- | :--- | :--- | :--- |
| **Best For** | Full relational control, built-in image CDN, instant REST API | Visual content editing & rich case studies | Simplest no-code spreadsheet experience |
| **Admin UI** | Sleek visual Table Editor (like an enhanced Excel with image uploads) | Visual Headless CMS Studio | Spreadsheet interface |
| **Setup Time** | ~15 minutes | ~25 minutes | ~10 minutes |
| **Cost** | Generous Free Tier (Up to 500MB DB, 1GB Storage) | Free Tier (Up to 20 users) | Free Tier |
| **Maintenance** | Zero (fully managed by Supabase) | Zero (fully managed) | Zero |
| **Web3Forms Compatibility** | 100% compatible | 100% compatible | 100% compatible |

---

## Recommended Architecture: Supabase + Vite React + Web3Forms

```
+-------------------------------------------------------------------+
|                        ATEMZY HITECH PLATFORM                     |
+-------------------------------------------------------------------+
                               |
            +------------------+------------------+
            |                                     |
            v                                     v
   [ Project Portfolio ]                 [ User Submissions ]
 (Dynamic Retrieval Flow)               (Web3Forms API Flow)
            |                                     |
            v                                     v
+------------------------+             +------------------------+
|   Supabase Database    |             |       Web3Forms        |
|  - 'projects' Table    |             |  - Contact Inquiries   |
|  - Storage CDN (Images)|             |  - RFQ & BOQ Uploads   |
+------------------------+             +------------------------+
            |                                     |
            v                                     v
  [Visual Admin Dashboard]             [Corporate Email Inbox]
   (Add/Edit Projects)                 (info@atemzyhitech.com)
```

---

## Step-by-Step Implementation Plan (Supabase)

### 1. Database Schema (`projects` table)

In your free [Supabase](https://supabase.com) project, run this SQL script in the SQL Editor (or create it using the visual Table Editor):

```sql
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  category text not null, -- 'Engineering Services', 'Construction', etc.
  location text not null,
  year text not null,
  status text not null default 'Completed',
  client text not null,
  image_url text not null,
  summary text not null,
  full_description text not null,
  deliverables jsonb default '[]'::jsonb,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable public read access (Frontend can read without auth)
alter table public.projects enable row level security;
create policy "Public projects are viewable by everyone" 
on public.projects for select using (true);
```

### 2. Connect to the Frontend (`corporateWeb`)

Install the lightweight official Supabase client:
```bash
npm install @supabase/supabase-js
```

Create `src/lib/supabaseClient.js`:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. Graceful Fallback Hook (`src/hooks/useProjects.js`)

To guarantee your website **never breaks** even if Supabase has network downtime or is being configured, use a resilient hook with fallback to the local `src/data/projects.js`:

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { projects as fallbackProjects } from '../data/projects';

export const useProjects = (selectedCategory = 'All Projects') => {
  const [projectsList, setProjectsList] = useState(fallbackProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          // Format DB rows to match application schema
          const formatted = data.map(item => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            category: item.category,
            location: item.location,
            year: item.year,
            status: item.status,
            client: item.client,
            image: item.image_url,
            summary: item.summary,
            fullDescription: item.full_description,
            deliverables: Array.isArray(item.deliverables) ? item.deliverables : [],
            featured: item.featured
          }));
          setProjectsList(formatted);
        }
      } catch (err) {
        console.warn('Using local projects fallback:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const filtered = selectedCategory === 'All Projects'
    ? projectsList
    : projectsList.filter(p => p.category === selectedCategory);

  return { projects: filtered, allProjects: projectsList, loading };
};
```

---

## How Your Team Adds New Projects

1. Log into your Supabase Dashboard on your phone, tablet, or PC.
2. Go to **Table Editor** > `projects`.
3. Click **Insert Row**.
4. Type in:
   - **Title**: *E.g., "Abuja Metro Highway Overpass Expansion"*
   - **Category**: Select *Construction*
   - **Image**: Upload image to the Supabase `project-media` bucket (or paste any CDN link).
   - **Deliverables**: *E.g., `["Pre-stressed concrete beams", "Pile foundation testing", "Drainage conduits"]`*
   - **Featured**: Check `true` to highlight on the homepage.
5. Click **Save**.
6. Refresh `atemzyhitech.com/projects`—your new project appears instantly with full modal case study and Brutalist card styling.

---

## Form Handling Isolation (Web3Forms)

Your current form workflow remains completely untouched:
- **`Contact.jsx`** uses `useFormSubmit('General Contact Enquiry')` which sends JSON directly to `https://api.web3forms.com/submit`.
- **`RequestQuote.jsx`** sends BOQ requests, project categories, and budget parameters directly through Web3Forms.
- **Benefits of this separation**:
  - No server maintenance or security patching required.
  - No database bloat from spam submissions.
  - Zero risk of database credential leaks through form endpoints.
