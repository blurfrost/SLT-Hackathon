import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  writeBatch
} from "firebase/firestore";

import { firebaseDb } from "@/lib/firebase";
import { EventSignup } from "@/types";

type SignupPayload = {
  eventId: string;
  name: string;
  email: string;
  userId: string | null;
};

export async function submitSignup(payload: SignupPayload) {
  if (!payload.userId) {
    throw new Error("Please log in before signing up for an event.");
  }

  const signupsRef = collection(firebaseDb, "events", payload.eventId, "signups");
  const signupRef = doc(signupsRef, payload.userId);
  const userRef = doc(firebaseDb, "users", payload.userId);

  const batch = writeBatch(firebaseDb);

  batch.set(signupRef, {
    name: payload.name,
    email: payload.email,
    userId: payload.userId,
    signedUpAt: serverTimestamp()
  });

  batch.set(
    userRef,
    {
      signedUpEventIds: arrayUnion(payload.eventId)
    },
    {
      merge: true
    }
  );

  await batch.commit();
}

export async function listEventSignups(eventId: string): Promise<EventSignup[]> {
  const signupsRef = collection(firebaseDb, "events", eventId, "signups");
  const snapshot = await getDocs(signupsRef);

  return snapshot.docs
    .map((signupDoc) => {
      const signup = signupDoc.data() as Partial<EventSignup>;

      return {
        id: signupDoc.id,
        name: signup.name ?? "",
        email: signup.email ?? "",
        userId: signup.userId ?? null
      };
    })
    .filter((signup) => signup.name);
}

export function subscribeToEventSignups(
  eventId: string,
  onNext: (signups: EventSignup[]) => void,
  onError?: (error: Error) => void
) {
  const signupsRef = collection(firebaseDb, "events", eventId, "signups");

  return onSnapshot(
    signupsRef,
    (snapshot) => {
      const signups = snapshot.docs
        .map((signupDoc) => {
          const signup = signupDoc.data() as Partial<EventSignup>;

          return {
            id: signupDoc.id,
            name: signup.name ?? "",
            email: signup.email ?? "",
            userId: signup.userId ?? null
          };
        })
        .filter((signup) => signup.name);

      onNext(signups);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    }
  );
}

export async function checkIfSignedUp(eventId: string, userId: string | null): Promise<boolean> {
  if (!userId) {
    return false;
  }

  const signupsRef = collection(firebaseDb, "events", eventId, "signups");
  const signupQuery = query(signupsRef, where("userId", "==", userId));
  const snapshot = await getDocs(signupQuery);

  return !snapshot.empty;
}
