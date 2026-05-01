import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance, Scenario, ScenarioChoice } from "@/lib/finance-context";

const IMPACT_COLORS = {
    positive: "#2ECC71",
    neutral: "#F39C12",
    negative: "#E74C3C",
};

const IMPACT_LABELS = {
    positive: "Good choice",
    neutral: "Neutral",
    negative: "Risk",
};

export default function ScenariosScreen() {
    const router = useRouter();
    const { state, dispatch } = useFinance();
    const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
    const [chosenFeedback, setChosenFeedback] = useState<{ text: string; impact: string } | null>(null);

    const pendingScenarios = state.scenarios.filter((s) => s.status === "pending");
    const resolvedScenarios = state.scenarios.filter((s) => s.status === "resolved");

    const handleChoose = (scenario: Scenario, choice: ScenarioChoice) => {
        dispatch({
            type: "RESOLVE_SCENARIO",
            payload: { id: scenario.id, choiceId: choice.id },
        });
        dispatch({ type: "ADD_POINTS", payload: 20 });
        setChosenFeedback({ text: choice.feedback, impact: choice.impact });
    };

    const renderScenario = ({ item }: { item: Scenario }) => (
        <TouchableOpacity
            style={[styles.scenarioCard, item.status === "resolved" && styles.scenarioResolved]}
            onPress={() => item.status === "pending" && setActiveScenario(item)}
        >
            <View style={styles.scenarioHeader}>
                <View style={[styles.scenarioIconBg, item.status === "pending" ? styles.pendingBg : styles.resolvedBg]}>
                    <IconSymbol
                        name={item.status === "pending" ? "exclamationmark.triangle.fill" : "checkmark.circle.fill"}
                        size={20}
                        color={item.status === "pending" ? "#F39C12" : "#2ECC71"}
                    />
                </View>
                <View style={styles.scenarioInfo}>
                    <Text style={styles.scenarioTitle}>{item.title}</Text>
                    <Text style={styles.scenarioStatus}>
                        {item.status === "pending" ? "Decision needed" : "Resolved"}
                    </Text>
                </View>
                {item.status === "pending" && (
                    <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>!</Text>
                    </View>
                )}
            </View>
            <Text style={styles.scenarioDesc} numberOfLines={2}>{item.description}</Text>
            {item.status === "pending" && (
                <View style={styles.tapHint}>
                    <Text style={styles.tapHintText}>Tap to decide</Text>
                    <IconSymbol name="chevron.right" size={14} color="#C9A84C" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <ScreenContainer containerClassName="bg-background">
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <IconSymbol name="chevron.left" size={24} color="#C9A84C" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Interactive Scenarios</Text>
                </View>

                <View style={styles.infoCard}>
                    <IconSymbol name="lightbulb.fill" size={20} color="#F39C12" />
                    <Text style={styles.infoText}>
                        Scenarios simulate real financial situations. Your choices help build better financial habits.
                    </Text>
                </View>

                {pendingScenarios.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Decision needed ({pendingScenarios.length})</Text>
                        <FlatList
                            data={pendingScenarios}
                            keyExtractor={(item) => item.id}
                            renderItem={renderScenario}
                            scrollEnabled={false}
                        />
                    </View>
                )}

                {resolvedScenarios.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Resolved</Text>
                        <FlatList
                            data={resolvedScenarios}
                            keyExtractor={(item) => item.id}
                            renderItem={renderScenario}
                            scrollEnabled={false}
                        />
                    </View>
                )}

                {pendingScenarios.length === 0 && resolvedScenarios.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🎰</Text>
                        <Text style={styles.emptyTitle}>No active scenarios</Text>
                        <Text style={styles.emptySubtitle}>Scenarios will appear from time to time to test your financial reflexes.</Text>
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={!!activeScenario}
                animationType="slide"
                transparent
                onRequestClose={() => {
                    setActiveScenario(null);
                    setChosenFeedback(null);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        {chosenFeedback ? (
                            <View style={styles.feedbackView}>
                                <View style={[styles.feedbackIcon, { backgroundColor: IMPACT_COLORS[chosenFeedback.impact as keyof typeof IMPACT_COLORS] + "22" }]}>
                                    <IconSymbol
                                        name={chosenFeedback.impact === "positive" ? "checkmark.circle.fill" : chosenFeedback.impact === "negative" ? "xmark.circle.fill" : "info.circle.fill"}
                                        size={40}
                                        color={IMPACT_COLORS[chosenFeedback.impact as keyof typeof IMPACT_COLORS]}
                                    />
                                </View>
                                <Text style={styles.feedbackLabel}>
                                    {IMPACT_LABELS[chosenFeedback.impact as keyof typeof IMPACT_LABELS]}
                                </Text>
                                <Text style={styles.feedbackText}>{chosenFeedback.text}</Text>
                                <View style={styles.pointsEarned}>
                                    <IconSymbol name="sparkles" size={16} color="#C9A84C" />
                                    <Text style={styles.pointsEarnedText}>+20 points earned!</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.closeBtn}
                                    onPress={() => {
                                        setActiveScenario(null);
                                        setChosenFeedback(null);
                                    }}
                                >
                                    <Text style={styles.closeBtnText}>Continue</Text>
                                </TouchableOpacity>
                            </View>
                        ) : activeScenario ? (

                            <>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalIconBg}>
                                        <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#F39C12" />
                                    </View>
                                    <TouchableOpacity onPress={() => setActiveScenario(null)}>
                                        <IconSymbol name="xmark.circle.fill" size={26} color="#8A8A9A" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.modalTitle}>{activeScenario.title}</Text>
                                <Text style={styles.modalDesc}>{activeScenario.description}</Text>
                                <Text style={styles.choicePrompt}>What do you do?</Text>
                                {activeScenario.choices.map((choice) => (
                                    <TouchableOpacity
                                        key={choice.id}
                                        style={styles.choiceBtn}
                                        onPress={() => handleChoose(activeScenario, choice)}
                                    >
                                        <Text style={styles.choiceBtnText}>{choice.label}</Text>
                                        <IconSymbol name="chevron.right" size={16} color="#C9A84C" />
                                    </TouchableOpacity>
                                ))}
                            </>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 16,
        paddingBottom: 20,
        gap: 12,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#1A1A2E",
        borderWidth: 1,
        borderColor: "#2E2E4A",
        alignItems: "center",
        justifyContent: "center",
    },
    title: { fontSize: 22, fontWeight: "800", color: "#F5F0E8" },
    infoCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#2A1A00",
        borderRadius: 12,
        padding: 14,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#F39C1244",
        gap: 10,
    },
    infoText: { flex: 1, fontSize: 13, color: "#F5F0E8", lineHeight: 20 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 15, fontWeight: "700", color: "#8A8A9A", marginBottom: 12 },
    scenarioCard: {
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    scenarioResolved: { opacity: 0.6 },
    scenarioHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 12 },
    scenarioIconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    pendingBg: { backgroundColor: "#F39C1222" },
    resolvedBg: { backgroundColor: "#2ECC7122" },
    scenarioInfo: { flex: 1 },
    scenarioTitle: { fontSize: 15, fontWeight: "700", color: "#F5F0E8" },
    scenarioStatus: { fontSize: 12, color: "#8A8A9A", marginTop: 2 },
    pendingBadge: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#E74C3C",
        alignItems: "center",
        justifyContent: "center",
    },
    pendingBadgeText: { fontSize: 13, fontWeight: "800", color: "#FFFFFF" },
    scenarioDesc: { fontSize: 13, color: "#8A8A9A", lineHeight: 20, marginBottom: 10 },
    tapHint: { flexDirection: "row", alignItems: "center", gap: 4 },
    tapHintText: { fontSize: 12, color: "#C9A84C" },
    emptyState: {
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 40,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    emptyIcon: { fontSize: 48, marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: "700", color: "#F5F0E8", marginBottom: 8 },
    emptySubtitle: { fontSize: 13, color: "#8A8A9A", textAlign: "center", lineHeight: 20 },

    modalOverlay: { flex: 1, backgroundColor: "#000000CC", justifyContent: "flex-end" },
    modalCard: {
        backgroundColor: "#1A1A2E",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderColor: "#2E2E4A",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalIconBg: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#F39C1222",
        alignItems: "center",
        justifyContent: "center",
    },
    modalTitle: { fontSize: 20, fontWeight: "800", color: "#F5F0E8", marginBottom: 8 },
    modalDesc: { fontSize: 14, color: "#8A8A9A", lineHeight: 22, marginBottom: 20 },
    choicePrompt: { fontSize: 15, fontWeight: "700", color: "#F5F0E8", marginBottom: 12 },
    choiceBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0D0D0D",
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    choiceBtnText: { flex: 1, fontSize: 14, color: "#F5F0E8", fontWeight: "500" },

    feedbackView: { alignItems: "center", paddingVertical: 20 },
    feedbackIcon: {
        width: 80,
        height: 80,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    feedbackLabel: { fontSize: 20, fontWeight: "800", color: "#F5F0E8", marginBottom: 8 },
    feedbackText: { fontSize: 14, color: "#8A8A9A", textAlign: "center", lineHeight: 22, marginBottom: 20 },
    pointsEarned: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#C9A84C22",
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 24,
    },
    pointsEarnedText: { fontSize: 14, color: "#C9A84C", fontWeight: "700" },
    closeBtn: {
        backgroundColor: "#C9A84C",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 40,
    },
    closeBtnText: { color: "#0D0D0D", fontSize: 16, fontWeight: "700" },
});
