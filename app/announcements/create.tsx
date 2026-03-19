import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "@/components/Screen";
import { TagSelector } from "@/components/TagSelector";
import { theme } from "@/constants/theme";
import { useAppContext } from "@/context/AppContext";
import { TagId } from "@/types";

const defaultAudience = ["admin", "member", "organiser"] as const;

export default function CreateAnnouncementScreen() {
  const { state, createAnnouncement } = useAppContext();
  const role = state.currentUser?.role;
  const canCreateAnnouncements = role === "organiser" || role === "admin";

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Event");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<TagId[]>(state.currentUser?.interests ?? []);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleTag = (tagId: TagId) => {
    setSelectedTags((currentTags) =>
      currentTags.includes(tagId) ? currentTags.filter((currentTag) => currentTag !== tagId) : [...currentTags, tagId]
    );
  };

  const handleCreate = () => {
    if (!canCreateAnnouncements) {
      setErrorMessage("Only organisers and admins can create announcements.");
      return;
    }

    if (!title.trim() || !summary.trim() || !body.trim()) {
      setErrorMessage("Title, summary, and body are required.");
      return;
    }

    if (selectedTags.length === 0) {
      setErrorMessage("Select at least one tag.");
      return;
    }

    createAnnouncement({
      title,
      summary,
      body,
      category,
      tags: selectedTags,
      audience: [...defaultAudience]
    });

    router.replace("/announcements");
  };

  if (!canCreateAnnouncements) {
    return (
      <Screen>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Access restricted</Text>
          <Text style={styles.emptyBody}>Only organisers and admins can create announcements.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollEnabled>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Create announcement</Text>
          <Text style={styles.subtitle}>Add event details and tags so members and organisers with matching tags can discover it.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Community town hall"
            placeholderTextColor={theme.colors.textMuted}
          />

          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Event"
            placeholderTextColor={theme.colors.textMuted}
          />

          <Text style={styles.label}>Summary</Text>
          <TextInput
            style={styles.input}
            value={summary}
            onChangeText={setSummary}
            placeholder="Short one-line summary"
            placeholderTextColor={theme.colors.textMuted}
          />

          <Text style={styles.label}>Body</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={body}
            onChangeText={setBody}
            placeholder="Share full event details"
            placeholderTextColor={theme.colors.textMuted}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <TagSelector
            title="Announcement tags"
            helperText="Tag this announcement so users with matching tag preferences can see it."
            tags={state.tags}
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
          />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <View style={styles.actions}>
            <Pressable onPress={handleCreate} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Publish announcement</Text>
            </Pressable>

            <Pressable onPress={() => router.back()} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.lg
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
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
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
    minHeight: 140
  },
  actions: {
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
  errorText: {
    color: "#9a2f12",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "800"
  },
  emptyBody: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  }
});
