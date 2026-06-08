# Achievements

Clean Today has user achievements which are earnt via doing serveral different tasks, however some badges are limited to certain users such as beta testers (during the beta phase) or site admins.

## What Achievements can be earnt?
| Image | Badge Name | How to unlock? |
| ----- | ---------- | -------------- |
| ![Super August Badge](/clean-today/public/achievements/Super_August.png) | Super August | Complete 1 event in August |
| ![Spooky October Badge](/clean-today/public/achievements/Spooky_October.png) | Spooky October | Complete 1 event in October |
| ![Site Admin Badge](/clean-today/public/achievements/Site_Admin.png) | Site Admin | Administrator of Clean Today |
| ![Pride Month Badge](/clean-today/public/achievements/Pride_Month.png) | Pride Month | Complete 1 event in June |
| ![Movember Badge](/clean-today/public/achievements/Movember.png) | Movember | Complete 1 event in November |
| ![Honey Month Badge](/clean-today/public/achievements/Honey_Month.png) | Honey Month | Complete 1 event in September |
| ![First Host Badge](/clean-today/public/achievements/First_Host.png) | First Host | Host 1 event |
| ![First Clean Badge](/clean-today/public/achievements/First_Cleanup.png) | First Cleanup | Attend 1 event |
| ![Cleaner July Badge](/clean-today/public/achievements/Cleaner_July.png) | Cleaner July | Complete 1 event in July |
| ![Beta Tester Badge](/clean-today/public/achievements/Beta_Tester.png) | Beta Tester | Sign up during the beta period |
| ![100kg Beachball Badge](/clean-today/public/achievements/100kg_Beachball.png) | 100kg Beachball | Collect a total of 100kg |
| ![50kg Cleaner Badge](/clean-today/public/achievements/50kg_Cleaner.png) | 50kg Cleaner | Collect a total of 50kg |
| ![10kg Club Badge](/clean-today/public/achievements/10kg_Club.png) | 10kg Club | Collect a total of 10kg |

## How do I earn achievements?

These achievements will be earnt automatically throughout using our platform. For instance, if I was at an event and the event collected a total of 50kg, the API will automatically trigger

```ts
if (totalKg >= 10) {
    awards.push({
      user_id: userId,
      achievement_key: '10kg_Club',
      earned_at: now.toISOString(),
      desc: 'Collected 10kg of waste',
    })
  }
```

and

```ts
if (totalKg >= 50) {
    awards.push({
      user_id: userId,
      achievement_key: '50kg_Cleaner',
      earned_at: now.toISOString(),
      desc: 'Collected 50kg of waste',
    })
  }
```

as I have collected at least 50kg, meaning both badges will now appear on my **public** profile. If your profile is set to *hidden*, then you will stil recieve badges, but will be unable to view them.

### Beta Tester
To earn the beta Tester badge, simply sign up before the end of the beta period, which is currently the 1st of August in Server Time (AEST/GMT+10). This badge cannot be transferred and helps show you were here from the start!

### Site Admin
This badge can only be earnt to users who are defined as 'Site Admins' in [route.ts](/clean-today/app/api/achievements/route.ts).
```ts
const adminIds = [
    UserID // UUID from Supabase goes here
]
```
If a user is added to this field, they will automatically recieve the badge, but will be unable to lose it unless it's manually removed in the database.

If you're self-hosting then I would like to also wish you good luck. 🫡