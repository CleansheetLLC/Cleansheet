# 🔐 Azure Authentication Setup Checklist

## Quick Setup Steps

### ✅ Phase 1: Azure Configuration

**Microsoft Entra External ID (Recommended)**
- [ ] Create External ID tenant in Azure Portal
- [ ] Create app registration with multi-tenant support
- [ ] Copy Application (client) ID
- [ ] Set redirect URIs:
  - `https://pro.cleansheet.dev/professional/callback.html`
  - `http://localhost:3000/professional/callback.html`
- [ ] Enable ID tokens in authentication settings
- [ ] Set logout URL: `https://pro.cleansheet.dev/professional/login.html`
- [ ] Verify User.Read permission is present in API permissions
- [ ] Grant admin consent for User.Read permission

### ✅ Phase 2: DNS Configuration (GoDaddy)

- [ ] Add CNAME record: `pro.cleansheet.dev` → `your-app.azurewebsites.net`
- [ ] Add TXT record for domain verification (from Azure)
- [ ] Wait for DNS propagation (up to 48 hours)

### ✅ Phase 3: Code Configuration

- [ ] Copy `auth-config.template.js` to `auth-config.js`
- [ ] Update `clientId` with actual value from Azure
- [ ] Set `ACTIVE_AUTH_METHOD` to `'EXTERNAL_ID'`
- [ ] Verify `adminDomain` is set to `'cleansheet.dev'`
- [ ] Add `auth-config.js` to `.gitignore`

### ✅ Phase 4: Azure App Service

- [ ] Deploy files to Azure App Service
- [ ] Add custom domain `pro.cleansheet.dev`
- [ ] Enable managed SSL certificate
- [ ] Verify HTTPS redirect is working

### ✅ Phase 5: Testing

**Admin Access (cleansheet.dev users only):**
- [ ] Login with @cleansheet.dev account
- [ ] Verify admin role detection
- [ ] Confirm access to admin panel
- [ ] Test logout functionality

**User Access (multi-tenant):**
- [ ] Login with Microsoft personal account
- [ ] Login with other organizational account
- [ ] Verify no admin access for non-cleansheet.dev users
- [ ] Confirm professional dashboard access

---

## Configuration Files Status

| File | Status | Purpose |
|------|--------|---------|
| `auth-config.template.js` | ✅ Ready | Configuration template |
| `auth-config.js` | ⚠️ **You need to create this** | Production config |
| `config-loader.js` | ✅ Ready | Configuration loader |
| `microsoft-auth.js` | ✅ Ready | Auth service |
| `auth-manager.js` | ✅ Ready | State management |
| `AZURE_SETUP_GUIDE.md` | ✅ Ready | Detailed instructions |

---

## Quick Commands

**Create production config:**
```bash
cp auth-config.template.js auth-config.js
# Edit auth-config.js with your values
```

**Test locally:**
```bash
# Serve files on localhost:3000 or similar
# Open browser to localhost:3000/professional/login.html
```

**Check DNS propagation:**
```bash
nslookup pro.cleansheet.dev
```

---

## Key Values You Need

From Azure App Registration:
- **Client ID**: `[GUID from Azure Portal]`
- **Tenant ID**: `[GUID from Azure Portal]` (for reference)

From DNS Provider (GoDaddy):
- **CNAME target**: `[your-app].azurewebsites.net`

Current Configuration:
- **Admin Domain**: `cleansheet.dev`
- **Production URL**: `https://pro.cleansheet.dev`
- **Authentication Type**: External ID (multi-tenant)

---

## Troubleshooting

**❌ "Invalid redirect_uri"**
- Verify redirect URIs match exactly in Azure
- Check HTTPS vs HTTP
- Ensure no trailing slashes

**❌ "AADB2C90205: Insufficient permissions"**
- Grant admin consent for User.Read permission in Azure Portal
- Verify User.Read permission is present in API permissions
- Note: openid, profile, email are handled automatically by MSAL

**❌ Admin access not working**
- Verify email domain is exactly `@cleansheet.dev`
- Check browser console for admin role check logs
- Confirm organizational account (not consumer)

**❌ DNS not resolving**
- Allow up to 48 hours for propagation
- Use `nslookup` or `dig` to check status
- Verify CNAME record is correct

---

## Security Notes

🔒 **Admin Access**
- Only `@cleansheet.dev` email addresses can be administrators
- Organizational accounts only (not consumer accounts)
- Admin role checked on every login

🔒 **Multi-Tenant Users**
- Any Microsoft account can be a regular user
- Personal accounts (outlook.com, hotmail.com) allowed
- Work/school accounts from any organization allowed
- No admin access unless @cleansheet.dev

🔒 **Configuration Security**
- Never commit `auth-config.js` to version control
- Add to `.gitignore` immediately
- Client ID is safe to expose in frontend code
- Use HTTPS in production only

---

**Status**: Configuration ready for production deployment 🚀