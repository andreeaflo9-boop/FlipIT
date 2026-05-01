import React, { useEffect } from "react";
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
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useFinance, Transaction, Goal } from "@/lib/finance-context";

const CATEGORY_ICONS: Record<string, string> = {
    food: "🍔",
    transport: "🚗",
    rent: "🏠",
    entertainment: "🎮",
    health: "💊",
    utilities: "💡",
    salary: "💼",
    freelance: "💻",
    investment: "📈",
    savings: "🏦",
    other: "📦",
};

const CATEGORY_LABELS: Record<string, string> = {
    food: "Food",
    transport: "Transport",
    rent: "Rent",
    entertainment: "Entertainment",
    health: "Health",
    utilities: "Utilities",
    salary: "Salary",
    freelance: "Freelance",
    investment: "Investments",
    savings: "Savings",
    other: "Other",
};

export default function HomeScreen() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const {
        state,
        totalBalance,
        totalIncome,
        totalExpenses,
        totalSavings,
        totalInvestments,
        recentTransactions,
    } = useFinance();

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace("/auth");
        }
    }, [user, authLoading]);

    if (!user) return null;

    const activeGoals = state.goals.filter((g) => g.currentAmount < g.targetAmount);


    const entertainmentExpenses = state.transactions
        .filter((t) => t.type === "expense" && t.category === "entertainment")
        .reduce((sum, t) => sum + t.amount, 0);
    const entertainmentBudget = 200;
    const overBudget = entertainmentExpenses > entertainmentBudget;

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
                <Text style={styles.transactionEmoji}>{CATEGORY_ICONS[item.category] ?? "📦"}</Text>
            </View>
            <View style={styles.transactionInfo}>
                <Text style={styles.transactionDesc} numberOfLines={1}>{item.description}</Text>
                <Text style={styles.transactionCategory}>{CATEGORY_LABELS[item.category] ?? item.category}</Text>
            </View>
            <Text
                style={[
                    styles.transactionAmount,
                    item.type === "income" ? styles.incomeText : styles.expenseText,
                ]}
            >
                {item.type === "income" || item.type === "savings" || item.type === "investment" ? "+" : "-"}
                {item.amount.toFixed(2)} €
            </Text>
        </View>
    );

    const renderGoal = ({ item }: { item: Goal }) => {
        const progress = item.targetAmount > 0 ? item.currentAmount / item.targetAmount : 0;
        return (
            <View style={styles.goalCard}>
                <View style={styles.goalHeader}>
                    <Text style={styles.goalName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.goalAmount}>
                        {item.currentAmount.toFixed(0)} € / {item.targetAmount.toFixed(0)} €
                    </Text>
                </View>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%` }]} />
                </View>
                <Text style={styles.goalPercent}>{Math.round(progress * 100)}% completed</Text>
            </View>
        );
    };

    return (
        <ScreenContainer containerClassName="bg-background">
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hi, {user.name}! 👋</Text>
                        <Text style={styles.headerSubtitle}>Your financial overview</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.notifBtn}
                        onPress={() => router.push("./more")}
                    >
                        <IconSymbol name="bell.fill" size={22} color="#C9A84C" />
                    </TouchableOpacity>
                </View>

                <View style={styles.balanceCard}>
                    <LinearGradient
                        colors={["#1A1A2E", "#16213E", "#0F3460"]}
                        style={styles.balanceGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.balanceCardBorder}>
                            <Text style={styles.balanceLabel}>Sold total</Text>
                            <Text style={styles.balanceAmount}>{totalBalance.toFixed(2)} €</Text>
                            <View style={styles.balanceRow}>
                                <View style={styles.balanceStat}>
                                    <IconSymbol name="arrow.up.circle.fill" size={16} color="#2ECC71" />
                                    <Text style={styles.balanceStatLabel}>Income</Text>
                                    <Text style={styles.incomeText}>{totalIncome.toFixed(0)} €</Text>
                                </View>
                                <View style={styles.balanceDivider} />
                                <View style={styles.balanceStat}>
                                    <IconSymbol name="arrow.down.circle.fill" size={16} color="#E74C3C" />
                                    <Text style={styles.balanceStatLabel}>Expenses</Text>
                                    <Text style={styles.expenseText}>{totalExpenses.toFixed(0)} €</Text>
                                </View>
                                <View style={styles.balanceDivider} />
                                <View style={styles.balanceStat}>
                                    <IconSymbol name="dollarsign.circle.fill" size={16} color="#C9A84C" />
                                    <Text style={styles.balanceStatLabel}>Savings</Text>
                                    <Text style={styles.goldText}>{totalSavings.toFixed(0)} €</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {overBudget && (
                    <View style={styles.alertCard}>
                        <IconSymbol name="exclamationmark.triangle.fill" size={18} color="#F39C12" />
                        <Text style={styles.alertText}>
                            You exceeded your entertainment budget by{" "}
                            {(((entertainmentExpenses - entertainmentBudget) / entertainmentBudget) * 100).toFixed(0)}%
                        </Text>
                    </View>
                )}

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color="#C9A84C" />
                        <Text style={styles.statValue}>{totalInvestments.toFixed(0)} €</Text>
                        <Text style={styles.statLabel}>Investments</Text>
                    </View>
                    <View style={styles.statCard}>
                        <IconSymbol name="trophy.fill" size={20} color="#C9A84C" />
                        <Text style={styles.statValue}>{state.profile.points}</Text>
                        <Text style={styles.statLabel}>Points</Text>
                    </View>
                    <View style={styles.statCard}>
                        <IconSymbol name="target" size={20} color="#C9A84C" />
                        <Text style={styles.statValue}>{activeGoals.length}</Text>
                        <Text style={styles.statLabel}>Active goals</Text>
                    </View>
                </View>

                {activeGoals.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Active goals</Text>
                            <TouchableOpacity onPress={() => router.push("./goals")}>
                                <Text style={styles.seeAll}>See all</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={activeGoals.slice(0, 3)}
                            keyExtractor={(item) => item.id}
                            renderItem={renderGoal}
                            scrollEnabled={false}
                        />
                    </View>
                )}

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent activity</Text>
                        <TouchableOpacity onPress={() => router.push("./budget")}>
                            <Text style={styles.seeAll}>See all</Text>
                        </TouchableOpacity>
                    </View>
                    {recentTransactions.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>💳</Text>
                            <Text style={styles.emptyTitle}>No transactions yet</Text>
                            <Text style={styles.emptySubtitle}>Add your first transaction in the Budget tab</Text>
                            <TouchableOpacity
                                style={styles.emptyBtn}
                                onPress={() => router.push("./budget")}
                            >
                                <Text style={styles.emptyBtnText}>Add transaction</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <FlatList
                            data={recentTransactions}
                            keyExtractor={(item) => item.id}
                            renderItem={renderTransaction}
                            scrollEnabled={false}
                        />
                    )}
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
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 16,
        paddingBottom: 20,
    },
    greeting: { fontSize: 22, fontWeight: "700", color: "#F5F0E8" },
    headerSubtitle: { fontSize: 13, color: "#8A8A9A", marginTop: 2 },
    notifBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#1A1A2E",
        borderWidth: 1,
        borderColor: "#2E2E4A",
        alignItems: "center",
        justifyContent: "center",
    },
    balanceCard: {
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#C9A84C44",
    },
    balanceGradient: { padding: 1 },
    balanceCardBorder: { padding: 24 },
    balanceLabel: { fontSize: 13, color: "#8A8A9A", marginBottom: 4 },
    balanceAmount: { fontSize: 38, fontWeight: "800", color: "#C9A84C", marginBottom: 20 },
    balanceRow: { flexDirection: "row", alignItems: "center" },
    balanceStat: { flex: 1, alignItems: "center", gap: 4 },
    balanceDivider: { width: 1, height: 40, backgroundColor: "#2E2E4A" },
    balanceStatLabel: { fontSize: 11, color: "#8A8A9A" },
    incomeText: { fontSize: 14, fontWeight: "700", color: "#2ECC71" },
    expenseText: { fontSize: 14, fontWeight: "700", color: "#E74C3C" },
    goldText: { fontSize: 14, fontWeight: "700", color: "#C9A84C" },
    alertCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2A1A00",
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#F39C1244",
        gap: 10,
    },
    alertText: { flex: 1, fontSize: 13, color: "#F39C12", lineHeight: 18 },
    statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
    statCard: {
        flex: 1,
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        gap: 6,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    statValue: { fontSize: 18, fontWeight: "700", color: "#F5F0E8" },
    statLabel: { fontSize: 11, color: "#8A8A9A", textAlign: "center" },
    section: { marginBottom: 24 },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 17, fontWeight: "700", color: "#F5F0E8" },
    seeAll: { fontSize: 13, color: "#C9A84C" },
    goalCard: {
        backgroundColor: "#1A1A2E",
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    goalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    goalName: { fontSize: 15, fontWeight: "600", color: "#F5F0E8", flex: 1 },
    goalAmount: { fontSize: 13, color: "#C9A84C", fontWeight: "600" },
    progressTrack: {
        height: 6,
        backgroundColor: "#2E2E4A",
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 6,
    },
    progressFill: { height: "100%", backgroundColor: "#C9A84C", borderRadius: 3 },
    goalPercent: { fontSize: 11, color: "#8A8A9A" },
    transactionItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1A1A2E",
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#2E2E4A",
        gap: 12,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#0D0D0D",
        alignItems: "center",
        justifyContent: "center",
    },
    transactionEmoji: { fontSize: 20 },
    transactionInfo: { flex: 1 },
    transactionDesc: { fontSize: 14, fontWeight: "600", color: "#F5F0E8" },
    transactionCategory: { fontSize: 12, color: "#8A8A9A", marginTop: 2 },
    transactionAmount: { fontSize: 15, fontWeight: "700" },
    emptyState: {
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 32,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    emptyIcon: { fontSize: 40, marginBottom: 12 },
    emptyTitle: { fontSize: 16, fontWeight: "700", color: "#F5F0E8", marginBottom: 6 },
    emptySubtitle: { fontSize: 13, color: "#8A8A9A", textAlign: "center", marginBottom: 20 },
    emptyBtn: {
        backgroundColor: "#C9A84C",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    emptyBtnText: { color: "#0D0D0D", fontSize: 14, fontWeight: "700" },
});
