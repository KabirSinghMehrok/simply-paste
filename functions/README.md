# Firebase Functions - DISABLED

This directory contains Firebase Functions code that is currently **disabled** and not deployed.

## Why Disabled?

We've migrated from Firebase Functions-based cleanup to **Firestore TTL (Time-To-Live) policy** for automatic paste cleanup. This approach is:

- **More cost-effective** - No compute costs for cleanup
- **More reliable** - Built into Firestore, no cold starts
- **Simpler** - No scheduling or function management needed
- **Better performance** - Automatic cleanup without function execution

## Current Implementation

- Pastes are created with an `expireAt` field (15 minutes from creation)
- Firestore TTL policy automatically deletes expired documents
- Manual expiry check in API routes as fallback

## Functions Code

The cleanup functions code is preserved here for reference but not deployed:
- `src/cleanup.ts` - Contains the cleanup logic
- `src/index.ts` - Function exports (currently empty)

## Re-enabling Functions

To re-enable functions deployment, add the functions configuration back to `firebase.json`:

```json
"functions": [
  {
    "source": "functions",
    "codebase": "default",
    "disallowLegacyRuntimeConfig": true,
    "ignore": [
      "node_modules",
      ".git",
      "firebase-debug.log",
      "firebase-debug.*.log",
      "*.local"
    ],
    "predeploy": [
      "npm --prefix \"$RESOURCE_DIR\" run lint",
      "npm --prefix \"$RESOURCE_DIR\" run build"
    ]
  }
]
```