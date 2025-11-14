# Migration from Azure AD B2C to Microsoft Entra External ID

**Date:** 2025-11-13
**Reason:** Azure AD B2C no longer available for new tenants (sunset May 1, 2025)
**Solution:** Microsoft Entra External ID with MSAL.js

---

## What Changed

### ✅ **Updated Files**

| File | Changes |
|------|---------|
| `DEPLOYMENT_GUIDE_SYNC.md` | Phase 1 updated for Entra External ID setup |
| `azure-functions/GenerateUserSasToken/index.js` | JWT validation now uses standard Entra endpoints |
| `shared/cleansheet-auth-msal.js` | **NEW** - MSAL.js-based authentication (replaces custom B2C) |
| `shared/cleansheet-auth.js` | **DEPRECATED** - Custom B2C implementation no longer needed |

### ❌ **Removed Dependencies**

- Custom B2C JWT validation
- B2C-specific JWKS endpoints
- B2C policy configuration

### ✅ **New Dependencies**

- MSAL.js 2.x (via CDN): `https://cdn.jsdelivr.net/npm/@azure/msal-browser@2.38.0/lib/msal-browser.min.js`
- Standard Entra ID endpoints

---

## Key Differences

### Authentication Flow

**Before (Azure AD B2C):**
```javascript
// Custom OAuth2 redirect flow
const authority = `https://cleansheet.b2clogin.com/.../B2C_1_signupsignin`;
window.location.href = `${authority}/oauth2/v2.0/authorize?...`;
```

**After (Entra External ID with MSAL):**
```javascript
// MSAL handles everything
const msalInstance = new msal.PublicClientApplication(msalConfig);
await msalInstance.loginRedirect(loginRequest);
```

### Token Validation

**Before (B2C):**
```javascript
issuer: `https://cleansheet.b2clogin.com/${TENANT_ID}/v2.0/`
jwksUri: `https://cleansheet.b2clogin.com/.../discovery/v2.0/keys`
```

**After (Entra ID):**
```javascript
issuer: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`
jwksUri: `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`
```

### User Claims

**Before (B2C):**
```javascript
email: decoded.emails?.[0] || decoded.email
userId: decoded.oid || decoded.sub
```

**After (Entra ID):**
```javascript
email: decoded.preferred_username || decoded.email || decoded.upn
userId: decoded.oid || decoded.sub
```

---

## Migration Steps

### For New Deployments

✅ **Just follow the updated `DEPLOYMENT_GUIDE_SYNC.md`**

No migration needed - you'll set up Entra External ID from scratch.

### For Existing B2C Deployments (if any)

If you already have a B2C tenant (created before May 1, 2025):

1. **Keep using B2C** - Existing tenants are still supported
2. **Or migrate to Entra External ID:**
   - Create new app registration in Entra ID
   - Update environment variables in Azure Function
   - Replace `cleansheet-auth.js` with `cleansheet-auth-msal.js`
   - Update client configuration
   - Test authentication flow
   - Migrate users (if needed)

---

## Configuration Comparison

### Azure Function Environment Variables

**Before:**
```bash
B2C_TENANT=cleansheet
B2C_TENANT_ID=...
B2C_CLIENT_ID=...
B2C_POLICY=B2C_1_signupsignin
```

**After:**
```bash
TENANT_ID=...
CLIENT_ID=...
```

### Client Configuration

**Before:**
```javascript
const authConfig = {
    tenantName: 'cleansheet',
    clientId: '...',
    signUpSignInPolicy: 'B2C_1_signupsignin'
};
```

**After:**
```javascript
const authConfig = {
    clientId: '...',
    tenantId: '...',
    authority: 'https://login.microsoftonline.com/...'
};
```

---

## Benefits of Entra External ID

✅ **Modern platform** - Latest Microsoft identity features
✅ **Better integration** - Works seamlessly with Entra ecosystem
✅ **Simpler setup** - No separate B2C tenant needed
✅ **MSAL.js** - Industry-standard library with excellent support
✅ **Same pricing** - First 50,000 MAU free
✅ **Future-proof** - Active development and support

---

## Testing Checklist

After migration:

- [ ] Sign-up flow works (new user registration)
- [ ] Sign-in flow works (returning users)
- [ ] Sign-out works correctly
- [ ] JWT validation in Azure Function succeeds
- [ ] SAS token generation works
- [ ] User email extracted correctly
- [ ] Duplicate profile migration works
- [ ] Multi-device sync works
- [ ] Token refresh happens automatically

---

## Troubleshooting

### Issue: "MSAL is not defined"

**Solution:** Include MSAL.js library before cleansheet-auth-msal.js:
```html
<script src="https://cdn.jsdelivr.net/npm/@azure/msal-browser@2.38.0/lib/msal-browser.min.js"></script>
```

### Issue: "Invalid token: missing email"

**Solution:** Add email claim to token configuration in Entra app registration:
1. Go to App Registration → Token configuration
2. Add optional claim: "email"
3. Check "Turn on the Microsoft Graph email permission"

### Issue: "AADSTS50011: Reply URL mismatch"

**Solution:** Add exact redirect URI to app registration:
1. App Registration → Authentication
2. Add platform: Single-page application
3. Add redirect URI: `https://www.cleansheet.info/career-canvas.html`

### Issue: "Token validation failed: invalid issuer"

**Solution:** Check TENANT_ID in Azure Function app settings matches your tenant.

---

## Support Resources

- **Entra External ID Docs:** https://learn.microsoft.com/entra/external-id/
- **MSAL.js Docs:** https://github.com/AzureAD/microsoft-authentication-library-for-js
- **Migration Guide:** https://learn.microsoft.com/entra/external-id/customers/how-to-migrate-customers
- **Cleansheet Docs:** See `DEPLOYMENT_GUIDE_SYNC.md`

---

**Last Updated:** 2025-11-13
**Migration Status:** ✅ Complete
