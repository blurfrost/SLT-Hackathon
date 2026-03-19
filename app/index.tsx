import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";

import { AnnouncementCard } from "@/components/AnnouncementCard";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { theme } from "@/constants/theme";
import { useAppContext } from "@/context/AppContext";
import { announcementService } from "@/services/announcementService";
import { Announcement } from "@/types";

export default function HomeScreen() {
  const { state } = useAppContext();
  const [homeAnnouncements, setHomeAnnouncements] = useState<Announcement[]>(state.announcements);

  useEffect(() => {
    let isMounted = true;

    const loadAnnouncements = async () => {
      if (!state.currentUser) {
        if (isMounted) {
          setHomeAnnouncements(state.announcements);
        }

        return;
      }

      const announcementsForHome =
        state.currentUser.role === "member"
          ? await announcementService.listTagMatchedAnnouncementsForUser(state.currentUser, state.announcements)
          : await announcementService.listAnnouncementsForUser(state.currentUser, state.announcements);

      if (isMounted) {
        setHomeAnnouncements(announcementsForHome);
      }
    };

    void loadAnnouncements();

    return () => {
      isMounted = false;
    };
  }, [state.announcements, state.currentUser]);

  const featuredAnnouncements = useMemo(() => homeAnnouncements.slice(0, 3), [homeAnnouncements]);
  const featuredSubtitle =
    state.currentUser?.role === "member"
      ? "Showing only announcements that match the tags you selected."
      : "These cards are driven by typed data and can later be sourced from Firestore.";

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Community announcement framework</Text>
          <Text style={styles.title}>BigCommunity keeps updates visible, organized, and easy to extend.</Text>
          <Text style={styles.subtitle}>
            Start with a clear structure for registration, persistent data, and cross-page information sharing.
          </Text>

          <View style={styles.heroActions}>
            <Link href="/announcements" style={styles.primaryAction}>
              Browse announcements
            </Link>

            {!state.currentUser ? (
              <Link href="/login" style={styles.secondaryAction}>
                Log in
              </Link>
            ) : (
              <Link href="/profile" style={styles.secondaryAction}>
                Profile
              </Link>
            )}
          </View>
        </View>

        <SectionHeader
          title="Featured announcements"
          subtitle={featuredSubtitle}
        />

        <View style={styles.grid}>
          {featuredAnnouncements.length > 0 ? (
            featuredAnnouncements.map((announcement) => <AnnouncementCard key={announcement.id} announcement={announcement} />)
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No matching announcements yet</Text>
              <Text style={styles.emptyBody}>
                {state.currentUser?.role === "member"
                  ? "Update your tag preferences in your profile to receive announcements relevant to you."
                  : "There are no announcements available right now."}
              </Text>
            </View>
          )}
        </View>

        <SectionHeader
          title="Current session snapshot"
          subtitle="This demonstrates how user and app variables can be shared cleanly across pages."
        />

        <View style={styles.snapshotCard}>
          <View style={styles.snapshotRow}>
            <Text style={styles.snapshotLabel}>Active user</Text>
            <Text style={styles.snapshotValue}>{state.currentUser?.displayName ?? "Not signed in"}</Text>
          </View>
          <View style={styles.snapshotRow}>
            <Text style={styles.snapshotLabel}>Role</Text>
            <Text style={styles.snapshotValue}>{state.currentUser?.role ?? "Not assigned"}</Text>
          </View>
          <View style={styles.snapshotRow}>
            <Text style={styles.snapshotLabel}>Announcements loaded</Text>
            <Text style={styles.snapshotValue}>{state.announcements.length}</Text>
          </View>
          <View style={styles.snapshotRow}>
            <Text style={styles.snapshotLabel}>Selected announcement</Text>
            <Text style={styles.snapshotValue}>{state.selectedAnnouncementId ?? "None selected"}</Text>
          </View>
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
  hero: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xl,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.xl
  },
  eyebrow: {
    color: theme.colors.accent,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 720
  },
  primaryAction: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.pill,
    color: theme.colors.surface,
    fontSize: 15,
    fontWeight: "700",
    overflow: "hidden",
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm
  },
  secondaryAction: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md
  },
  grid: {
    gap: theme.spacing.lg
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
    fontSize: 18,
    fontWeight: "800"
  },
  emptyBody: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  snapshotCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg
  },
  snapshotRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  snapshotLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600"
  },
  snapshotValue: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: "700"
  }
});
