import { StyleSheet, Text, TextInput, View } from "react-native";

import { Screen } from "@/components/Screen";
import { theme } from "@/constants/theme";

export default function AuthScreen() {
  return (
    <Screen scrollEnabled>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Registration flow scaffold</Text>
          <Text style={styles.subtitle}>
            This starter includes a Firebase-ready auth service and a typed registration shape. Replace these inputs with your form logic and validation rules.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Full name</Text>
          <TextInput placeholder="Alex Tan" placeholderTextColor={theme.colors.textMuted} style={styles.input} />
          <Text style={styles.label}>Email address</Text>
          <TextInput placeholder="alex@example.com" placeholderTextColor={theme.colors.textMuted} style={styles.input} />
          <Text style={styles.label}>Community role</Text>
          <TextInput placeholder="Member" placeholderTextColor={theme.colors.textMuted} style={styles.input} />
          <View style={styles.note}>
            <Text style={styles.noteTitle}>Firebase integration point</Text>
            <Text style={styles.noteBody}>
              Use `authService.registerUser` to connect this page to Firebase Authentication and Firestore profile creation.
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.xl
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
    maxWidth: 700
  },
  formCard: {
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
    marginTop: theme.spacing.sm
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
  note: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.md,
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md
  },
  noteTitle: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: "700"
  },
  noteBody: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 22
  }
});
