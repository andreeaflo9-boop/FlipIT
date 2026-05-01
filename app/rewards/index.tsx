import React from "react";
mport { ScreenContainer } from "@/components/screen-container";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useFinance, Badge } from "@/lib/finance-context";



function BadgeCard({ item }: { item: Badge }) {
    const earned = !!item.earnedAt;
    return (
        <View style={[styles.badgeCard, !earned && styles.badgeCardLocked]}>
            <View style={[styles.badgeIconBg, earned ? styles.badgeEarned : styles.badgeLocked]}>
                <IconSymbol name={item.icon as any} size={24} color={earned ? "#C9A84C" : "#4A4A6A"} />
            </View>
            <Text style={[styles.badgeName, !earned && styles.badgeNameLocked]}>{item.name}</Text>
            <Text style={styles.badgeDesc} numberOfLines={2}>{item.description}</Text>
            {earned ? (
                <View style={styles.earnedTag}>
                    <Text style={styles.earnedTagText}>Earned</Text>
                </View>
            ) : (
                <View style={styles.lockedTag}>
                    <IconSymbol name="lock.fill" size={10} color="#4A4A6A" />
                    <Text style={styles.lockedTagText}>Locked</Text>
                </View>
            )}
        </View>
    );
}


export default function RewardsScreen() {
    const router = useRouter();
    const { state } = useFinance();

    const earnedBadges = state.badges.filter((b) => b.earnedAt);
    const unearnedBadges = state.badges.filter((b) => !b.earnedAt);
    const allBadges = [...earnedBadges, ...unearnedBadges];

    return (
        <ScreenContainer containerClassName="bg-background">
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <IconSymbol name="chevron.left" size={24} color="#C9A84C" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Achievements</Text>
                </View>

                <LinearGradient
                    colors={["#1A1A2E", "#16213E"]}
                    style={styles.pointsCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.pointsRow}>
                        <View style={styles.pointsLeft}>
                            <Text style={styles.pointsLabel}>Total points</Text>
                            <Text style={styles.pointsValue}>{state.profile.points}</Text>
                        </View>
                        <View style={styles.pointsIconBg}>
                            <IconSymbol name="sparkles" size={32} color="#C9A84C" />
                        </View>
                    </View>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{earnedBadges.length}</Text>
                            <Text style={styles.statLabel}>Badges</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{state.challenges.filter((c) => c.status === "completed").length}</Text>
                            <Text style={styles.statLabel}>Challenges</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{state.goals.filter((g) => g.currentAmount >= g.targetAmount).length}</Text>
                            <Text style={styles.statLabel}>Goals</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Badge-uri</Text>
                        <Text style={styles.sectionCount}>{earnedBadges.length}/{state.badges.length}</Text>
                    </View>
                    <FlatList
                        data={allBadges}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <BadgeCard item={item} />}
                        numColumns={2}
                        columnWrapperStyle={styles.badgeRow}
                        scrollEnabled={false}
                    />
                </View>

                <View style={styles.howToCard}>
                    <Text style={styles.howToTitle}>How to earn points?</Text>
                    <View style={styles.howToItem}>
                        <IconSymbol name="plus.circle.fill" size={16} color="#2ECC71" />
                        <Text style={styles.howToText}>Add transactions, 10 pts each</Text>
                    </View>
                    <View style={styles.howToItem}>
                        <IconSymbol name="flame.fill" size={16} color="#F39C12" />
                        <Text style={styles.howToText}>Complete challenges, 100 to 200 pts</Text>
                    </View>
                    <View style={styles.howToItem}>
                        <IconSymbol name="target" size={16} color="#C9A84C" />
                        <Text style={styles.howToText}>Reach financial goals, 50 pts</Text>
                    </View>
                    <View style={styles.howToItem}>
                        <IconSymbol name="lightbulb.fill" size={16} color="#3498DB" />
                        <Text style={styles.howToText}>Solve scenarios, 25 pts</Text>
                    </View>
                </View>
            </ScrollView>
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
    pointsCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#C9A84C44",
    },
    pointsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
    pointsLeft: {},
    pointsLabel: { fontSize: 13, color: "#8A8A9A", marginBottom: 4 },
    pointsValue: { fontSize: 48, fontWeight: "800", color: "#C9A84C" },
    pointsIconBg: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: "#C9A84C22",
        alignItems: "center",
        justifyContent: "center",
    },
    statsRow: { flexDirection: "row", justifyContent: "space-around" },
    stat: { alignItems: "center" },
    statValue: { fontSize: 20, fontWeight: "700", color: "#F5F0E8" },
    statLabel: { fontSize: 11, color: "#8A8A9A", marginTop: 2 },
    statDivider: { width: 1, backgroundColor: "#2E2E4A" },
    section: { marginBottom: 24 },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#F5F0E8" },
    sectionCount: { fontSize: 13, color: "#C9A84C", fontWeight: "600" },
    badgeRow: { gap: 12, marginBottom: 12 },
    badgeCard: {
        flex: 1,
        backgroundColor: "#1A1A2E",
        borderRadius: 14,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2E2E4A",
        gap: 8,
    },
    badgeCardLocked: { opacity: 0.5 },
    badgeIconBg: {
        width: 56,
        height: 56,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    badgeEarned: { backgroundColor: "#C9A84C22" },
    badgeLocked: { backgroundColor: "#2E2E4A" },
    badgeName: { fontSize: 13, fontWeight: "700", color: "#F5F0E8", textAlign: "center" },
    badgeNameLocked: { color: "#4A4A6A" },
    badgeDesc: { fontSize: 11, color: "#8A8A9A", textAlign: "center", lineHeight: 16 },
    earnedTag: {
        backgroundColor: "#C9A84C22",
        borderRadius: 6,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    earnedTagText: { fontSize: 10, color: "#C9A84C", fontWeight: "700" },
    lockedTag: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#2E2E4A",
        borderRadius: 6,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    lockedTagText: { fontSize: 10, color: "#4A4A6A" },
    howToCard: {
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#2E2E4A",
        gap: 12,
    },
    howToTitle: { fontSize: 15, fontWeight: "700", color: "#F5F0E8", marginBottom: 4 },
    howToItem: { flexDirection: "row", alignItems: "center", gap: 10 },
    howToText: { fontSize: 13, color: "#8A8A9A", flex: 1 },
});
