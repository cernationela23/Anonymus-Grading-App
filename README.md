# Anonymus-Grading-App
Web Technology Project - Anonymous grading application using PERN Stack.


#  Anonymous Grading App

Anonymous Grading App este o aplicatie web care permite evaluarea anonima a proiectelor studentilor de catre un juriu de colegi, conform cerintelor proiectului de Tehnologii Web.

Aplicatia este de tip **Single Page Application (SPA)** si este construita cu **React** (frontend), **Node.js + Express** (backend) si **PostgreSQL** (baza de date).

---

##  Tehnologii folosite

- **Frontend:** React, React Router  
- **Backend:** Node.js, Express  
- **ORM:** Sequelize  
- **Database:** PostgreSQL  
- **Autentificare:** JWT  
- **API:** REST  
- **Versionare:** Git  

---

##  Functionalitati

###  Autentificare
- Inregistrare (Register)
- Autentificare (Login)
- Roluri:
  - **Student**
  - **MP (membru de proiect)**
  - **Profesor**

---

###  Student
- Acceseaza dashboard-ul general
- Poate fi membru in proiecte
- Poate fi selectat ca **jurat** pentru alte proiecte
- Poate evalua doar proiectele la care este asignat

---

###  MP (Membru Proiect)
- Creeaza proiecte
- Adauga studenti ca membri in proiect
- Creeaza livrabile pentru proiect (deadline, video, link de deployment)
- Poate asocia juriu aleator pentru fiecare livrabil

---

###  Jurat
- Vede doar livrabilele la care a fost asignat
- Acorda note intre 1 si 10
- Poate modifica nota intr-o perioada limitata de timp

---

###  Profesor
- Vede toate proiectele
- Vede toate livrabilele
- Vede notele **anonime**
- Media este calculata eliminand nota minima si maxima

---

##  Structura bazei de date

- **Students**
- **Projects**
- **ProjectMembers**
- **Deliverables**
- **JuryAssignments**
- **Grades**

Relatiile dintre tabele permit:
- mai multi studenti intr-un proiect
- jurizare anonima
- note unice per jurat per livrabil

---

##  Rulare Backend

```bash
npm install
node server.js
Backend-ul ruleaza pe:

http://localhost:3000

▶️ Rulare Frontend
cd frontend
npm install
npm start


Frontend-ul ruleaza pe:

http://localhost:3001
