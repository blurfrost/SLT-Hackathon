import { collection, doc, getDoc, getDocs, writeBatch } from "firebase/firestore";

import { mockAnnouncements } from "@/data/mockAnnouncements";
import { firebaseDb } from "@/lib/firebase";
import { Announcement, TagId, UserProfile } from "@/types";

function normalizeTagIds(tags: TagId[]): TagId[] {
  return Array.from(new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)));
}

function hasTagMatch(announcementTags: TagId[], userTags: TagId[]): boolean {
  if (announcementTags.length === 0 || userTags.length === 0) {
    return false;
  }

  const userTagSet = new Set(normalizeTagIds(userTags));

  return normalizeTagIds(announcementTags).some((tag) => userTagSet.has(tag));
}

const announcementsCollection = collection(firebaseDb, "announcements");
const bootstrapDocRef = doc(firebaseDb, "appMeta", "announcementsBootstrap");

function normalizeAnnouncement(id: string, data: Partial<Announcement>): Announcement {
  return {
    id,
    title: data.title ?? "",
    summary: data.summary ?? "",
    body: data.body ?? "",
    category: data.category ?? "",
    authorName: data.authorName ?? "",
    audience: data.audience ?? [],
    tags: data.tags ?? [],
    publishedAt: data.publishedAt ?? ""
  };
}

export const announcementService = {
  async ensureAnnouncementsBootstrapped(): Promise<void> {
    const bootstrapSnapshot = await getDoc(bootstrapDocRef);

    if (bootstrapSnapshot.exists()) {
      return;
    }

    const batch = writeBatch(firebaseDb);

    mockAnnouncements.forEach((announcement) => {
      batch.set(doc(firebaseDb, "announcements", announcement.id), announcement);
    });

    batch.set(bootstrapDocRef, {
      seededAt: new Date().toISOString(),
      seededCount: mockAnnouncements.length
    });

    await batch.commit();
  },

  async listAnnouncements(): Promise<Announcement[]> {
    const snapshot = await getDocs(announcementsCollection);

    return snapshot.docs.map((announcementDoc) =>
      normalizeAnnouncement(announcementDoc.id, announcementDoc.data() as Partial<Announcement>)
    );
  },

  async getAnnouncementById(id: string): Promise<Announcement | null> {
    const announcementSnapshot = await getDoc(doc(firebaseDb, "announcements", id));

    if (!announcementSnapshot.exists()) {
      return null;
    }

    return normalizeAnnouncement(id, announcementSnapshot.data() as Partial<Announcement>);
  },

  async listAnnouncementsForUser(user: UserProfile | null, announcements: Announcement[] = mockAnnouncements): Promise<Announcement[]> {
    if (!user || user.role === "admin") {
      return Promise.resolve(announcements);
    }

    const roleVisibleAnnouncements = announcements.filter((announcement) => announcement.audience.includes(user.role));
    const relevantAnnouncements = roleVisibleAnnouncements.filter((announcement) => hasTagMatch(announcement.tags, user.interests));

    return Promise.resolve(relevantAnnouncements);
  },

  async listTagMatchedAnnouncementsForUser(user: UserProfile | null, announcements: Announcement[] = mockAnnouncements): Promise<Announcement[]> {
    if (!user) {
      return Promise.resolve([]);
    }

    return this.listAnnouncementsForUser(user, announcements);
  }
};
