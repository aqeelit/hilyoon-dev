# 🔧 XAMPP Setup Instructions for Hilyoon Backend

## 🚨 FIXING THE 404 API ERROR

### Step 1: Copy Files to XAMPP
1. Copy the entire `backend` folder to: `C:\xampp\htdocs\hilyoon-backend\`
2. Make sure the `.htaccess` file is copied (it might be hidden)

### Step 2: Enable mod_rewrite in XAMPP
1. Open XAMPP Control Panel
2. Click "Config" next to Apache
3. Select "Apache (httpd.conf)"
4. Find this line: `#LoadModule rewrite_module modules/mod_rewrite.so`
5. Remove the `#` to uncomment it: `LoadModule rewrite_module modules/mod_rewrite.so`
6. Save and restart Apache

### Step 3: Enable .htaccess Override
In the same httpd.conf file, find:
```apache
<Directory "C:/xampp/htdocs">
    ...
    AllowOverride None
    ...
</Directory>
```

Change `AllowOverride None` to `AllowOverride All`

### Step 4: Test the API

Visit these URLs in your browser:

1. **Debug Info**: http://localhost/hilyoon-backend/index.php?debug=1
2. **API Status**: http://localhost/hilyoon-backend/api/status
3. **Alternative**: http://localhost/hilyoon-backend/status

### Step 5: If Still Having Issues

Try accessing directly:
- http://localhost/hilyoon-backend/
- http://localhost/hilyoon-backend/index.php

## 📋 Quick Checklist

- [ ] Copied backend folder to C:\xampp\htdocs\hilyoon-backend\
- [ ] Enabled mod_rewrite in httpd.conf
- [ ] Set AllowOverride All in httpd.conf
- [ ] Restarted Apache in XAMPP
- [ ] .htaccess file exists in hilyoon-backend folder
- [ ] Tested http://localhost/hilyoon-backend/index.php?debug=1

## 🔍 Troubleshooting

If you still get 404:
1. Check Apache error log in XAMPP Control Panel
2. Verify the backend folder is in the right location
3. Make sure Apache is running
4. Try accessing without /api/ prefix first

## 📞 Next Steps
Once the API status works, we'll test authentication and database connection.
