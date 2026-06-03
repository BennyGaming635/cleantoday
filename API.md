# API docs

Clean Today uses some APIs to do stuff and function. At the moment, we aren't accepting developer programs but there's limited things you can do with our API (most things require our DB info).

> [!NOTE]
> Reminder that this IS NOT a developer guide, just explaining the APIs used.

---

## Authentication

Most of our API routes rely on using [Supabase](https://supabase.com) authentication.

- Client-side auth uses 'supabase.auth.getUser()'
- Admin routes use 'SUPABASE_SERVICE_ROLE_KEY' (server only and unaccessable)

---

## API Routes

### Achievements API

'POST /api/achievements'

This API awards an achievement to a user based on rules defined by the backend code.

**Body/Payload**

```json
{
  "userId": "uuid"
}
```

This API checks if either a user has signed up before the beta cutoff date or their total waste collected (in kg) to award either
- 'Beta_Tester'
- '10kg_Club'

**Response**

```json
{
    "message": "Achievements awarded",
    "awards": [
        {
            "user_id": "uuid",
            "achievement_key": "beta_tester",
            "desc": "Joined during the beta phase"
        }
    ]
}
```

**Errors**

If you incorrectly use the API you may recieve one of these errors
```json
{
    "error": "User ID is required"
}
```
Or this error (normally if Supabase is incorrect or you are missing perms)
```json
{
    "error": "Failed to award achievements",
    "details": "Supabase error message"
}
```