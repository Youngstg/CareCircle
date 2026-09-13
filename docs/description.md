# CareCircle — Product Description

## 1. Product Summary

CareCircle is a responsive web application that helps families coordinate the **non-medical aspects of caring for a family member**. It brings schedules, responsibilities, checklists, shared notes, important contacts, and recent activity into one private workspace called a **Care Circle**.

The product exists because family care information is often fragmented across private chats, group messages, paper notes, photo galleries, and individual memory. CareCircle creates a single source of truth so everyone knows what needs to happen, when it needs to happen, and who is responsible.

CareCircle is **not** a medical record, diagnostic tool, medication recommender, or emergency service.

## 2. Portfolio Objective

This project must demonstrate:

- human-centered problem solving;
- clear translation of a real problem into a focused digital product;
- thoughtful information architecture and accessible interface design;
- full-stack technical exploration;
- privacy-aware product decisions;
- iteration based on realistic user feedback.

The portfolio story should emphasize the reasoning behind the solution, not only the technology used.

## 3. Problem Statement

When a relative needs ongoing care, coordination is usually shared by several family members. Important information is scattered across different people and channels. This can result in duplicated work, forgotten documents, unclear responsibilities, and last-minute confusion before an appointment.

The underlying problem is not a lack of communication. It is the absence of a structured, shared place for coordination.

## 4. How Might We

> How might we help families coordinate care responsibilities clearly without turning the experience into a complicated clinical system?

## 5. Target Users

### Primary user — Family coordinator

A person who usually organizes appointments, assigns responsibilities, prepares documents, and follows up with other family members.

Needs:

- see the overall care plan quickly;
- assign tasks with clear ownership;
- know whether preparation is complete;
- reduce repetitive follow-up messages.

### Secondary user — Supporting family member

A relative who helps with transportation, documents, meals, companionship, or other practical needs.

Needs:

- immediately understand what they need to do;
- receive only relevant information;
- update a task without learning a complicated tool;
- know what changed since their last visit.

## 6. Value Proposition

CareCircle gives a family one calm, private place to coordinate care, so responsibilities are visible and no one has to reconstruct the plan from scattered messages.

## 7. Core User Journey

1. A user signs in and creates a Care Circle.
2. The user gives the circle a neutral name, such as “Keluarga Sitanggang”.
3. The user invites trusted family members using a secure invite link or code.
4. Members add upcoming appointments or family activities.
5. Each activity contains a preparation checklist and assigned people.
6. Members add and complete standalone tasks.
7. Members leave concise shared notes and save important contacts.
8. The dashboard shows what is happening today, what is overdue, and what recently changed.

## 8. MVP Features

### 8.1 Authentication and onboarding

- email sign-up and sign-in;
- create a new Care Circle;
- join a circle using an invite code;
- choose a display name and optional avatar;
- demo mode with seeded fictional data.

### 8.2 Shared dashboard

- personal greeting and selected Care Circle;
- next upcoming activity;
- tasks due today and overdue tasks;
- preparation progress for the next activity;
- recent family activity;
- quick actions: add task, add schedule, add note.

### 8.3 Tasks

- create, edit, assign, complete, and delete a task;
- optional due date and priority;
- filters: all, mine, open, completed;
- visible owner and completion status;
- confirmation before destructive actions.

### 8.4 Schedule and preparation checklist

- create an appointment or non-medical family activity;
- date, time, location, description, and responsible companion;
- attach a preparation checklist, such as identification, previous results, or transportation confirmation;
- upcoming and past views;
- calendar-style monthly overview plus a mobile-friendly agenda view.

### 8.5 Shared notes

- create short coordination notes;
- pin important notes;
- show author and timestamp;
- do not provide medical interpretation or diagnosis fields.

### 8.6 Important contacts

- save a contact name, role, phone number, and optional address;
- one-tap phone link on supported devices;
- examples: hospital desk, driver, relative, insurance contact;
- contacts are visible only within their Care Circle.

