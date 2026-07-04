<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Press+Start+2P&size=28&pause=1000&color=F2A93B&center=true&vCenter=true&width=700&height=60&lines=ALIGNT+HRMS" alt="Alignt HRMS" />

<img src="https://readme-typing-svg.demolab.com?font=Press+Start+2P&size=12&pause=1500&color=3FA796&center=true&vCenter=true&width=700&lines=Every+workday%2C+perfectly+aligned.;Built+in+one+hackathon+sprint.;Check+in%2C+then+grind%2C+then+check+out." alt="Tagline" />

<br/><br/>

![Repo views](https://komarev.com/ghpvc/?username=sreejasonal05&label=REPO+VIEWS&color=14161F&style=for-the-badge)
![Status](https://img.shields.io/badge/STATUS-%F0%9F%9F%A2%20ONLINE-3FA796?style=for-the-badge)
![Made in](https://img.shields.io/badge/BUILT%20IN-1%20HACKATHON-FF6452?style=for-the-badge)

</div>

<br/>

## 🕹️ What Is This

**Alignt** is a full-stack Human Resource Management System, a hackathon build pairing
a Spring Boot and MySQL backend with a new React, Vite, Tailwind, and Framer Motion
frontend. It gives HR and employees one place to handle onboarding, attendance, leave,
and payroll visibility, without a spreadsheet in sight.

<div align="center">

```
┌──────────────────────────────────────────────┐
│  9:00 AM  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░  6:00 PM   │
│           Check in              The arc of a day │
└──────────────────────────────────────────────┘
```

</div>

## 🧩 The Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,spring,java,mysql,git&theme=dark" />

<br/><br/>

**Frontend:** React, Vite, Tailwind CSS, Framer Motion, Recharts

**Backend:** Spring Boot, Spring Security (JWT), MySQL

</div>

## 🎮 Level Select: Features

| | Level | What Happens |
|---|---|---|
| 🔐 | **Auth** | Sign up as Employee, HR, or Admin, secured with JWT |
| 📊 | **Dashboard** | Animated stat cards and a leave breakdown chart that actually moves |
| 🧑‍🤝‍🧑 | **Employees** | Add, search, edit, and remove records with full roster control |
| 🕒 | **Attendance** | Check in, check out, and watch the month fill in |
| 🗓️ | **Leave Requests** | Apply, then track pending, approved, or rejected status in real time |
| 👤 | **Profile** | Your own corner of the org chart |

## 🌗 The Vibe

<div align="center">

| Ink | Sunrise | Dusk | Sage |
|:---:|:---:|:---:|:---:|
| ![#14161F](https://placehold.co/60x60/14161F/14161F.png) | ![#F2A93B](https://placehold.co/60x60/F2A93B/F2A93B.png) | ![#FF6452](https://placehold.co/60x60/FF6452/FF6452.png) | ![#3FA796](https://placehold.co/60x60/3FA796/3FA796.png) |
| `#14161F` | `#F2A93B` | `#FF6452` | `#3FA796` |

</div>

Every arc, every card, and every check in ties back to one idea: a workday has a shape,
sunrise to sunset, and this app just tries to draw it a little more clearly.

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=rect&color=0:F2A93B,100:FF6452&height=3&width=800" />
</div>

## 🚀 Getting Started

### Prerequisites

- **Java 17** and Maven (the included `mvnw` wrapper handles this, so no separate install is needed)
- **MySQL 8** running locally
- **Node.js 18+** and npm
- VS Code with the "Extension Pack for Java" (for the backend), optional but recommended

### 1. Set Up the Database

```sql
CREATE DATABASE hrms;
```

Copy the template config and fill in your own values:

```bash
cd backend/src/main/resources
cp application.properties.example application.properties
```

Then edit `application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=<your MySQL password>
jwt.secret=<any long random string>
```

`application.properties` is gitignored. It holds real credentials and should never be
committed. Tables are created automatically on first run.

### 2. Run the Backend

```bash
cd backend
./mvnw spring-boot:run        # runs on localhost:8080
```

Sanity check once it's up:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Admin User","email":"admin@alignt.com","password":"password123","role":"ADMIN"}'
```

You should get back a JSON response with a token.

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev                    # runs on localhost:5173
```

The backend's CORS config only allows requests from `http://localhost:5173`, so keep the
frontend on that exact port.

### 4. First Walkthrough

1. Go to `/register` and create an Admin or HR account.
2. Go to **Employees → Add Employee** and add a few employee records. These are separate
   from login accounts, as noted below.
3. Register a second account as an Employee, using the same email as one of the employee
   records you just created. This auto matches the login to an employee profile.
4. Apply for leave as the employee, then approve or reject it as the admin.
5. Check the Dashboard for the animated stat cards and leave breakdown chart.

## 📁 Project Structure

```
├─ backend/            Spring Boot API: auth, employees, leaves, dashboard
└─ frontend/           React app: Alignt UI
   ├─ src/
   │  ├─ api/          Axios calls to the backend
   │  ├─ components/   Reusable UI (DayArc, StatCard, Modal, layout, etc.)
   │  ├─ context/       Auth state
   │  └─ pages/         Login, Dashboard, Employees, Leaves, Attendance, Profile
```

## 🧭 Known Gaps (Things to Mention if Judges Ask)

- **Attendance is a frontend only demo.** There is no attendance entity or endpoint in
  the backend yet, so check in and check out data lives in the browser's local storage
  rather than the database. It is fully interactive for the demo, and a natural next step.
- **There is no direct link between login accounts and employee records.** The backend's
  User (auth) and Employee (HR record) tables are not related by a foreign key. The
  frontend works around this by matching on email.
- **Role checks are mostly client side.** Backend role protection on `/api/employees` and
  `/api/leaves` is worth tightening with more time.

## 🛠️ If Something Breaks

| Symptom | Likely Fix |
|---|---|
| Network errors, or can't log in | Confirm the backend started cleanly on port 8080 and MySQL is running |
| CORS errors in the console | The frontend must run on port 5173 exactly |
| Login fails right after registering | Check the password meets the validation rules in `RegisterRequest` |

<br/>

<div align="center">

Thanks for stopping by. Go clock in. ☀️

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:F2A93B,100:14161F&height=90&section=footer" width="100%"/>

</div>
