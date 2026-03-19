import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc
} from "firebase/firestore";

import { seedTags } from "@/data/tagOptions";
import { firebaseDb } from "@/lib/firebase";
import { Tag, TagId, TagInput } from "@/types";

const tagsCollection = collection(firebaseDb, "tags");

function normalizeTag(id: string, data: Partial<Tag>): Tag {
  return {
    id,
    label: data.label ?? id,
    description: data.description ?? ""
  };
}

function makeTagId(label: string): TagId {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const tagService = {
  async ensureTagsBootstrapped(): Promise<void> {
    const batchChecks = await Promise.all(
      seedTags.map(async (tag) => {
        const tagRef = doc(firebaseDb, "tags", tag.id);
        const snapshot = await getDoc(tagRef);

        return {
          exists: snapshot.exists(),
          ref: tagRef,
          tag
        };
      })
    );

    await Promise.all(
      batchChecks
        .filter((entry) => !entry.exists)
        .map((entry) =>
          setDoc(entry.ref, {
            label: entry.tag.label,
            description: entry.tag.description
          })
        )
    );
  },

  async listTags(): Promise<Tag[]> {
    const snapshot = await getDocs(tagsCollection);

    return snapshot.docs
      .map((tagDoc) => normalizeTag(tagDoc.id, tagDoc.data() as Partial<Tag>))
      .sort((left, right) => left.label.localeCompare(right.label));
  },

  subscribeToTags(onNext: (tags: Tag[]) => void, onError?: (error: Error) => void) {
    return onSnapshot(
      tagsCollection,
      (snapshot) => {
        const tags = snapshot.docs
          .map((tagDoc) => normalizeTag(tagDoc.id, tagDoc.data() as Partial<Tag>))
          .sort((left, right) => left.label.localeCompare(right.label));

        onNext(tags);
      },
      (error) => {
        if (onError) {
          onError(error);
        }
      }
    );
  },

  async createTag(input: TagInput): Promise<Tag> {
    const cleanLabel = input.label.trim();
    const cleanDescription = input.description.trim();
    const tagId = makeTagId(cleanLabel);
    const tagRef = doc(firebaseDb, "tags", tagId);

    await setDoc(tagRef, {
      label: cleanLabel,
      description: cleanDescription || "User-defined tag"
    });

    return {
      id: tagId,
      label: cleanLabel,
      description: cleanDescription || "User-defined tag"
    };
  },

  async updateTag(tagId: TagId, input: TagInput): Promise<Tag> {
    const existingTagRef = doc(firebaseDb, "tags", tagId);
    const cleanLabel = input.label.trim();
    const cleanDescription = input.description.trim();

    await setDoc(
      existingTagRef,
      {
        label: cleanLabel,
        description: cleanDescription || "User-defined tag"
      },
      {
        merge: true
      }
    );

    return {
      id: tagId,
      label: cleanLabel,
      description: cleanDescription || "User-defined tag"
    };
  },

  async deleteTag(tagId: TagId): Promise<void> {
    await deleteDoc(doc(firebaseDb, "tags", tagId));
  }
};
