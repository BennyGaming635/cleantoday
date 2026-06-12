# All routes in Clean Today
Clean Today lets you do many things, so it makes sense that there any many different pages. This guide serves as a basic list of every page. (Describing folders for routes).

> [!NOTE]
> All API routes are in /app/api. If you want to learn more about APIs, [learn more here](API.md).

## Regular user routes
This is all routes a 'regular user' would normally use.

---

### '/'
This page serves as the home page.

---

### '/blog'
This page serves as the frontend and as a link to all blog articles that have been writen by our team.

---

### '/create'
This page serves as the event creation tool
**Login required**

---

### '/dashboard'
This page serves as a panel to manage all of your created events.
**Login required**

---

### '/event/[id]'
This page serves as the holder for events, to find an event, you need to use the event id (replace [id] with the Event ID)
**Login required to RSVP**

---

### '/explore'
This page serves as the public (and sitewide) map for all events.

---

### '/login'
This page serves as the frontend for users to login to their account via 3rd party login methods.
**Login required**

---

### '/me'
If a user is logged in, they are redirected to this page if they try to visit the home page.

---

### '/milestones'
This page shows all community milestones via the total number of kilos collected.

---

### '/users'
This page lists all users who have set their privacy to public.

---

### '/profile'
A user can customise their personal profile here.

---
### '/status'
This page is an embed of our Better Stack status page.

---
### '/support'
Users can choose to support us via a donation (TBD)

---

## Government Pages
These pages are normally used by enterprise or governments.

---
### '/gov'
This page is used to advertise our tools to government/enterprise users.

---
### '/gov/login'
This page is used for government users to log into their user account.
**Login required**

---
### '/gov/dashboard'
This page is used to render and show the 'hub' for government users, as such this lets them create reports, important zones, events etc.
**Login required**

---
### '/gov/dashboard/create'
This page is similar to the regular event creation tool, but creates offical events instead.
**Login required**

---
### '/gov/dashboard/create/zone'
This page is also similar to the event creation toolkit, but instead lets government/enterprise users create a focus zone.
**Login required**

---

## Other pages
These pages are not *really* used by either parties.

---
### '/admin'
This page is the login page used by our admin team to access our toolkit.
**Login required**

---
### '/admin/dashboard'
This page is used by Clean Today staff to filter and manage the platform, featuring all of our tools and resources!
**Login required**

---
### '/terms'
On this page, all of our Terms & Conditions are avaliable here, outling the rules regarding usage of Clean Today and our tools.

---
### '/privacy'
Additonally, this page instead shows our sites Privacy Policy, which is agreed to when you sign up for an account.

---
### '/safety'
This page shows our basic safety guidelines, when you RSVP to an event, this page lists all the safety rules we expect you to follow, additonally event organisers agree to similar rules when creating events.

---

Please note: As Clean Today continues to grow, we *will* add more route explanations here.