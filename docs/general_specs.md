# SPECIFICATII DETALIATE 

## 1. Obiectiv general
Realizarea unei aplicatii web de tip Single Page Application (SPA) care permite acordarea anonima de note proiectelor studentilor. Nota finala a unui proiect este calculata automat pe baza notelor acordate de un juriu aleatoriu format din alti studenti.

Aplicatia include un back-end RESTful (Node.js), un front-end component-based (React), si o baza de date relationala accesata printr-un ORM.

## 2. Scopul aplicatiei
Aplicatia faciliteaza un proces transparent, corect si anonim de evaluare intre studenti, in cadrul livrabilelor partiale ale proiectelor lor.

## 3. Actori

* **Student MP (Membru Proiect)**
    Student inscris intr-un proiect. Poate adauga proiecte si livrabile.
* **Student jurat**
    Orice student care nu face parte din acel proiect si este selectat aleatoriu pentru evaluare.
* **Profesor**
    Poate vizualiza rezultatele evaluarilor, dar nu identitatea juratilor.

## 4. Functionalitati principale

### 4.1 Functionalitati pentru Student MP
* Poate crea un proiect nou.
* Poate defini livrabile partiale.
* Poate adauga pentru fiecare livrabil:
    * un video demonstrativ (upload sau link),
    * un link catre server-ul unde proiectul poate fi accesat.
* Prin inscrierea unui proiect, utilizatorul devine automat eligibil ca jurat pentru alte proiecte.

### 4.2 Functionalitati pentru Student jurat
* La data unui livrabil partial, sistemul selecteaza aleatoriu un numar de studenti pentru juriu.
* Juratul poate acorda o nota proiectului numai daca a fost selectat.
* Note posibile: 1–10 cu maxim 2 zecimale.
* Nota este anonima.
* Juratul poate modifica propria nota doar intr-un interval de 2 ore.

### 4.3 Functionalitati pentru Profesor
* Poate vizualiza evaluarea finala pentru fiecare proiect.
* Nu poate vedea identitatea juratilor.
* Poate vedea istoricul livrabilelor si media finala calculata.

### 4.4 Calculul notei finale (Pentru fiecare livrabil partial)
* Se colecteaza toate notele acordate de jurati.
* Se elimina cea mai mica si cea mai mare nota.
* Media restului notelor devine nota finala a livrabilului.

## 5. Cerinte non-functionale
* Interfata responsive (desktop, mobile).
* Datele sunt stocate intr-o baza relationala (PostgreSQL).
* Aplicatia trebuie deploy-ata pe un serviciu cloud (Azure).
* Cod versionat in Git, commit-uri incrementale, mesaje clare.
* Cod organizat, comentat, cu naming standard (camelCase).
* Securitate de baza: acces controlat prin roluri (MP, jurat, profesor).

## 6. Tehnologii folosite
### Front-end:
* React.js + React Router
* Axios pentru apeluri API
* Component-based architecture

### Back-end:
* Node.js + Express.js
* ORM: Prisma
* JWT pentru autentificare
* Middleware RBAC pentru permisiuni

### Baza de date:
* PostgreSQL

### Deploy:
* Azure

## 7. Model de date (schema initiala) - Tabele principale:
* **Students** (id, name, email, password, role)
* **Projects** (id, title, description, ownerStudentId)
* **Deliverables** (id, projectId, deadline, videoUrl, deploymentUrl)
* **JuryAssignments** (id, deliverableId, studentId, assignedAt)
* **Grades** (id, deliverableId, studentId, value, createdAt, updatedAt)