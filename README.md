
The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```
**Create Table in Supabase**
```sh
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE laws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT,
  country TEXT,
  category TEXT,
  author_id UUID REFERENCES profiles(id),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  law_id UUID REFERENCES laws(id),
  user_id UUID REFERENCES profiles(id),
  content TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  law_id UUID REFERENCES laws(id),
  user_id UUID REFERENCES profiles(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  law_id UUID REFERENCES laws(id),
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (law_id, user_id)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES profiles(id),
  type TEXT CHECK (type IN ('comment', 'moderation', 'like', 'update')),
  related_law_id UUID REFERENCES laws(id),
  is_read BOOLEAN DEFAULT FALSE,
  message TEXT,
  created_at TIMESTAMP DEFAULT now()
);


```


**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
