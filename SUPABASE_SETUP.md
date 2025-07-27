# Supabase Setup for Multi-Device Access

To ensure your authentication works from any device/computer, you need to configure Supabase properly.

## 1. Configure Site URL and Redirect URLs

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `dkbumxunrjvsuwrtqcyd`
3. Go to **Authentication** → **URL Configuration**
4. Update the following settings:

### Site URL
Set your main site URL (for production):
```
https://yourdomain.com
```

### Redirect URLs
Add all the URLs where your app might run. Include:
```
http://localhost:8080/admin
http://127.0.0.1:8080/admin
http://[YOUR_LOCAL_IP]:8080/admin
https://yourdomain.com/admin
```

**Example for local network access:**
```
http://localhost:8080/admin
http://127.0.0.1:8080/admin
http://192.168.1.100:8080/admin
http://10.0.0.50:8080/admin
```

## 2. Configure CORS Origins (if needed)

If you still have CORS issues:

1. Go to **Settings** → **API**
2. In the **CORS origins** section, add:
```
http://localhost:8080
http://127.0.0.1:8080
http://192.168.*.*:8080
http://10.*.*.*:8080
https://yourdomain.com
```

## 3. Test Authentication

After updating these settings:
1. Try logging in from your original computer
2. Try logging in from another device on the same network
3. Both should work without issues

## 4. For Production Deployment

When you deploy to production (via Loveable or elsewhere):
1. Update `VITE_BASE_URL` in your `.env` file to your production URL
2. Add your production URL to the Supabase redirect URLs
3. Update the Site URL in Supabase to your production domain

## Troubleshooting

**If authentication still doesn't work:**
1. Check browser console for CORS errors
2. Verify the redirect URLs in Supabase match exactly
3. Clear browser cache and cookies
4. Check that the network firewall allows connections on port 8080