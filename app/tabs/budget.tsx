import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    TextInput,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance, Transaction, TransactionType, Category } from "@/lib/finance-context";
import Svg, { G, Path, Circle } from "react-native-svg";



interface PieSlice {
    label: string;
    value: number;
    color: string;
}

const PIE_COLORS = [
    "#C9A84C", "#E74C3C", "#2ECC71", "#3498DB",
    "#9B59B6", "#F39C12", "#1ABC9C", "#E91E63",
];

function SimplePieChart({ data }: { data: PieSlice[] }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    if (total === 0) {
        return (
            <View style={pieStyles.empty}>
                <Text style={pieStyles.emptyText}>No data available</Text>
            </View>
        );
    }

    const cx = 80, cy = 80, r = 70;
    let startAngle = -Math.PI / 2;
    const slices = data.map((d) => {
        const angle = (d.value / total) * 2 * Math.PI;
        const endAngle = startAngle + angle;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = angle > Math.PI ? 1 : 0;
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        const result = { ...d, path, startAngle };
        startAngle = endAngle;
        return result;
    });

    return (
        <View style={pieStyles.container}>
            <Svg width={160} height={160}>
                <G>
                    {slices.map((s, i) => (
                        <Path key={i} d={s.path} fill={s.color} stroke="#0D0D0D" strokeWidth={2} />
                    ))}
                    <Circle cx={cx} cy={cy} r={35} fill="#0D0D0D" />
                </G>
            </Svg>
            <View style={pieStyles.legend}>
                {data.map((d, i) => (
                    <View key={i} style={pieStyles.legendItem}>
                        <View style={[pieStyles.dot, { backgroundColor: d.color }]} />
                        <Text style={pieStyles.legendLabel} numberOfLines={1}>
                            {d.label}
                        </Text>
                        <Text style={pieStyles.legendValue}>{((d.value / total) * 100).toFixed(0)}%</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const pieStyles = StyleSheet.create({
    container: { flexDirection: "row", alignItems: "center", gap: 16 },
    empty: { alignItems: "center", padding: 20 },
    emptyText: { color: "#8A8A9A", fontSize: 13 },
    legend: { flex: 1, gap: 6 },
    legendItem: { flexDirection: "row", alignItems: "center", gap: 8 },
    dot: { width: 10, height: 10, borderRadius: 5 },
    legendLabel: { flex: 1, fontSize: 12, color: "#F5F0E8" },
    legendValue: { fontSize: 12, color: "#8A8A9A" },
});

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
    { value: "food", label: "Food", emoji: "🍔" },
    { value: "transport", label: "Transport", emoji: "🚗" },
    { value: "rent", label: "Rent", emoji: "🏠" },
    { value: "entertainment", label: "Entertainment", emoji: "🎮" },
    { value: "health", label: "Health", emoji: "💊" },
    { value: "utilities", label: "Utilities", emoji: "💡" },
    { value: "salary", label: "Salary", emoji: "💼" },
    { value: "freelance", label: "Freelance", emoji: "💻" },
    { value: "investment", label: "Investments", emoji: "📈" },
    { value: "savings", label: "Savings", emoji: "🏦" },
    { value: "other", label: "Other", emoji: "📦" },
];

const TRANSACTION_TYPES: { value: TransactionType; label: string; color: string }[] = [
    { value: "income", label: "Income", color: "#2ECC71" },
    { value: "expense", label: "Expenses", color: "#E74C3C" },
    { value: "savings", label: "Savings", color: "#C9A84C" },
    { value: "investment", label: "Investments", color: "#3498DB" },
];

export default function BudgetScreen() {
    const { state, dispatch, totalIncome, totalExpenses, totalSavings, totalInvestments } = useFinance();
    const [activeTab, setActiveTab] = useState<TransactionType | "all">("all");
    const [showAddModal, setShowAddModal] = useState(false);

    const [formType, setFormType] = useState<TransactionType>("expense");
    const [formCategory, setFormCategory] = useState<Category>("food");
    const [formAmount, setFormAmount] = useState("");
    const [formDesc, setFormDesc] = useState("");

    const filteredTransactions = useMemo(() => {
        if (activeTab === "all") return state.transactions;
        return state.transactions.filter((t) => t.type === activeTab);
    }, [state.transactions, activeTab]);

    const pieData = useMemo(() => {
        const expenseMap: Record<string, number> = {};
        state.transactions
            .filter((t) => t.type === "expense")
            .forEach((t) => {
                expenseMap[t.category] = (expenseMap[t.category] ?? 0) + t.amount;
            });
        return Object.entries(expenseMap)
            .map(([cat, val], i) => ({
                label: CATEGORIES.find((c) => c.value === cat)?.label ?? cat,
                value: val,
                color: PIE_COLORS[i % PIE_COLORS.length],
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [state.transactions]);

    const handleAddTransaction = () => {
        const amount = parseFloat(formAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert("Error", "Enter a valid amount.");
            return;
        }
        if (!formDesc.trim()) {
            Alert.alert("Error", "Add a description.");
            return;
        }
        dispatch({
            type: "ADD_TRANSACTION",
            payload: {
                id: Date.now().toString(),
                type: formType,
                category: formCategory,
                amount,
                description: formDesc.trim(),
                date: new Date().toISOString(),
            },
        });

        if (state.transactions.length === 0) {
            dispatch({ type: "EARN_BADGE", payload: "b1" });
        }
        setFormAmount("");
        setFormDesc("");
        setShowAddModal(false);
    };

    const handleDelete = (id: string) => {
        Alert.alert("Delete transaction", "Are you sure you want to delete this transaction?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => dispatch({ type: "DELETE_TRANSACTION", payload: id }) },
        ]);
    };

    const renderTransaction = ({ item }: { item: Transaction }) => {
        const cat = CATEGORIES.find((c) => c.value === item.category);
        const isPositive = item.type === "income" || item.type === "savings" || item.type === "investment";
        return (
            <TouchableOpacity
                style={styles.txItem}
                onLongPress={() => handleDelete(item.id)}
                delayLongPress={500}
            >
                <View style={styles.txIcon}>
                    <Text style={styles.txEmoji}>{cat?.emoji ?? "📦"}</Text>
                </View>
                <View style={styles.txInfo}>
                    <Text style={styles.txDesc} numberOfLines={1}>{item.description}</Text>
                    <Text style={styles.txMeta}>
                        {cat?.label ?? item.category} • {new Date(item.date).toLocaleDateString("ro-RO")}
                    </Text>
                </View>
                <Text style={[styles.txAmount, isPositive ? styles.incomeColor : styles.expenseColor]}>
                    {isPositive ? "+" : "-"}{item.amount.toFixed(2)} €
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <ScreenContainer containerClassName="bg-background">
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <Text style={styles.title}>Budget</Text>
                    <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
                        <LinearGradient
                            colors={["#E8C96D", "#C9A84C"]}
                            style={styles.addBtnGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <IconSymbol name="plus" size={20} color="#0D0D0D" />
                            <Text style={styles.addBtnText}>Add</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.summaryGrid}>
                    <View style={[styles.summaryCard, { borderColor: "#2ECC7144" }]}>
                        <Text style={styles.summaryLabel}>Income</Text>
                        <Text style={[styles.summaryValue, { color: "#2ECC71" }]}>{totalIncome.toFixed(2)} €</Text>
                    </View>
                    <View style={[styles.summaryCard, { borderColor: "#E74C3C44" }]}>
                        <Text style={styles.summaryLabel}>Expenses</Text>
                        <Text style={[styles.summaryValue, { color: "#E74C3C" }]}>{totalExpenses.toFixed(2)} €</Text>
                    </View>
                    <View style={[styles.summaryCard, { borderColor: "#C9A84C44" }]}>
                        <Text style={styles.summaryLabel}>Savings</Text>
                        <Text style={[styles.summaryValue, { color: "#C9A84C" }]}>{totalSavings.toFixed(2)} €</Text>
                    </View>
                    <View style={[styles.summaryCard, { borderColor: "#3498DB44" }]}>
                        <Text style={styles.summaryLabel}>Investments</Text>
                        <Text style={[styles.summaryValue, { color: "#3498DB" }]}>{totalInvestments.toFixed(2)} €</Text>
                    </View>
                </View>

                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Expense Distribution</Text>
                    <SimplePieChart data={pieData} />
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    <View style={styles.filterRow}>
                        {[{ value: "all", label: "All" }, ...TRANSACTION_TYPES].map((tab) => (
                            <TouchableOpacity
                                key={tab.value}
                                style={[styles.filterTab, activeTab === tab.value && styles.filterTabActive]}
                                onPress={() => setActiveTab(tab.value as TransactionType | "all")}
                            >
                                <Text style={[styles.filterTabText, activeTab === tab.value && styles.filterTabTextActive]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                {filteredTransactions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>💳</Text>
                        <Text style={styles.emptyTitle}>No transactions</Text>
                        <Text style={styles.emptySubtitle}>Tap “Add” to record your first transaction</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredTransactions}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTransaction}
                        scrollEnabled={false}
                    />
                )}
            </ScrollView>

            <Modal visible={showAddModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Transaction</Text>
                            <TouchableOpacity onPress={() => setShowAddModal(false)}>
                                <IconSymbol name="xmark.circle.fill" size={26} color="#8A8A9A" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalLabel}>Type</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                            <View style={styles.typeRow}>
                                {TRANSACTION_TYPES.map((t) => (
                                    <TouchableOpacity
                                        key={t.value}
                                        style={[styles.typeChip, formType === t.value && { backgroundColor: t.color + "33", borderColor: t.color }]}
                                        onPress={() => setFormType(t.value)}
                                    >
                                        <Text style={[styles.typeChipText, formType === t.value && { color: t.color }]}>
                                            {t.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <Text style={styles.modalLabel}>Category</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                            <View style={styles.typeRow}>
                                {CATEGORIES.map((c) => (
                                    <TouchableOpacity
                                        key={c.value}
                                        style={[styles.catChip, formCategory === c.value && styles.catChipActive]}
                                        onPress={() => setFormCategory(c.value)}
                                    >
                                        <Text style={styles.catEmoji}>{c.emoji}</Text>
                                        <Text style={[styles.catLabel, formCategory === c.value && styles.catLabelActive]}>
                                            {c.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <Text style={styles.modalLabel}>Amount (€)</Text>
                        <View style={styles.modalInput}>
                            <Text style={styles.currencySymbol}>€</Text>
                            <TextInput
                                style={styles.modalTextInput}
                                placeholder="0.00"
                                placeholderTextColor="#8A8A9A"
                                value={formAmount}
                                onChangeText={setFormAmount}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <Text style={styles.modalLabel}>Description</Text>
                        <View style={styles.modalInput}>
                            <TextInput
                                style={styles.modalTextInput}
                                placeholder="Ex: Lidl groceries"
                                placeholderTextColor="#8A8A9A"
                                value={formDesc}
                                onChangeText={setFormDesc}
                                returnKeyType="done"
                            />
                        </View>

                        <TouchableOpacity style={styles.confirmBtn} onPress={handleAddTransaction}>
                            <LinearGradient
                                colors={["#E8C96D", "#C9A84C"]}
                                style={styles.confirmGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.confirmBtnText}>Save Transaction</Text>
                            </LinearGradient>
                        </TouchableOpacity>
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
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 16,
        paddingBottom: 20,
    },
    title: { fontSize: 26, fontWeight: "800", color: "#F5F0E8" },
    addBtn: { borderRadius: 12, overflow: "hidden" },
    addBtnGradient: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 16,
        gap: 6,
    },
    addBtnText: { color: "#0D0D0D", fontSize: 14, fontWeight: "700" },
    summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
    summaryCard: {
        flex: 1,
        minWidth: "45%",
        backgroundColor: "#1A1A2E",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
    },
    summaryLabel: { fontSize: 12, color: "#8A8A9A", marginBottom: 4 },
    summaryValue: { fontSize: 18, fontWeight: "700" },
    chartCard: {
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    chartTitle: { fontSize: 15, fontWeight: "700", color: "#F5F0E8", marginBottom: 16 },
    filterScroll: { marginBottom: 16 },
    filterRow: { flexDirection: "row", gap: 8, paddingRight: 20 },
    filterTab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#1A1A2E",
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    filterTabActive: { backgroundColor: "#C9A84C22", borderColor: "#C9A84C" },
    filterTabText: { fontSize: 13, color: "#8A8A9A", fontWeight: "600" },
    filterTabTextActive: { color: "#C9A84C" },
    txItem: {
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
    txIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#0D0D0D",
        alignItems: "center",
        justifyContent: "center",
    },
    txEmoji: { fontSize: 20 },
    txInfo: { flex: 1 },
    txDesc: { fontSize: 14, fontWeight: "600", color: "#F5F0E8" },
    txMeta: { fontSize: 11, color: "#8A8A9A", marginTop: 2 },
    txAmount: { fontSize: 15, fontWeight: "700" },
    incomeColor: { color: "#2ECC71" },
    expenseColor: { color: "#E74C3C" },
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
    emptySubtitle: { fontSize: 13, color: "#8A8A9A", textAlign: "center" },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "#000000CC",
        justifyContent: "flex-end",
    },
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
        marginBottom: 20,
    },
    modalTitle: { fontSize: 20, fontWeight: "700", color: "#F5F0E8" },
    modalLabel: { fontSize: 13, color: "#8A8A9A", fontWeight: "600", marginBottom: 8 },
    typeRow: { flexDirection: "row", gap: 8 },
    typeChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: "#0D0D0D",
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    typeChipText: { fontSize: 13, color: "#8A8A9A", fontWeight: "600" },
    catChip: {
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: "#0D0D0D",
        borderWidth: 1,
        borderColor: "#2E2E4A",
        gap: 4,
    },
    catChipActive: { backgroundColor: "#C9A84C22", borderColor: "#C9A84C" },
    catEmoji: { fontSize: 18 },
    catLabel: { fontSize: 11, color: "#8A8A9A" },
    catLabelActive: { color: "#C9A84C" },
    modalInput: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0D0D0D",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2E2E4A",
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 16,
        gap: 8,
    },
    currencySymbol: { fontSize: 16, color: "#C9A84C", fontWeight: "700" },
    modalTextInput: { flex: 1, color: "#F5F0E8", fontSize: 15 },
    confirmBtn: { borderRadius: 14, overflow: "hidden", marginTop: 4 },
    confirmGradient: { paddingVertical: 16, alignItems: "center" },
    confirmBtnText: { color: "#0D0D0D", fontSize: 16, fontWeight: "700" },
});
