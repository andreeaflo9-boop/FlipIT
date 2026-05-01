import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    Alert,
    FlatList,
    Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance, Goal } from "@/lib/finance-context";


interface CoinTossProps {
    visible: boolean;
    goalName: string;
    onResult: (won: boolean) => void;
    onClose: () => void;
}

function CoinTossModal({ visible, goalName, onResult, onClose }: CoinTossProps) {
    const [flipping, setFlipping] = useState(false);
    const [result, setResult] = useState<"heads" | "tails" | null>(null);
    const spinAnim = React.useRef(new Animated.Value(0)).current;

    const flip = () => {
        if (flipping) return;
        setFlipping(true);
        setResult(null);
        spinAnim.setValue(0);

        Animated.sequence([
            Animated.timing(spinAnim, {
                toValue: 3,
                duration: 1200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            const won = Math.random() > 0.5;
            setResult(won ? "heads" : "tails");
            setFlipping(false);
            setTimeout(() => onResult(won), 1000);
        });
    };

    const spin = spinAnim.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: ["0deg", "180deg", "360deg", "720deg"],
    });

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <View style={coinStyles.overlay}>
                <View style={coinStyles.card}>
                    <Text style={coinStyles.title}>I Want It Now!</Text>
                    <Text style={coinStyles.subtitle}>
                        Flip the coin for {goalName}
                    </Text>
                    <Text style={coinStyles.desc}>
                        50% chance to instantly complete this goal. If you lose, the goal stays active.
                    </Text>

                    <Animated.View style={[coinStyles.coin, { transform: [{ rotateY: spin }] }]}>
                        <LinearGradient
                            colors={result === "tails" ? ["#E74C3C", "#C0392B"] : ["#E8C96D", "#C9A84C"]}
                            style={coinStyles.coinInner}
                        >
                            <Text style={coinStyles.coinText}>
                                {result === null ? "?" : result === "heads" ? "WIN" : "LOSE"}
                            </Text>
                        </LinearGradient>
                    </Animated.View>

                    {!result && !flipping && (
                        <TouchableOpacity style={coinStyles.flipBtn} onPress={flip}>
                            <LinearGradient
                                colors={["#E8C96D", "#C9A84C"]}
                                style={coinStyles.flipBtnGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={coinStyles.flipBtnText}>Flip Coin</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                    {flipping && (
                        <Text style={coinStyles.flippingText}>Flipping...</Text>
                    )}

                    <TouchableOpacity style={coinStyles.cancelBtn} onPress={onClose}>
                        <Text style={coinStyles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const coinStyles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "#000000DD", justifyContent: "center", alignItems: "center", padding: 24 },
    card: {
        backgroundColor: "#1A1A2E",
        borderRadius: 24,
        padding: 28,
        alignItems: "center",
        width: "100%",
        borderWidth: 1,
        borderColor: "#C9A84C44",
        gap: 12,
    },
    title: { fontSize: 24, fontWeight: "800", color: "#C9A84C" },
    subtitle: { fontSize: 15, color: "#F5F0E8", fontWeight: "600", textAlign: "center" },
    desc: { fontSize: 13, color: "#8A8A9A", textAlign: "center", lineHeight: 20 },
    coin: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 16,
        shadowColor: "#C9A84C",
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 8,
    },
    coinInner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    coinText: { fontSize: 20, fontWeight: "900", color: "#0D0D0D" },
    flipBtn: { borderRadius: 14, overflow: "hidden", width: "100%" },
    flipBtnGradient: { paddingVertical: 16, alignItems: "center" },
    flipBtnText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
    flippingText: { fontSize: 16, color: "#C9A84C", fontWeight: "600" },
    cancelBtn: { paddingVertical: 12 },
    cancelText: { fontSize: 14, color: "#8A8A9A" },
});


interface AddGoalModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (goal: Omit<Goal, "id" | "currentAmount" | "coinTossUsed" | "createdAt">) => void;
}

const GOAL_ICONS = ["🏠", "🚗", "✈️", "💻", "📱", "🎓", "💍", "🏋️", "🎮", "🏦"];

