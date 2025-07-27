# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b89e363e-c755-40f0-ae59-6bd3c14b5ef6

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b89e363e-c755-40f0-ae59-6bd3c14b5ef6) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Set up environment variables (optional but recommended)
cp .env.example .env
# Edit .env file to match your setup if needed

# Step 4: Install the necessary dependencies.
npm i

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Important Notes for Multi-Device Access

This project is configured to work across different devices and networks:

- **Local Network Access**: The dev server runs on `0.0.0.0:8080`, allowing access from other devices on your network
- **Authentication URLs**: The app automatically detects the correct base URL for authentication redirects
- **Environment Variables**: You can set `VITE_BASE_URL` in your `.env` file to override the default URL detection

To access from another device on your network:
1. Run `npm run network-info` to see your local IP address
2. Open `http://YOUR_IP_ADDRESS:8080` in the other device's browser
3. For authentication, go to `http://YOUR_IP_ADDRESS:8080/auth`
4. Authentication will work correctly thanks to the dynamic URL detection

**Important:** Make sure to update your Supabase settings with the correct redirect URLs. See `SUPABASE_SETUP.md` for detailed instructions.

## Quick Commands

```sh
# Check your local network info
npm run network-info

# Start development server (accessible from network)
npm run dev

# Build for production
npm run build
```

## Troubleshooting Multi-Device Access

### Authentication Errors ("Failed to fetch")

If you get "Failed to fetch" errors when trying to sign in:

1. **Check Supabase Project Status**: 
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Verify your project `dkbumxunrjvsuwrtqcyd` is active and running

2. **Verify Environment Variables**:
   ```bash
   npm run env-check
   ```

3. **Test Connection**: 
   - Open your app and scroll to the bottom "System Status" section
   - Click "Test Database Connection" to check if Supabase is reachable

4. **Configure Supabase Settings**: Follow instructions in `SUPABASE_SETUP.md`

5. **Network Troubleshooting**:
   - **Verify Network Access**: Run `npm run network-info` to get your IP
   - **Check Firewall**: Ensure port 8080 is open
   - **Clear Browser Cache**: On the other device, clear cache and cookies
   - **Check Console**: Look for CORS errors in browser developer tools

6. **Common Issues**:
   - **Project Paused**: Supabase pauses inactive projects - restart it in dashboard
   - **Invalid URLs**: Make sure redirect URLs in Supabase match your current setup
   - **Network Blocking**: Some networks block external API calls

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

- **Vite** - Fast development server with HMR
- **TypeScript** - Type-safe JavaScript
- **React** - UI library with hooks
- **shadcn-ui** - Beautiful and accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a service (database, auth)
- **React Query** - Data fetching and state management
- **React Router** - Client-side routing

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b89e363e-c755-40f0-ae59-6bd3c14b5ef6) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
