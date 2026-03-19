# BigCommunity

## General Info

### Project name

BigCommunity

### Elevator pitch

BigCommunity is a centralized platform that helps UTown students discover announcements, events, and Interest Groups across residential colleges and residences, instead of being limited to only their own community.

**Tagline:** One UTown, one place to discover your community.

### Done by

- Keith Shen
- Morpheus Choo
- Shawn Wee
- Zhang Shuhan

## Project Story

### About the project

#### Problem Statement

Residential life around University Town (UTown) is currently quite fragmented. Each residential college (RC) and UTown Residence (UTR) hosts its own set of Interest Groups (IGs), but these are usually open only to students from that particular residence. This creates limited opportunities for cross-residential interaction and makes it difficult for students to join activities or communities that match their interests, especially if their own RC does not offer them. Students are therefore missing out on enriching experiences that could come from exploring IGs beyond their immediate residence.

#### Solution: BigCommunity

BigCommunity is a centralized web platform that consolidates announcements and event details from Interest Groups across all residential colleges and student residences in UTown. It allows IGs to post open events and activities that are accessible to the wider UTown community, enabling students to discover and join groups that align with their passions, regardless of where they live.

#### How we built it

BigCommunity functions as a centralized and user-friendly platform where students can explore and join Interest Groups across UTown. Each IG can post announcements, event details, and participation opportunities that are open to the broader student community, while users can log in securely to access postings, manage their interests, and sign up for events.

For this project, we built the application using React Native, Expo, Expo Router, TypeScript, and Firebase. Firebase Authentication and Cloud Firestore are used to support user accounts, announcements, tags, and RSVP data. We also structured the app around shared context state and service layers so that announcements, profiles, tags, and signups stay synchronized across pages.

#### What inspired us

We were inspired by how disconnected residential communities can feel even though students live just a short walk from one another in UTown. There are many active groups and communities, but the visibility of those activities is often limited by residence boundaries. We wanted to make it easier for students to discover communities outside of their own RC or residence and participate more freely in campus life.

#### What we learned

Through building BigCommunity, we learned a lot about designing shared state across multiple pages, structuring Firebase-backed services cleanly, and handling syncing issues between frontend UI and backend data. We also learned how important permission design is in Firestore, especially when user profiles, event signups, and shared announcement data all need different access patterns.

#### Challenges we faced

One of the main challenges was keeping data consistent across announcements, tags, profile interests, and event signup records. Another was making sure the user experience stayed smooth while syncing Firestore data in real time. We also had to work through Firestore rules carefully so login, tag loading, and event attendance features would work without creating permission conflicts.

#### Impact and feasibility

BigCommunity fosters greater interconnection across residences, encouraging students to engage with broader communities and discover new experiences. It promotes inclusivity, more efficient communication, and a stronger shared culture across UTown.

From an implementation standpoint, the idea is highly feasible:

- The required technology and infrastructure already exist, including campus connectivity and authentication systems.
- With administrative collaboration from RC offices and OSA, event posting and cross-residential participation can be streamlined.
- The platform can start as a small pilot with a few residences and scale over time as adoption increases.

### Technologies used

- TypeScript
- React Native
- Expo
- Expo Router
- Firebase Authentication
- Cloud Firestore
- React Context for shared state
- Firestore security rules

### Technical overview

BigCommunity organizes Interest Group information, event descriptions, tags, and RSVP records in Firestore so users can browse announcements and sign up for activities through one shared interface. Firebase-backed tags help categorize content, while the app structure keeps profile data, announcements, and event participation synchronized across screens. The architecture is designed so recommendation features or smarter discovery logic can be layered in later.

### Try it out

- App locally: run `npm install` and `npx expo start`
- Code: add your repository link here
- Demo: add your deployed app or video link here

## Stack

- Expo
- React Native
- Expo Router
- TypeScript
- Firebase

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

3. Start the app:

```bash
npx expo start
```

4. Open the web version with `w`, or run on iOS/Android from the Expo CLI.

## Project Structure

```text
app/                      Expo Router pages
src/components/           Shared UI building blocks
src/constants/            Theme tokens and reusable constants
src/context/              Global app state and provider
src/data/                 Mock seed data for local development
src/lib/                  Firebase initialization
src/services/             Firebase-facing service layer
src/types/                Shared TypeScript models
```

## Architecture Notes

- `AppProvider` stores the active user, announcements, selected announcement, and loading state.
- Services are split from UI so Firebase integration can evolve without forcing component rewrites.
- Shared interfaces in `src/types` keep data passing between pages explicit and readable.
- The app currently uses mock data for announcements while leaving clear hooks for Firestore/Auth.

## Next Steps

- Add Firebase credentials to `.env`
- Web analytics can be initialized through `getFirebaseAnalytics()` from `src/lib/firebase.ts`
- Replace the mock auth and announcement service methods with live Firebase calls
- Add admin announcement creation and edit flows
- Add role-based access if different community members need different permissions

## Firestore Rules

Use the starter rules in `firestore.rules` so signed-in users can create and read their own profile documents:

```text
firebase console -> Firestore Database -> Rules
```

Paste the contents of `firestore.rules` there and publish them before testing registration/login.
