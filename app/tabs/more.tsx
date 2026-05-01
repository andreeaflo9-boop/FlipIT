import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useFinance } from "@/lib/finance-context";

interface MenuItemProps {
    icon: string;
    label: string;
    subtitle: string;
    color: string;
    onPress: () => void;
    badge?: string;
}

function MenuItem({ icon, label, subtitle, color, onPress, badge }: MenuItemProps) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={[styles.menuIcon, { backgroundColor: color + "22" }]}>
                <IconSymbol name={icon as any} size={22} color={color} />
            </View>
            <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>{label}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
            {badge && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badge}</Text>
                </View>
            )}
            <IconSymbol name="chevron.right" size={16} color="#4A4A6A" />
        </TouchableOpacity>
    );
}

export default function MoreScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { state } = useFinance();

    const pendingScenarios = state.scenarios.filter((s) => s.status === "pending").length;
    const earnedBadges = state.badges.filter((b) => b.earnedAt).length;

    return (
        <ScreenContainer containerClassName="bg-background">
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <Text style={styles.title}>More</Text>
                </View>

                <View style={styles.profileCard}>
                    <LinearGradient
                        colors={["#1A1A2E", "#16213E"]}
                        style={styles.profileGradient}
                    >
                        <View style={styles.profileAvatar}>
                            <Text style={styles.profileInitial}>
                                {user?.name?.charAt(0)?.toUpperCase() ?? "P"}
                            </Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{user?.name ?? "Player"}</Text>
                            <Text style={styles.profileEmail}>{user?.email ?? ""}</Text>
                        </View>
                        <View style={styles.profilePoints}>
                            <Text style={styles.pointsValue}>{state.profile.points}</Text>
                            <Text style={styles.pointsLabel}>points</Text>
                        </View>
                    </LinearGradient>
                </View>

                {!state.profile.isPremium && (
                    <TouchableOpacity
                        style={styles.premiumBanner}
                        onPress={() => router.push("/premium")}
                    >
                        <LinearGradient
                            colors={["#A8872E", "#C9A84C", "#E8C96D"]}
                            style={styles.premiumGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <IconSymbol name="crown.fill" size={24} color="#0D0D0D" />
                            <View style={styles.premiumText}>
                                <Text style={styles.premiumTitle}>Royal Flush Premium</Text>
                                <Text style={styles.premiumSubtitle}>Unlock all advanced features</Text>
                            </View>
                            <IconSymbol name="chevron.right" size={18} color="#0D0D0D" />
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                <Text style={styles.sectionLabel}>Features</Text>
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="exclamationmark.triangle.fill"
                        label="Interactive Scenarios"
                        subtitle="Unexpected financial events"
                        color="#F39C12"
                        onPress={() => router.push("/scenarios")}
                        badge={pendingScenarios > 0 ? String(pendingScenarios) : undefined}
                    />
                    <View style={styles.menuDivider} />
                    <MenuItem
                        icon="book.fill"
                        label="Financial Education"
                        subtitle="Terms, tips, and guides"
                        color="#3498DB"
                        onPress={() => router.push("/education")}
                    />
                    <View style={styles.menuDivider} />
                    <MenuItem
                        icon="rosette"
                        label="Rewards"
                        subtitle={`${earnedBadges} badges earned`}
                        color="#C9A84C"
                        onPress={() => router.push("/rewards")}
                    />
                </View>

                <Text style={styles.sectionLabel}>Account</Text>
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="gear"
                        label="Settings"
                        subtitle="Preferences and personalization"
                        color="#8A8A9A"
                        onPress={() => router.push("/settings")}
                    />
                    <View style={styles.menuDivider} />
                    <MenuItem
                        icon="person.fill"
                        label="Profile"
                        subtitle="Manage your account"
                        color="#8A8A9A"
                        onPress={() => router.push("/settings")}
                    />
                </View>

                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => logout()}
                >
                    <Text style={styles.logoutText}>Log out</Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
    header: { paddingTop: 16, paddingBottom: 20 },
    title: { fontSize: 26, fontWeight: "800", color: "#F5F0E8" },
    profileCard: {
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    profileGradient: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        gap: 14,
    },
    profileAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#C9A84C",
        alignItems: "center",
        justifyContent: "center",
    },
    profileInitial: { fontSize: 22, fontWeight: "800", color: "#0D0D0D" },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 17, fontWeight: "700", color: "#F5F0E8" },
    profileEmail: { fontSize: 13, color: "#8A8A9A", marginTop: 2 },
    profilePoints: { alignItems: "center" },
    pointsValue: { fontSize: 22, fontWeight: "800", color: "#C9A84C" },
    pointsLabel: { fontSize: 11, color: "#8A8A9A" },
    premiumBanner: {
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 24,
    },
    premiumGradient: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 12,
    },
    premiumText: { flex: 1 },
    premiumTitle: { fontSize: 15, fontWeight: "700", color: "#0D0D0D" },
    premiumSubtitle: { fontSize: 12, color: "#0D0D0D88", marginTop: 2 },
    sectionLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#8A8A9A",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 10,
    },
    menuCard: {
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2E2E4A",
        marginBottom: 20,
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 14,
    },
    menuIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    menuInfo: { flex: 1 },
    menuLabel: { fontSize: 15, fontWeight: "600", color: "#F5F0E8" },
    menuSubtitle: { fontSize: 12, color: "#8A8A9A", marginTop: 2 },
    menuDivider: { height: 1, backgroundColor: "#2E2E4A", marginLeft: 72 },
    badge: {
        backgroundColor: "#E74C3C",
        borderRadius: 10,
        paddingHorizontal: 7,
        paddingVertical: 2,
        marginRight: 6,
    },
    badgeText: { fontSize: 11, color: "#FFFFFF", fontWeight: "700" },
    logoutBtn: {
        backgroundColor: "#1A1A2E",
        borderRadius: 14,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E74C3C44",
        marginBottom: 20,
    },
    logoutText: { color: "#E74C3C", fontSize: 15, fontWeight: "600" },
});
