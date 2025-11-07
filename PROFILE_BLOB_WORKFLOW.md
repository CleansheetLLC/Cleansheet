# Profile Blob Storage Workflow

## Overview

This workflow enables users to export complete career profiles that exceed Azure Table Storage's 32KB property limit. Large profile data is stored as JSON blobs in Azure Blob Storage, with lightweight reference entries in the ProfileRequests table.

## Architecture

```
┌─────────────────┐
│  career-canvas  │
│     .html       │
└────────┬────────┘
         │
         │ 1. Upload JSON blob (write-only SAS)
         ├──────────────────────────────────────┐
         │                                      │
         v                                      v
┌─────────────────┐              ┌──────────────────────┐
│  profileblobs   │              │  ProfileRequests     │
│   Container     │              │  Table               │
│                 │              │                      │
│  email/         │              │  PartitionKey: ...   │
│    timestamp_   │◄─────────────┤  blobName: email/... │
│    random.json  │  2. Reference│  requestType: ...    │
└─────────────────┘              └──────────────────────┘
```

## Security Model

- **profileblobs Container**: Write-only SAS token (permission: 'w')
  - Users can upload blobs anonymously
  - Cannot read, list, or delete existing blobs
  - Blobs are private (require account key or separate read SAS to access)

- **ProfileRequests Table**: Add-only SAS token (permission: 'add')
  - Users can create table entries anonymously
  - Cannot read existing entries
  - Backend uses account key to read both table and blobs

## Setup Instructions

### Step 1: Create Azure Infrastructure

Run the provided bash script to create the profileblobs container and generate the SAS URL:

```bash
cd /home/paulg/git/Cleansheet
chmod +x azure-create-profile-blobs.sh
./azure-create-profile-blobs.sh
```

This script will:
1. Verify Azure CLI and authentication
2. Create profileblobs container in storageb681 storage account
3. Configure CORS for browser uploads
4. Generate write-only SAS token (expires 2026-11-05)
5. Output the container SAS URL

**Expected output:**
```
================================================
Setup Complete
================================================

Container URL: https://storageb681.blob.core.windows.net/profileblobs

Write-Only SAS URL (expires 2026-11-05T01:04Z):
----------------------------------------
https://storageb681.blob.core.windows.net/profileblobs?sv=...&sig=...
----------------------------------------

Add this constant to career-canvas.html:

const PROFILE_BLOB_CONTAINER_URL = 'https://storageb681.blob.core.windows.net/profileblobs?sv=...&sig=...';
```

### Step 2: Update career-canvas.html

1. Copy the generated SAS URL from the script output
2. Open `career-canvas.html` in your editor
3. Find line ~9581 with the constant:
   ```javascript
   const PROFILE_BLOB_CONTAINER_URL = 'REPLACE_WITH_SAS_URL_FROM_SCRIPT';
   ```
4. Replace the placeholder with your actual SAS URL:
   ```javascript
   const PROFILE_BLOB_CONTAINER_URL = 'https://storageb681.blob.core.windows.net/profileblobs?sv=2019-02-02&...';
   ```
5. Save the file

### Step 3: Test the Workflow

1. Open `career-canvas.html` in your browser
2. Add some profile data (experiences, stories, goals, portfolio items)
3. Open browser console (F12)
4. Run the test function:
   ```javascript
   testFullProfileExport('your@email.com')
   ```

**Expected console output:**
```
========================================
Starting Full Profile Export Test
========================================
Step 1: Collecting profile data...
✓ Profile data collected: 12.34 KB
  - Experiences: 3
  - Stories: 5
  - Goals: 2
  - Portfolio: 1
  - Job Opportunities: 0

Step 2: Uploading profile blob to Azure...
Uploading profile blob: your@email.com/20251107120530_a3f2k9.json (12.34 KB)
✓ Blob uploaded successfully: your@email.com/20251107120530_a3f2k9.json

Step 3: Creating table reference entry...
Creating table entry with blob reference: {...}
✓ Table entry created successfully

========================================
✓ Full Profile Export Test SUCCESSFUL
========================================

Blob Name: your@email.com/20251107120530_a3f2k9.json
Email: your@email.com
Size: 12.34 KB

To verify:
1. Check Azure Table Storage ProfileRequests table for new entry
2. Use account key to read blob (SAS token is write-only)

az storage blob show --account-name storageb681 --account-key "$ACCOUNT_KEY" --container-name profileblobs --name "your@email.com/20251107120530_a3f2k9.json"
```

### Step 4: Verify Upload

#### Verify Table Entry

```bash
# List recent entries in ProfileRequests table
az storage entity query \
  --account-name storageb681 \
  --account-key "$ACCOUNT_KEY" \
  --table-name ProfileRequests \
  --filter "PartitionKey eq 'ProfileRequest'" \
  --select RowKey,email,blobName,requestType,requestDate
```

Look for an entry with:
- `requestType`: "FullProfileExport"
- `email`: Your test email
- `blobName`: Matching the blob path from console output

