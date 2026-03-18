import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { theme } from "@/constants/theme";

type ScreenProps = PropsWithChildren<{
  scrollEnabled?: boolean;
}>;

export function Screen({ children, scrollEnabled = false }: ScreenProps) {
  if (scrollEnabled) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
        {children}
      </ScrollView>
    );
  }

  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl
  }
});
