import { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { buildPatientUiSpec, sampleEhr } from "@/data/patient-ui-config";

export default function HomeScreen() {
  const uiSpec = useMemo(() => buildPatientUiSpec(sampleEhr), []);
  const [transcript, setTranscript] = useState(
    "I need help with my medication.",
  );
  const [listening, setListening] = useState(uiSpec.accessibility.voiceInput);

  const fontScale = uiSpec.accessibility.largeText ? 1.15 : 1;
  const contrast = uiSpec.accessibility.highContrast;

  return (
    <ThemedView
      style={[styles.container, contrast && styles.contrastContainer]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <View>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={{ fontSize: 12 * fontScale }}
            >
              Patient support
            </ThemedText>
            <ThemedText type="title" style={{ fontSize: 30 * fontScale }}>
              {uiSpec.patientName}
            </ThemedText>
          </View>

          <View style={styles.roomBadge}>
            <ThemedText
              type="smallBold"
              style={{ color: "#fff", fontSize: 12 * fontScale }}
            >
              Room {uiSpec.roomNumber}
            </ThemedText>
          </View>
        </View>

        <View style={[styles.banner, contrast && styles.bannerContrast]}>
          <ThemedText type="smallBold" style={{ fontSize: 13 * fontScale }}>
            {uiSpec.banner}
          </ThemedText>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setListening((prev) => !prev)}
          style={[styles.voiceButton, contrast && styles.voiceButtonContrast]}
        >
          <ThemedText style={{ fontSize: 42 * fontScale }}>🎙️</ThemedText>
          <ThemedText
            type="smallBold"
            style={{ fontSize: 14 * fontScale, color: "#fff" }}
          >
            {listening ? "Listening..." : "Tap to speak"}
          </ThemedText>
        </TouchableOpacity>

        <TextInput
          value={transcript}
          onChangeText={setTranscript}
          placeholder="Say or type your request"
          placeholderTextColor={contrast ? "#dfe8f5" : "#6a7280"}
          multiline
          style={[
            styles.textInput,
            contrast && styles.textInputContrast,
            { fontSize: 16 * fontScale },
          ]}
        />

        <View style={styles.statusRow}>
          <View
            style={[styles.statusPill, contrast && styles.statusPillContrast]}
          >
            <ThemedText type="smallBold" style={{ fontSize: 12 * fontScale }}>
              {uiSpec.statusChip}
            </ThemedText>
          </View>
          <View
            style={[styles.statusPill, contrast && styles.statusPillContrast]}
          >
            <ThemedText type="smallBold" style={{ fontSize: 12 * fontScale }}>
              {uiSpec.language}
            </ThemedText>
          </View>
        </View>

        <View style={styles.actionGrid}>
          {uiSpec.actions.map((action) => (
            <Pressable
              key={action.id}
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: action.accent, opacity: pressed ? 0.9 : 1 },
                action.kind === "secondary" && styles.secondaryAction,
              ]}
            >
              <ThemedText
                type="smallBold"
                style={{ color: "#fff", fontSize: 14 * fontScale }}
              >
                {action.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        <View
          style={[styles.summaryBox, contrast && styles.summaryBoxContrast]}
        >
          <ThemedText type="smallBold" style={{ fontSize: 14 * fontScale }}>
            Needs summary
          </ThemedText>
          <ThemedText type="small" style={{ fontSize: 13 * fontScale }}>
            {uiSpec.summary}
          </ThemedText>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  contrastContainer: {
    backgroundColor: "#08131f",
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: "100%",
    alignSelf: "center",
    padding: Spacing.three,
    gap: Spacing.three,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  roomBadge: {
    backgroundColor: "#1f6feb",
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  banner: {
    backgroundColor: "#e8f0ff",
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  bannerContrast: {
    backgroundColor: "#17314d",
  },
  voiceButton: {
    backgroundColor: "#1f6feb",
    borderRadius: 28,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
  },
  voiceButtonContrast: {
    backgroundColor: "#0d74ff",
  },
  textInput: {
    minHeight: 100,
    padding: Spacing.three,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#dbe3ef",
    backgroundColor: "#ffffff",
    textAlignVertical: "top",
  },
  textInputContrast: {
    backgroundColor: "#111b29",
    borderColor: "#8bb8ff",
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  statusPill: {
    backgroundColor: "#edf3ff",
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  statusPillContrast: {
    backgroundColor: "#16324f",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  actionButton: {
    flexBasis: "48%",
    minHeight: 72,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.two,
  },
  secondaryAction: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  summaryBox: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: Spacing.three,
    gap: Spacing.one,
    borderWidth: 1,
    borderColor: "#e5ebf3",
  },
  summaryBoxContrast: {
    backgroundColor: "#111b29",
    borderColor: "#2a4162",
  },
});
