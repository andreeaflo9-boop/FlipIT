import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useFinance } from "@/lib/finance-context";

const FEATURES = [
    { icon: "coin", text: "'I Want It Now' feature, flip a coin for goals" },
    { icon: "exclamationmark.triangle.fill", text: "More exclusive scenarios and challenges" },
    { icon: "rosette", text: "Extended partnerships and rewards" },
    { icon: "target", text: "Unlimited financial goal slots" },
    { icon: "person.2.fill", text: "Shared account for 2 people at the price of one" },
    { icon: "sparkles", text: "Advanced stats and financial reports" },
];

export default function PremiumScreen() {
    const router = useRouter();
    const { state, dispatch } = useFinance();
    const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");

    const handleSubscribe = () => {
        Alert.alert(
            "Royal Flush Premium",
            `The ${selectedPlan === "annual" ? "annual (€59.99/year)" : "monthly (€7.99/month)"} plan will be activated. This is a demo. Payment integration is available in the full version.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Activate",
                    onPress: () => {
                        const expiresAt = new Date();
                        if (selectedPlan === "annual") {
                            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
                        } else {
                            expiresAt.setMonth(expiresAt.getMonth() + 1);
                        }
                        dispatch({
                            type: "UPDATE_PROFILE",
                            payload: { isPremium: true, premiumExpiresAt: expiresAt.toISOString() },
                        });
                        dispatch({ type: "EARN_BADGE", payload: "b5" });
                        Alert.alert("Congrats!", "Royal Flush Premium is now active. Enjoy all advanced features.");
                        router.back();
                    },
                },
            ]
        );
    };

    const handleInviteFriend = () => {
        Alert.alert(
            "Invite a friend",
            "Send an invite link to your friend. If they sign up, you get 7 free days of Premium.",
            [{ text: "OK" }]
        );
    };

    if (state.profile.isPremium) {
        return (
            <ScreenContainer containerClassName="bg-background">
                <View style={styles.activatedContainer}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <IconSymbol name="chevron.left" size={24} color="#C9A84C" />
                    </TouchableOpacity>
                    <View style={styles.activatedContent}>
                        <LinearGradient
                            colors={["#A8872E", "#C9A84C", "#E8C96D"]}
                            style={styles.activatedIcon}
                        >
                            <IconSymbol name="crown.fill" size={40} color="#0D0D0D" />
                        </LinearGradient>
                        <Text style={styles.activatedTitle}>Royal Flush Active!</Text>
                        <Text style={styles.activatedSubtitle}>
                            You have access to all FlipIT premium features. Enjoy the full experience!
                        </Text>
                        <TouchableOpacity style={styles.backToAppBtn} onPress={() => router.back()}>
                            <Text style={styles.backToAppText}>Back to app</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer containerClassName="bg-background">
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <IconSymbol name="chevron.left" size={24} color="#C9A84C" />
                    </TouchableOpacity>
                </View>


                <View style={styles.hero}>
                    <LinearGradient
                        colors={["#A8872E", "#C9A84C", "#E8C96D"]}
                        style={styles.heroIcon}
                    >
                        <IconSymbol name="crown.fill" size={48} color="#0D0D0D" />
                    </LinearGradient>
                    <Text style={styles.heroTitle}>Royal Flush</Text>
                    <Text style={styles.heroBadge}>PREMIUM</Text>
                    <Text style={styles.heroSubtitle}>
                        Unlock the full financial experience with advanced features and exclusive rewards.
                    </Text>
                </View>


                <View style={styles.planSelector}>
                    <TouchableOpacity
                        style={[styles.planCard, selectedPlan === "annual" && styles.planCardActive]}
                        onPress={() => setSelectedPlan("annual")}
                    >
                        {selectedPlan === "annual" && (
                            <View style={styles.bestValueBadge}>
                                <Text style={styles.bestValueText}>Best value</Text>
                            </View>
                        )}
                        <Text style={styles.planName}>Annual</Text>
                        <Text style={styles.planPrice}>59.99€</Text>
                        <Text style={styles.planPeriod}>/ year</Text>
                        <Text style={styles.planSavings}>Save 36%</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.planCard, selectedPlan === "monthly" && styles.planCardActive]}
                        onPress={() => setSelectedPlan("monthly")}
                    >
                        <Text style={styles.planName}>Monthly</Text>
                        <Text style={styles.planPrice}>7.99€</Text>
                        <Text style={styles.planPeriod}>/ month</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.featuresCard}>
                    <Text style={styles.featuresTitle}>What you get with Premium</Text>
                    {FEATURES.map((f, i) => (
                        <View key={i} style={styles.featureRow}>
                            <View style={styles.featureCheck}>
                                <IconSymbol name="checkmark.circle.fill" size={18} color="#C9A84C" />
                            </View>
                            <Text style={styles.featureText}>{f.text}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe}>
                    <LinearGradient
                        colors={["#E8C96D", "#C9A84C", "#A8872E"]}
                        style={styles.subscribeBtnGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <IconSymbol name="crown.fill" size={20} color="#0D0D0D" />
                        <Text style={styles.subscribeBtnText}>
                            Activate {selectedPlan === "annual" ? "Anual" : "Lunar"}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.inviteCard} onPress={handleInviteFriend}>
                    <IconSymbol name="person.2.fill" size={20} color="#3498DB" />
                    <View style={styles.inviteInfo}>
                        <Text style={styles.inviteTitle}>Invite a friend</Text>
                        <Text style={styles.inviteSubtitle}>Get 7 free days of Premium</Text>
                    </View>
                    <IconSymbol name="chevron.right" size={16} color="#3498DB" />
                </TouchableOpacity>

                <Text style={styles.disclaimer}>
                    The subscription renews automatically. You can cancel anytime from your account settings.
                </Text>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 60 },
    header: { paddingTop: 16, paddingBottom: 8 },
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
    hero: { alignItems: "center", paddingVertical: 32 },
    heroIcon: {
        width: 96,
        height: 96,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    heroTitle: { fontSize: 36, fontWeight: "800", color: "#C9A84C", letterSpacing: 2 },
    heroBadge: {
        backgroundColor: "#C9A84C22",
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginTop: 4,
        marginBottom: 12,
    },
    heroSubtitle: { fontSize: 14, color: "#8A8A9A", textAlign: "center", lineHeight: 22, maxWidth: 280 },
    planSelector: { flexDirection: "row", gap: 12, marginBottom: 20 },
    planCard: {
        flex: 1,
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2E2E4A",
        position: "relative",
    },
    planCardActive: { borderColor: "#C9A84C", backgroundColor: "#C9A84C11" },
    bestValueBadge: {
        position: "absolute",
        top: -10,
        backgroundColor: "#C9A84C",
        borderRadius: 8,
        paddingVertical: 3,
        paddingHorizontal: 10,
    },
    bestValueText: { fontSize: 10, color: "#0D0D0D", fontWeight: "800" },
    planName: { fontSize: 14, color: "#8A8A9A", marginTop: 8, marginBottom: 4 },
    planPrice: { fontSize: 28, fontWeight: "800", color: "#F5F0E8" },
    planPeriod: { fontSize: 13, color: "#8A8A9A" },
    planSavings: { fontSize: 12, color: "#2ECC71", fontWeight: "600", marginTop: 6 },
    featuresCard: {
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    featuresTitle: { fontSize: 16, fontWeight: "700", color: "#F5F0E8", marginBottom: 16 },
    featureRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12 },
    featureCheck: { marginTop: 1 },
    featureText: { flex: 1, fontSize: 14, color: "#F5F0E8", lineHeight: 22 },
    subscribeBtn: { borderRadius: 16, overflow: "hidden", marginBottom: 12 },
    subscribeBtnGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        gap: 10,
    },
    subscribeBtnText: { fontSize: 17, fontWeight: "800", color: "#0D0D0D" },
    inviteCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1A1A2E",
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#3498DB44",
        gap: 14,
    },
    inviteInfo: { flex: 1 },
    inviteTitle: { fontSize: 14, fontWeight: "700", color: "#F5F0E8" },
    inviteSubtitle: { fontSize: 12, color: "#8A8A9A", marginTop: 2 },
    disclaimer: { fontSize: 11, color: "#4A4A6A", textAlign: "center", lineHeight: 18 },
    // Activated state
    activatedContainer: { flex: 1, padding: 20 },
    activatedContent: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
    activatedIcon: {
        width: 100,
        height: 100,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    activatedTitle: { fontSize: 28, fontWeight: "800", color: "#C9A84C" },
    activatedSubtitle: { fontSize: 14, color: "#8A8A9A", textAlign: "center", lineHeight: 22, maxWidth: 280 },
    backToAppBtn: {
        backgroundColor: "#C9A84C",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 32,
        marginTop: 8,
    },
    backToAppText: { color: "#0D0D0D", fontSize: 16, fontWeight: "700" },
});