#### Verify Blob Upload

```bash
# List blobs in profileblobs container
az storage blob list \
  --account-name storageb681 \
  --account-key "$ACCOUNT_KEY" \
  --container-name profileblobs \
  --output table

# Download and view blob content
az storage blob download \
  --account-name storageb681 \
  --account-key "$ACCOUNT_KEY" \
  --container-name profileblobs \
  --name "your@email.com/20251107120530_a3f2k9.json" \
  --file profile-export.json

# View the JSON
cat profile-export.json | jq .
```

## Integration Patterns

### Pattern 1: Full Profile Export

**Use Case**: User requests manual profile export for backup/analysis

```javascript
async function requestFullProfileExport(email) {
    const profileData = collectFullProfileData();
    const blobName = await uploadProfileBlob(email, profileData);
    await createProfileBlobTableReference(email, blobName, 'FullProfileExport', {
        experienceCount: profileData.experiences.length,
        storyCount: profileData.stories.length
    });
}
```

### Pattern 2: Session Request with Full Profile

**Use Case**: User requests coaching session and provides complete profile for review

```javascript
async function submitSessionRequestWithProfile(email, notes) {
    // Upload full profile as blob
    const profileData = collectFullProfileData();
    const blobName = await uploadProfileBlob(email, profileData);

    // Create table entry with session-specific metadata
    await createProfileBlobTableReference(email, blobName, 'SessionRequestWithBlob', {
        notes: notes.substring(0, 1000), // Truncate to fit in table
        sessionType: 'mock-interview',
        experienceCount: profileData.experiences.length,
        preferredCoach: 'technical'
    });
}
```

### Pattern 3: Selective Profile Upload

**Use Case**: Upload only specific sections that exceed size limits

```javascript
async function uploadLargeStories(email, stories) {
    const profileData = {
        metadata: {
            exportDate: new Date().toISOString(),
            dataType: 'stories-only'
        },
        stories: stories
    };

    const blobName = await uploadProfileBlob(email, profileData);
    await createProfileBlobTableReference(email, blobName, 'StoriesExport', {
        storyCount: stories.length
    });
}
```

## Data Structure

### Profile Blob JSON Structure

```json
{
  "metadata": {
    "exportDate": "2025-11-07T12:05:30.123Z",
    "persona": "career-changer",
    "version": "1.0"
  },
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "profession": "Software Engineer",
    "goal": "Transition to cloud architecture"
  },
  "experiences": [
    {
      "title": "Senior Developer",
      "company": "Tech Corp",
      "startDate": "2020-01-01",
      "endDate": "2023-12-31",
      "description": "Led development team...",
      "skills": ["JavaScript", "Python", "AWS"]
    }
  ],
  "stories": [
    {
      "id": "story-1",
      "title": "Reduced API latency by 40%",
      "situation": "Our API was experiencing...",
      "task": "I was tasked with...",
      "action": "I implemented...",
      "result": "Latency decreased from 500ms to 300ms",
      "linkedExperience": "Senior Developer"
    }
  ],
  "goals": [...],
  "portfolio": [...],
  "jobOpportunities": [...],
  "assets": {
    "documents": [...],
    "diagrams": [...],
    "whiteboards": [...],
    "codeSnippets": [...],
    "photos": [...],
    "pdfs": [...],
    "links": [...]
  }
}
```

### Table Reference Entry Structure

```json
{
  "PartitionKey": "ProfileRequest",
  "RowKey": "20251107120530_a3f2k9",
  "requestType": "FullProfileExport",
  "email": "user@example.com",
  "blobName": "user@example.com/20251107120530_a3f2k9.json",
  "requestDate": "2025-11-07T12:05:30.123Z",
  "persona": "career-changer",
  "status": "pending",
  "experienceCount": 3,
  "storyCount": 5,
  "goalCount": 2,
  "portfolioCount": 1,
  "jobCount": 0
}
```

## Backend Processing

Backend services should:

1. **Poll ProfileRequests Table**: Query for entries with `status: 'pending'`
2. **Check requestType**: Determine processing logic based on type
3. **Fetch Blob Data**: Use account key to download blob from profileblobs
4. **Process Profile**: Apply business logic (coaching match, export generation, etc.)
5. **Update Status**: Set `status: 'completed'` or `'failed'` in table

Example Azure Function pseudocode:

```javascript
// Trigger: Timer (every 5 minutes)
async function processProfileRequests(context) {
  // Query pending requests
  const requests = await queryTable('ProfileRequests',
    "PartitionKey eq 'ProfileRequest' and status eq 'pending'"
  );

  for (const request of requests) {
    try {
      // Download blob using account key
      const blobData = await downloadBlob('profileblobs', request.blobName);
      const profile = JSON.parse(blobData);

      // Process based on requestType
      switch (request.requestType) {
        case 'FullProfileExport':
          await generatePDFReport(profile, request.email);
          break;
        case 'SessionRequestWithBlob':
          await matchCoach(profile, request);
          break;
        case 'StoriesExport':
          await analyzeStories(profile.stories, request.email);
          break;
      }

      // Update status
      await updateTableEntity('ProfileRequests', {
        PartitionKey: request.PartitionKey,
        RowKey: request.RowKey,
        status: 'completed',
        processedDate: new Date().toISOString()
      });

    } catch (error) {
      // Update status to failed
      await updateTableEntity('ProfileRequests', {
        PartitionKey: request.PartitionKey,
        RowKey: request.RowKey,
        status: 'failed',
        errorMessage: error.message
      });
    }
  }
}
```

