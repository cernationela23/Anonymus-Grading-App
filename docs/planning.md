Plan de proiect – Aplicatie web acordare anonima de note

---

## Etapa 1 – Specificatii si plan initial
Termen: 16.11.2025

### Livrabile:
* Specificatii detaliate ale aplicatiei (functionalitati, actori, calcul nota, tehnologiile folosite, model baza de date, arhitectura high-level)
* Plan de proiect
* Repository GitHub
* Profesorul invitat ca collaborator in repository

### Activitati principale:
* Definirea functionalitatilor si actorilor
* Crearea structurii proiectului in Git (foldere, README, docs)
* Stabilirea modelelor de date pentru baza relationala
* Configurarea mediului de dezvoltare (Node.js + React + Prisma + PostgreSQL)

---

## Etapa 2 – Serviciu RESTful functional
Termen: 06.12.2025

### Livrabile:
* Serviciu RESTful functional in repository
* Endpoint-uri pentru:
    * autentificare/login (JWT)
    * creare/afisare proiecte
    * creare/afisare livrabile partiale
    * selectare jurati aleatoriu
    * adaugare/modificare nota
* Instructiuni de rulare pentru backend (README)

### Activitati principale:
* Implementare backend Node.js + Express.js
* Conectare la baza de date PostgreSQL prin Prisma
* Implementare JWT pentru autentificare
* Middleware pentru control acces pe roluri (MP, jurat, profesor)
* Testare API
* Commit incremental cu mesaje clare

---

## Etapa 3 – Aplicatie completa
Termen: ultimul seminar

### Livrabile:
* Frontend SPA (React) conectat la backend REST
* Interfata pentru:
    * studenti MP (dashboard, creare proiect, upload link/video)
    * jurati (afisare proiecte de evaluat, formular nota)
    * profesor (vizualizare evaluari anonime si media finala)
* Calcul automat nota finala, excluzand nota cea mai mica si cea mai mare
* Limitare timp modificare note
* Deploy complet pe Azure (frontend + backend + baza de date)
* Demo functional