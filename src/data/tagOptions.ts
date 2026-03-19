import { Tag, UserRole } from "@/types";

export const roleOptions: { label: string; value: UserRole }[] = [
  { label: "Admin", value: "admin" },
  { label: "Members", value: "member" },
  { label: "Organiser", value: "organiser" }
];

export const roleDescriptions: Record<UserRole, { title: string; description: string }> = {
  admin: {
    title: "Admin access",
    description: "Admins can create and manage tags so the platform taxonomy stays consistent."
  },
  member: {
    title: "Member access",
    description: "Members can choose the tags they are interested in and receive messages that match those tags."
  },
  organiser: {
    title: "Organiser access",
    description: "Organisers can select existing tags and assign them to community messages and announcements."
  }
};

export const seedTags: Tag[] = [
  {
    id: "spikeball-ig",
    label: "Spikeball IG",
    description: "Updates and activities for the Spikeball interest group."
  },
  {
    id: "rock-climbing-ig",
    label: "Rock climbing IG",
    description: "Events and announcements for the rock climbing interest group."
  },
  {
    id: "orca-code",
    label: "Orca Code",
    description: "Coding meetups, project sessions, and developer community updates."
  },
  {
    id: "anime-ig",
    label: "Anime IG",
    description: "Announcements for anime screenings, chats, and fandom meetups."
  },
  {
    id: "smash-bros",
    label: "Smash Bros",
    description: "Tournament news, casual sessions, and Smash Bros community events."
  },
  {
    id: "food-ig",
    label: "Food IG",
    description: "Food outings, recommendations, and culinary community gatherings."
  }
];
