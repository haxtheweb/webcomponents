# HAXiam API Endpoint Specification

## User Access Management Endpoint

### Endpoint: POST /haxiamAddUserAccess

This endpoint allows users to grant access to their HAXiam sites by creating symlinks between user directories when the target username exists.

**Availability**: This endpoint is only available when HAXiam mode is enabled (`config->iam = true`). The endpoint will not be present in `appSettings` if HAXiam is not enabled.

### Request

**Method:** POST  
**URL:** `/haxiamAddUserAccess`

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer {jwt_token}`

**Request Body:**
```json
{
  "userName": "string",     // Required: Username to grant access to
  "siteName": "string"      // Required: Site name/directory name
}
```

### Response

#### Success Response (200 OK)
```json
{
  "status": "success",
  "message": "User access granted successfully",
  "username": "targetuser",
  "timestamp": "2025-10-02T14:45:00Z"
}
```

#### Error Responses

**403 Forbidden - User Not Found**
```json
{
  "status": "error",
  "message": "User not found or unauthorized",
  "error_code": "USER_NOT_FOUND"
}
```

**400 Bad Request - Invalid Input**
```json
{
  "status": "error", 
  "message": "userName is required",
  "error_code": "INVALID_INPUT"
}
```

**400 Bad Request - HAXiam Not Enabled**
```json
{
  "status": "error",
  "message": "HAXIAM mode is not enabled",
  "error_code": "HAXIAM_DISABLED"
}
```

**401 Unauthorized - Invalid Token**
```json
{
  "status": "error",
  "message": "Invalid or expired authentication token",
  "error_code": "UNAUTHORIZED"
}
```

**500 Internal Server Error - System Error**
```json
{
  "status": "error",
  "message": "Failed to create user access",
  "error_code": "SYSTEM_ERROR"
}
```

### Implementation Notes

1. **HAXcms-PHP Hooks System**: This endpoint will be implemented via the hooks system in HAXcms-PHP, not in the Node.js or typical PHP environment.

2. **Symlink Creation**: The endpoint creates a symlink between user directories to grant access. The symlink will point from the target user's directory to the requesting user's site.

3. **User Validation**: The system must verify that the target username exists in the HAXiam system before creating the symlink.

4. **Security**: 
   - JWT authentication required
   - Validate requesting user has permission to grant access to the specified site
   - Prevent directory traversal attacks
   - Log all access grant attempts

5. **Directory Structure**: Assumes HAXiam uses a directory structure where each user has their own folder and symlinks can be created to share access.

### Frontend Integration

The frontend conditionally shows the "User Access" menu option only when the `haxiamAddUserAccess` endpoint is present in `appSettings` (indicating HAXiam is enabled).

The modal (`app-hax-user-access-modal.js`) calls this endpoint via the secure AppHaxAPI system:

```javascript
const response = await store.AppHaxAPI.makeCall("haxiamAddUserAccess", {
  userName: inputUsername,
  siteName: siteName
});
```

**Menu Visibility Logic**: The "User Access" button in the site options menu is conditionally rendered:
```javascript
${store.appSettings && store.appSettings.haxiamAddUserAccess ? 
  html`<button>User Access</button>` : ""}
```

### Toast Notifications

- **Success (200)**: Shows success toast with RPG character matching the added username
- **User Not Found (403)**: Shows error message "User not found or unauthorized"
- **Other Errors**: Shows generic error message with status information