function AddGoalModal({ visible, onClose, onAdd }: AddGoalModalProps) {
    const [name, setName] = useState("");
    const [target, setTarget] = useState("");
    const [deadline, setDeadline] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("🏠");

    const handleAdd = () => {
        if (!name.trim()) { Alert.alert("Error", "Add a name for your goal."); return; }
        const amount = parseFloat(target);
        if (isNaN(amount) || amount <= 0) { Alert.alert("Error", "Enter a valid amount.."); return; }
        onAdd({ name: name.trim(), targetAmount: amount, deadline: deadline.trim() || undefined, icon: selectedIcon });
        setName(""); setTarget(""); setDeadline(""); setSelectedIcon("🏠");
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={addStyles.overlay}>
                <View style={addStyles.card}>
                    <View style={addStyles.header}>
                        <Text style={addStyles.title}>New Goal</Text>
                        <TouchableOpacity onPress={onClose}>
                            <IconSymbol name="xmark.circle.fill" size={26} color="#8A8A9A" />
                        </TouchableOpacity>
                    </View>

                    <Text style={addStyles.label}>Icon</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                        <View style={addStyles.iconRow}>
                            {GOAL_ICONS.map((icon) => (
                                <TouchableOpacity
                                    key={icon}
                                    style={[addStyles.iconChip, selectedIcon === icon && addStyles.iconChipActive]}
                                    onPress={() => setSelectedIcon(icon)}
                                >
                                    <Text style={addStyles.iconText}>{icon}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <Text style={addStyles.label}>Goal Name</Text>
                    <View style={addStyles.input}>
                        <TextInput
                            style={addStyles.textInput}
                            placeholder="Ex: Emergency fund"
                            placeholderTextColor="#8A8A9A"
                            value={name}
                            onChangeText={setName}
                            returnKeyType="next"
                        />
                    </View>

                    <Text style={addStyles.label}>Target Amount (€)</Text>
                    <View style={addStyles.input}>
                        <Text style={addStyles.currencySymbol}>€</Text>
                        <TextInput
                            style={addStyles.textInput}
                            placeholder="0.00"
                            placeholderTextColor="#8A8A9A"
                            value={target}
                            onChangeText={setTarget}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    <Text style={addStyles.label}>Deadline (optional)</Text>
                    <View style={addStyles.input}>
                        <TextInput
                            style={addStyles.textInput}
                            placeholder="Ex: Dec 2025"
                            placeholderTextColor="#8A8A9A"
                            value={deadline}
                            onChangeText={setDeadline}
                            returnKeyType="done"
                        />
                    </View>

                    <TouchableOpacity style={addStyles.addBtn} onPress={handleAdd}>
                        <LinearGradient
                            colors={["#E8C96D", "#C9A84C"]}
                            style={addStyles.addBtnGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={addStyles.addBtnText}>Add Goal</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const addStyles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "#000000CC", justifyContent: "flex-end" },
    card: {
        backgroundColor: "#1A1A2E",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderColor: "#2E2E4A",
    },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    title: { fontSize: 20, fontWeight: "700", color: "#F5F0E8" },
    label: { fontSize: 13, color: "#8A8A9A", fontWeight: "600", marginBottom: 8 },
    iconRow: { flexDirection: "row", gap: 10 },
    iconChip: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#0D0D0D",
        borderWidth: 1,
        borderColor: "#2E2E4A",
        alignItems: "center",
        justifyContent: "center",
    },
    iconChipActive: { borderColor: "#C9A84C", backgroundColor: "#C9A84C22" },
    iconText: { fontSize: 22 },
    input: {
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
    textInput: { flex: 1, color: "#F5F0E8", fontSize: 15 },
    addBtn: { borderRadius: 14, overflow: "hidden", marginTop: 4 },
    addBtnGradient: { paddingVertical: 16, alignItems: "center" },
    addBtnText: { color: "#0D0D0D", fontSize: 16, fontWeight: "700" },
});


interface GoalCardProps {
    goal: Goal;
    isPremium: boolean;
    onAllocate: (id: string) => void;
    onCoinToss: (id: string) => void;
    onDelete: (id: string) => void;
}

function GoalCard({ goal, isPremium, onAllocate, onCoinToss, onDelete }: GoalCardProps) {
    const progress = Math.min(goal.currentAmount / goal.targetAmount, 1);
    const percent = Math.round(progress * 100);
    const remaining = goal.targetAmount - goal.currentAmount;
    const isComplete = progress >= 1;

    return (
        <View style={[goalStyles.card, isComplete && goalStyles.cardComplete]}>
            <View style={goalStyles.header}>
                <View style={goalStyles.iconBg}>
                    <Text style={goalStyles.icon}>{goal.icon}</Text>
                </View>
                <View style={goalStyles.info}>
                    <Text style={goalStyles.name}>{goal.name}</Text>
                    {goal.deadline && <Text style={goalStyles.deadline}>Deadline: {goal.deadline}</Text>}
                </View>
                {isComplete ? (
                    <View style={goalStyles.completeBadge}>
                        <IconSymbol name="checkmark.circle.fill" size={20} color="#2ECC71" />
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => onDelete(goal.id)}>
                        <IconSymbol name="trash.fill" size={18} color="#4A4A6A" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={goalStyles.progressRow}>
                <Text style={goalStyles.savedAmount}>{goal.currentAmount.toFixed(0)} €</Text>
                <Text style={goalStyles.targetAmount}>{goal.targetAmount.toFixed(0)} €</Text>
            </View>
            <View style={goalStyles.progressTrack}>
                <View style={[goalStyles.progressFill, { width: `${percent}%` }, isComplete && goalStyles.progressComplete]} />
            </View>
            <Text style={goalStyles.progressPercent}>{percent}% reached</Text>

            {!isComplete && (
                <View style={goalStyles.actions}>
                    <TouchableOpacity style={goalStyles.allocateBtn} onPress={() => onAllocate(goal.id)}>
                        <IconSymbol name="plus.circle.fill" size={16} color="#2ECC71" />
                        <Text style={goalStyles.allocateBtnText}>Add Funds</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[goalStyles.coinTossBtn, !isPremium && goalStyles.coinTossBtnLocked]}
                        onPress={() => isPremium ? onCoinToss(goal.id) : Alert.alert("Premium", "The 'I Want It Now' feature is only available for Premium subscribers.")}
                    >
                        <Text style={goalStyles.coinTossIcon}>🪙</Text>
                        <Text style={[goalStyles.coinTossBtnText, !isPremium && goalStyles.coinTossBtnTextLocked]}>
                            I Want It Now
                        </Text>
                        {!isPremium && <IconSymbol name="lock.fill" size={12} color="#4A4A6A" />}
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const goalStyles = StyleSheet.create({
    card: {
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    cardComplete: { borderColor: "#2ECC7144" },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 12 },
    iconBg: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#0D0D0D",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: { fontSize: 22 },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: "700", color: "#F5F0E8" },
    deadline: { fontSize: 12, color: "#8A8A9A", marginTop: 2 },
    completeBadge: {},
    progressRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    savedAmount: { fontSize: 14, fontWeight: "700", color: "#C9A84C" },
    targetAmount: { fontSize: 14, color: "#8A8A9A" },
    progressTrack: { height: 8, backgroundColor: "#2E2E4A", borderRadius: 4, overflow: "hidden", marginBottom: 6 },
    progressFill: { height: "100%", backgroundColor: "#C9A84C", borderRadius: 4 },
    progressComplete: { backgroundColor: "#2ECC71" },
    progressPercent: { fontSize: 12, color: "#8A8A9A", marginBottom: 12 },
    actions: { flexDirection: "row", gap: 10 },
    allocateBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2ECC7122",
        borderRadius: 10,
        paddingVertical: 10,
        gap: 6,
        borderWidth: 1,
        borderColor: "#2ECC7144",
    },
    allocateBtnText: { fontSize: 13, color: "#2ECC71", fontWeight: "600" },
    coinTossBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#C9A84C22",
        borderRadius: 10,
        paddingVertical: 10,
        gap: 6,
        borderWidth: 1,
        borderColor: "#C9A84C44",
    },
    coinTossBtnLocked: { backgroundColor: "#2E2E4A22", borderColor: "#2E2E4A" },
    coinTossIcon: { fontSize: 14 },
    coinTossBtnText: { fontSize: 13, color: "#C9A84C", fontWeight: "600" },
    coinTossBtnTextLocked: { color: "#4A4A6A" },
});


export default function GoalsScreen() {
    const { state, dispatch } = useFinance();
    const [showAddModal, setShowAddModal] = useState(false);
    const [coinTossGoalId, setCoinTossGoalId] = useState<string | null>(null);

    const coinTossGoal = coinTossGoalId ? state.goals.find((g) => g.id === coinTossGoalId) : null;
    const totalSaved = state.goals.reduce((s, g) => s + g.currentAmount, 0);
    const totalTarget = state.goals.reduce((s, g) => s + g.targetAmount, 0);
    const completedGoals = state.goals.filter((g) => g.currentAmount >= g.targetAmount).length;

    const handleAddGoal = (goal: Omit<Goal, "id" | "currentAmount" | "coinTossUsed" | "createdAt">) => {
        dispatch({
            type: "ADD_GOAL",
            payload: {
                id: Date.now().toString(),
                currentAmount: 0,
                coinTossUsed: false,
                createdAt: new Date().toISOString(),
                ...goal,
            },
        });
    };

    const handleAllocate = (id: string) => {
        Alert.prompt(
            "Add Funds",
            "How much do you want to allocate to this goal? (€)",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Add",
                    onPress: (value: string | undefined) => {
                        const amount = parseFloat(value ?? "0");
                        if (isNaN(amount) || amount <= 0) return;
                        dispatch({ type: "ALLOCATE_TO_GOAL", payload: { goalId: id, amount } });
                    },
                },
            ],
            "plain-text",
            "",
            "decimal-pad"
        );
    };

    const handleCoinTossResult = (won: boolean) => {
        if (!coinTossGoalId) return;
        const goal = state.goals.find((g) => g.id === coinTossGoalId);
        if (!goal) return;

        if (won) {
            const remaining = goal.targetAmount - goal.currentAmount;
            dispatch({ type: "ALLOCATE_TO_GOAL", payload: { goalId: coinTossGoalId, amount: remaining } });
            dispatch({ type: "EARN_BADGE", payload: "b4" });
            Alert.alert("You won!", `Congrats! The goal "${goal.name}" has been completed!`);
        } else {
            Alert.alert("Next time!", "You did not win this time. The goal stays active. Keep saving!");
        }
        setCoinTossGoalId(null);
    };

    const handleDelete = (id: string) => {
        Alert.alert("Delete goal", "Are you sure you want to delete this goal?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => dispatch({ type: "DELETE_GOAL", payload: id }) },
        ]);
    };

    return (
        <ScreenContainer containerClassName="bg-background">
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <Text style={styles.title}>Financial Goals</Text>
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

                {state.goals.length > 0 && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryValue}>{state.goals.length}</Text>
                            <Text style={styles.summaryLabel}>Goals</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: "#2ECC71" }]}>{completedGoals}</Text>
                            <Text style={styles.summaryLabel}>Completed</Text>
                        </View>
                        <View style={styles.summaryDivider} />
                        <View style={styles.summaryItem}>
                            <Text style={[styles.summaryValue, { color: "#C9A84C" }]}>{totalSaved.toFixed(0)} €</Text>
                            <Text style={styles.summaryLabel}>Saved</Text>
                        </View>
                    </View>
                )}

                {state.goals.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🎯</Text>
                        <Text style={styles.emptyTitle}>No goals yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Add your first financial goal and start saving with purpose.
                        </Text>
                        <TouchableOpacity style={styles.emptyBtn} onPress={() => setShowAddModal(true)}>
                            <Text style={styles.emptyBtnText}>Add Goal</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={state.goals}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <GoalCard
                                goal={item}
                                isPremium={state.profile.isPremium}
                                onAllocate={handleAllocate}
                                onCoinToss={(id) => setCoinTossGoalId(id)}
                                onDelete={handleDelete}
                            />
                        )}
                        scrollEnabled={false}
                    />
                )}

                {!state.profile.isPremium && state.goals.length > 0 && (
                    <View style={styles.premiumHint}>
                        <IconSymbol name="crown.fill" size={16} color="#C9A84C" />
                        <Text style={styles.premiumHintText}>
                            Unlock "I Want It Now" with Royal Flush Premium
                        </Text>
                    </View>
                )}
            </ScrollView>

            <AddGoalModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddGoal}
            />

            {coinTossGoal && (
                <CoinTossModal
                    visible={!!coinTossGoalId}
                    goalName={coinTossGoal.name}
                    onResult={handleCoinTossResult}
                    onClose={() => setCoinTossGoalId(null)}
                />
            )}
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
    summaryCard: {
        flexDirection: "row",
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#2E2E4A",
        justifyContent: "space-around",
    },
    summaryItem: { alignItems: "center" },
    summaryValue: { fontSize: 22, fontWeight: "800", color: "#F5F0E8" },
    summaryLabel: { fontSize: 12, color: "#8A8A9A", marginTop: 4 },
    summaryDivider: { width: 1, backgroundColor: "#2E2E4A" },
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
    emptySubtitle: { fontSize: 13, color: "#8A8A9A", textAlign: "center", lineHeight: 20, marginBottom: 20 },
    emptyBtn: {
        backgroundColor: "#C9A84C",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    emptyBtnText: { color: "#0D0D0D", fontSize: 14, fontWeight: "700" },
    premiumHint: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#C9A84C11",
        borderRadius: 12,
        padding: 14,
        gap: 8,
        borderWidth: 1,
        borderColor: "#C9A84C33",
        marginTop: 8,
    },
    premiumHintText: { fontSize: 13, color: "#C9A84C", flex: 1 },
});
