import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { AnnouncementCard } from "@/components/AnnouncementCard";
import { Screen } from "@/components/Screen";
import { TagSelector } from "@/components/TagSelector";
import { theme } from "@/constants/theme";
import { useAppContext } from "@/context/AppContext";
import { roleOptions } from "@/data/tagOptions";
import { announcementService } from "@/services/announcementService";
import { Announcement, AnnouncementInput, TagId, UserRole } from "@/types";

const defaultAudience: UserRole[] = ["admin", "member", "organiser"];

function createEmptyDraft(initialTags: TagId[] = []): AnnouncementInput {
  return {
    title: "",
    summary: "",
    body: "",
    category: "Event",
    audience: [...defaultAudience],
    tags: initialTags
  };
}

export default function AnnouncementsScreen() {
  const { state, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAppContext();
  const role = state.currentUser?.role;
  const canCreateAnnouncements = role === "organiser" || role === "admin";
  const canAdminManageAnnouncements = role === "admin";

  const [visibleAnnouncements, setVisibleAnnouncements] = useState<Announcement[]>(state.announcements);
  const [matchedAnnouncements, setMatchedAnnouncements] = useState<Announcement[]>([]);
  const [draftAnnouncement, setDraftAnnouncement] = useState<AnnouncementInput>(createEmptyDraft(state.currentUser?.interests ?? []));
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const pageSubtitle = useMemo(() => {
    if (canAdminManageAnnouncements) {
      return "Admins can create, edit, and delete announcements while controlling their assigned tags.";
    }

    if (role === "organiser") {
      return "Create event announcements and assign the relevant tags so members get targeted updates.";
    }

    return "A simple, scalable listing page for community-wide updates, notices, and event messages.";
  }, [canAdminManageAnnouncements, role]);

  useEffect(() => {
    if (editingAnnouncementId) {
      return;
    }

    setDraftAnnouncement(createEmptyDraft(state.currentUser?.interests ?? []));
  }, [editingAnnouncementId, state.currentUser?.interests]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      announcementService.listAnnouncementsForUser(state.currentUser, state.announcements),
      announcementService.listTagMatchedAnnouncementsForUser(state.currentUser, state.announcements)
    ]).then(([roleVisible, tagMatched]) => {
      if (isMounted) {
        setVisibleAnnouncements(roleVisible);
        setMatchedAnnouncements(tagMatched);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [state.announcements, state.currentUser]);

  const toggleDraftTag = (tagId: TagId) => {
    setDraftAnnouncement((currentDraft) => ({
      ...currentDraft,
      tags: currentDraft.tags.includes(tagId)
        ? currentDraft.tags.filter((currentTag) => currentTag !== tagId)
        : [...currentDraft.tags, tagId]
    }));
  };

  const toggleAudienceRole = (audienceRole: UserRole) => {
    setDraftAnnouncement((currentDraft) => ({
      ...currentDraft,
      audience: currentDraft.audience.includes(audienceRole)
        ? currentDraft.audience.filter((roleOption) => roleOption !== audienceRole)
        : [...currentDraft.audience, audienceRole]
    }));
  };

  const startEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncementId(announcement.id);
    setDraftAnnouncement({
      title: announcement.title,
      summary: announcement.summary,
      body: announcement.body,
      category: announcement.category,
      audience: [...announcement.audience],
      tags: [...announcement.tags]
    });
    setFormError("");
    setFormMessage("Editing selected announcement");
  };

  const resetForm = () => {
    setEditingAnnouncementId(null);
    setDraftAnnouncement(createEmptyDraft(state.currentUser?.interests ?? []));
  };

  const handleSubmitAnnouncement = () => {
    if (!draftAnnouncement.title.trim() || !draftAnnouncement.summary.trim() || !draftAnnouncement.body.trim()) {
      setFormError("Title, summary, and body are required.");
      return;
    }

    if (draftAnnouncement.tags.length === 0) {
      setFormError("Choose at least one tag for this announcement.");
      return;
    }

    if (draftAnnouncement.audience.length === 0) {
      setFormError("Choose at least one audience role.");
      return;
    }

    setFormError("");

    if (editingAnnouncementId) {
      updateAnnouncement(editingAnnouncementId, draftAnnouncement);
      setFormMessage("Announcement updated successfully.");
    } else {
      createAnnouncement(draftAnnouncement);
      setFormMessage("Announcement created successfully.");
    }

    resetForm();
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    Alert.alert("Delete announcement", `Delete \"${announcement.title}\"? This cannot be undone.`, [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteAnnouncement(announcement.id);
          setFormMessage("Announcement deleted.");

          if (editingAnnouncementId === announcement.id) {
            resetForm();
          }
        }
      }
    ]);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Announcements</Text>
          <Text style={styles.subtitle}>{pageSubtitle}</Text>
        </View>

        {canCreateAnnouncements ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{editingAnnouncementId ? "Edit announcement" : "Create event announcement"}</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={draftAnnouncement.title}
              onChangeText={(value) => setDraftAnnouncement((currentDraft) => ({ ...currentDraft, title: value }))}
              placeholder="Community town hall"
              placeholderTextColor={theme.colors.textMuted}
            />

            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              value={draftAnnouncement.category}
              onChangeText={(value) => setDraftAnnouncement((currentDraft) => ({ ...currentDraft, category: value }))}
              placeholder="Event"
              placeholderTextColor={theme.colors.textMuted}
            />

            <Text style={styles.label}>Summary</Text>
            <TextInput
              style={styles.input}
              value={draftAnnouncement.summary}
              onChangeText={(value) => setDraftAnnouncement((currentDraft) => ({ ...currentDraft, summary: value }))}
              placeholder="Short one-line summary"
              placeholderTextColor={theme.colors.textMuted}
            />

            <Text style={styles.label}>Body</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={draftAnnouncement.body}
              onChangeText={(value) => setDraftAnnouncement((currentDraft) => ({ ...currentDraft, body: value }))}
              placeholder="Share the full event details"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Audience</Text>
            <View style={styles.audienceGrid}>
              {roleOptions.map((roleOption) => {
                const isSelected = draftAnnouncement.audience.includes(roleOption.value);

                return (
                  <Pressable
                    key={roleOption.value}
                    onPress={() => toggleAudienceRole(roleOption.value)}
                    style={[styles.audienceChip, isSelected && styles.audienceChipSelected]}
                  >
                    <Text style={[styles.audienceChipText, isSelected && styles.audienceChipTextSelected]}>{roleOption.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <TagSelector
              title="Announcement tags"
              helperText="Assign tags so members subscribed to those tags see this announcement on their home feed."
              tags={state.tags}
              selectedTags={draftAnnouncement.tags}
              onToggleTag={toggleDraftTag}
            />

            {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
            {formMessage ? <Text style={styles.successText}>{formMessage}</Text> : null}

            <View style={styles.formActions}>
              <Pressable onPress={handleSubmitAnnouncement} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>{editingAnnouncementId ? "Save changes" : "Publish announcement"}</Text>
              </Pressable>

              {editingAnnouncementId ? (
                <Pressable
                  onPress={() => {
                    resetForm();
                    setFormMessage("Edit cancelled.");
                  }}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Cancel edit</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}

        {state.currentUser ? (
          <View style={styles.list}>
            <Text style={styles.sectionTitle}>Matched for your tags</Text>
            {matchedAnnouncements.length > 0 ? (
              matchedAnnouncements.map((announcement) => (
                <AnnouncementCard key={`matched-${announcement.id}`} announcement={announcement} showSummary />
              ))
            ) : (
              <Text style={styles.emptyText}>No matching event notifications yet for your current tag selections.</Text>
            )}
          </View>
        ) : null}

        <View style={styles.list}>
          <Text style={styles.sectionTitle}>All announcements</Text>
          {visibleAnnouncements.length > 0 ? (
            visibleAnnouncements.map((announcement) => (
              <View key={announcement.id} style={styles.announcementItem}>
                <AnnouncementCard announcement={announcement} showSummary />

                {canAdminManageAnnouncements ? (
                  <View style={styles.adminActions}>
                    <Pressable onPress={() => startEditAnnouncement(announcement)} style={styles.editButton}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>

                    <Pressable onPress={() => handleDeleteAnnouncement(announcement)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No announcements are available for your role.</Text>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl
  },
  header: {
    gap: theme.spacing.sm
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 30,
    fontWeight: "800"
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 720
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
  },
  formTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: theme.spacing.xs
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: theme.spacing.xs
  },
  input: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    color: theme.colors.textPrimary,
    fontSize: 15,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md
  },
  textArea: {
    minHeight: 120
  },
  audienceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs
  },
  audienceChip: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  audienceChipSelected: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent
  },
  audienceChipText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "700"
  },
  audienceChipTextSelected: {
    color: theme.colors.accent
  },
  errorText: {
    color: "#9a2f12",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: theme.spacing.sm
  },
  successText: {
    color: "#2f6b2f",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginTop: theme.spacing.sm
  },
  formActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  primaryButtonText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: "800"
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  secondaryButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "700"
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: "800"
  },
  list: {
    gap: theme.spacing.lg
  },
  announcementItem: {
    gap: theme.spacing.sm
  },
  adminActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: theme.spacing.sm
  },
  editButton: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  editButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: "700"
  },
  deleteButton: {
    backgroundColor: "#9a2f12",
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm
  },
  deleteButtonText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: "700"
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  }
});