### 8.7 Members and activity history

- member list with `Coordinator` and `Member` roles;
- coordinator can invite and remove members;
- timeline of meaningful events: task assigned, task completed, schedule added, note pinned;
- activity history is readable, concise, and not editable by regular users.

## 9. Roles and Permissions

| Capability | Coordinator | Member |
| --- | --- | --- |
| View circle content | Yes | Yes |
| Create and update tasks, schedules, notes, contacts | Yes | Yes |
| Complete assigned tasks | Yes | Yes |
| Invite members | Yes | No |
| Remove members | Yes | No |
| Change circle settings | Yes | No |
| Delete the Care Circle | Yes | No |

All records must be isolated by Care Circle. A user must never be able to read or modify data belonging to a circle they have not joined.

## 10. Explicit Non-goals

Do not build these into the MVP:

- diagnosis, symptom checking, or medical advice;
- dosage calculation or medication recommendations;
- communication with doctors or hospitals;
- insurance claims;
- real-time chat;
- video calls;
- payment features;
- GPS tracking;
- public profiles or a public social feed;
- storing real patient documents in the public demo.

## 11. Privacy and Safety Requirements

- Use fictional data for screenshots, demos, and testing.
- Avoid asking for diagnosis, medical history, identification numbers, or other unnecessary sensitive data.
- Clearly state that CareCircle supports family coordination and does not replace professional medical guidance.
- Store only the minimum information needed for coordination.
- Require authentication for all Care Circle content.
- Validate authorization on the server and enforce database row-level security.
- Do not expose private data in URLs, logs, analytics events, or client-side error messages.

## 12. Success Criteria

The MVP is successful when a test user can:

- create or join a Care Circle without assistance;
- understand today's responsibilities within 10 seconds of opening the dashboard;
- create and assign a task in under one minute;
- create an activity and preparation checklist without confusion;
- identify who owns each responsibility;
- tell what changed recently;
- use the main flow on a mobile screen and with keyboard navigation.

## 13. Suggested User Research

Interview 3–5 people who have helped coordinate family care. Do not request confidential medical details. Ask about coordination behavior instead:

1. How do you currently share appointments and responsibilities?
2. What information is most often forgotten or repeated?
3. Who usually becomes the coordinator, and why?
4. What creates confusion before an appointment?
5. What would make a shared tool feel too complicated or intrusive?

Translate findings into an affinity map, top pain points, and changes to the MVP. Do not fabricate research results. If research has not happened, label assumptions as hypotheses.

## 14. Portfolio Case Study Outline

1. Context and observed coordination problem.
2. Research approach and ethical boundaries.
3. Key findings or clearly labeled hypotheses.
4. How Might We statement.
5. Early user flow and feature prioritization.
6. Wireframes and design iterations.
7. Technical architecture and privacy decisions.
8. Working MVP and core flow.
9. Usability feedback and what changed.
10. Reflection: what was learned and what would be improved next.

## 15. Product Voice

The interface language is Indonesian. The tone must be calm, supportive, direct, and non-clinical.

Preferred examples:

- “Apa yang perlu disiapkan hari ini?”
- “Tugas berhasil diberikan kepada Rina.”
- “Semua persiapan untuk jadwal berikutnya sudah selesai.”
- “Belum ada catatan. Tambahkan informasi yang perlu diketahui keluarga.”

Avoid alarming language, guilt, excessive exclamation marks, and medical claims.

## 16. Definition of Done

CareCircle is portfolio-ready when:

- the end-to-end happy path works with persistent data;
- authorization and circle-level data isolation are verified;
- loading, empty, error, and success states exist;
- the interface is responsive from 360 px mobile screens to desktop;
- core pages are keyboard accessible and have visible focus states;
- demo data uses fictional names and situations;
- README includes setup instructions, problem context, screenshots, and privacy disclaimer;
- no unfinished placeholder sections or fake functionality are presented as complete.

