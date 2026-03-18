import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AnnouncementCard } from "@/components/AnnouncementCard";
import { Screen } from "@/components/Screen";
import { theme } from "@/constants/theme";
import { useAppContext } from "@/context/AppContext";

export default function AnnouncementsScreen() {
  const { state } = useAppContext();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Announcements</Text>
          <Text style={styles.subtitle}>
            A simple, scalable listing page for community-wide updates, notices, and event messages.
          </Text>
        </View>

        <View style={styles.list}>
          {state.announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} showSummary />
          ))}
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
  list: {
    gap: theme.spacing.lg
  }
});