## Troubleshooting

### Error: PROFILE_BLOB_CONTAINER_URL not configured

**Cause**: The constant in career-canvas.html still has the placeholder value

**Fix**:
1. Run `./azure-create-profile-blobs.sh`
2. Copy the SAS URL from the output
3. Update the constant in career-canvas.html (line ~9581)

### Error: 403 Forbidden when uploading blob

**Cause**: SAS token expired or incorrect permissions

**Fix**:
1. Verify token expiration date: `2026-11-05T01:04Z`
2. Regenerate SAS token: Run script again
3. Ensure permission is 'w' (write only)

### Error: CORS policy blocking request

**Cause**: CORS not configured on storage account

**Fix**: Run the CORS configuration section of the script:
```bash
az storage cors add \
  --account-name storageb681 \
  --account-key "$ACCOUNT_KEY" \
  --services b \
  --methods PUT OPTIONS \
  --origins '*' \
  --allowed-headers '*' \
  --exposed-headers '*' \
  --max-age 3600
```

### Error: Profile data too large (>10MB)

**Cause**: Profile data exceeds 10MB client-side limit

**Fix**:
1. Reduce data size by excluding full document content
2. Upload selective sections instead of full profile
3. Increase MAX_SIZE constant if backend supports larger blobs

### Cannot read blob after upload

**Expected behavior**: SAS token is write-only. You cannot read blobs using the same token.

**Fix**: Use account key or generate separate read SAS token:
```bash
# Read blob with account key
az storage blob download \
  --account-name storageb681 \
  --account-key "$ACCOUNT_KEY" \
  --container-name profileblobs \
  --name "email/timestamp_random.json"

# Generate read SAS token (for debugging only, not for production)
az storage blob generate-sas \
  --account-name storageb681 \
  --account-key "$ACCOUNT_KEY" \
  --container-name profileblobs \
  --name "email/timestamp_random.json" \
  --permissions r \
  --expiry "2025-12-31T23:59Z" \
  --https-only
```

## Size Limits

- **Azure Table Storage Property**: 32KB (reason for this workflow)
- **Azure Blob Storage**:
  - Block blob: 4.75 TB max
  - Client-side enforcement: 10MB (configurable)
- **Recommended profile size**: < 5MB for optimal performance

## Cost Analysis

**Azure Blob Storage Costs (East US pricing)**:

- **Storage**: $0.0184 per GB/month
  - 1,000 profiles @ 50KB each = 50MB = $0.00092/month
  - 10,000 profiles @ 50KB each = 500MB = $0.0092/month

- **Transactions**:
  - Write (PUT): $0.05 per 10,000 operations
  - 1,000 uploads = $0.005

- **Bandwidth**: First 100GB free, then $0.087 per GB

**Total cost for 1,000 profile exports**: < $0.01/month

## Security Considerations

1. **Write-Only Access**: SAS token cannot read or list existing blobs
2. **Private Blobs**: Blobs not publicly accessible without credentials
3. **No PII in Blob Names**: Use email + timestamp, not sensitive IDs
4. **HTTPS Only**: All requests enforced to use HTTPS
5. **Token Expiration**: SAS token expires 2026-11-05 (regenerate before expiry)
6. **Size Limits**: 10MB client-side limit prevents abuse
7. **CORS**: Configured for browser uploads but not overly permissive

## Future Enhancements

1. **Compression**: Gzip JSON before upload to reduce size/cost
2. **Encryption**: Client-side encryption before upload
3. **Partitioning**: Organize blobs by date (email/2025-11/timestamp.json)
4. **Lifecycle Policy**: Auto-delete old blobs after 90 days
5. **CDN**: Cache profile exports for faster retrieval
6. **Blob Indexing**: Enable search/filtering on blob metadata
7. **Event Grid**: Trigger Azure Function on blob upload
8. **Monitoring**: Track upload success rate, blob sizes, errors

## References

- Azure Blob Storage: https://docs.microsoft.com/azure/storage/blobs/
- SAS Tokens: https://docs.microsoft.com/azure/storage/common/storage-sas-overview
- CORS Configuration: https://docs.microsoft.com/rest/api/storageservices/cross-origin-resource-sharing--cors--support-for-the-azure-storage-services
- Azure Table Storage: https://docs.microsoft.com/azure/storage/tables/

---

**Last Updated**: 2025-11-07
**Version**: 1.0
