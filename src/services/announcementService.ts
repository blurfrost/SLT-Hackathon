import { mockAnnouncements } from "@/data/mockAnnouncements";
import { Announcement } from "@/types";

export const announcementService = {
  async listAnnouncements(): Promise<Announcement[]> {
    return Promise.resolve(mockAnnouncements);
  },

  async getAnnouncementById(id: string): Promise<Announcement | null> {
    const announcement = mockAnnouncements.find((item) => item.id === id) ?? null;
    return Promise.resolve(announcement);
  }
};
