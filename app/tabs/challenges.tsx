import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    Modal,
    Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance, Challenge } from "@/lib/finance-context";


interface CoinTossProps {
    visible: boolean;
    challengeTitle: string;
    onResult: (won: boolean) => void;
    onClose: () => void;
}

function CoinTossModal({ visible, challengeTitle, onResult, onClose }: CoinTossProps) {
    const [flipping, setFlipping] = useState(false);
    const [result, setResult] = useState<"heads" | "tails" | null>(null);
    const spinAnim = React.useRef(new Animated.Value(0)).current;

    const flip = () => {
        if (flipping) return;
        setFlipping(true);
        setResult(null);
        spinAnim.setValue(0);
        Animated.timing(spinAnim, {
            toValue: 3,
            duration: 1200,
            useNativeDriver: true,
        }).start(() => {
            const won = Math.random() > 0.5;
            setResult(won ? "heads" : "tails");
            setFlipping(false);
            setTimeout(() => onResult(won), 800);
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
                    <Text style={coinStyles.title}>Challenge!</Text>
                    <Text style={coinStyles.subtitle} numberOfLines={2}>{challengeTitle}</Text>
                    <Text style={coinStyles.desc}>
                        Win the coin toss? The challenge will be automatically marked as completed with half the points.
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
                    {flipping && <Text style={coinStyles.flippingText}>Flipping...</Text>}
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
    subtitle: { fontSize: 14, color: "#F5F0E8", fontWeight: "600", textAlign: "center" },
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
    coinInner: { width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center" },
    coinText: { fontSize: 20, fontWeight: "900", color: "#0D0D0D" },
    flipBtn: { borderRadius: 14, overflow: "hidden", width: "100%" },
    flipBtnGradient: { paddingVertical: 16, alignItems: "center" },
    flipBtnText: { fontSize: 16, fontWeight: "800", color: "#0D0D0D" },
    flippingText: { fontSize: 16, color: "#C9A84C", fontWeight: "600" },
    cancelBtn: { paddingVertical: 12 },
    cancelText: { fontSize: 14, color: "#8A8A9A" },
});


const STATUS_CONFIG = {
    available: { color: "#3498DB", label: "Available", icon: "play.circle.fill" as const },
    active: { color: "#F39C12", label: "In Progress", icon: "clock.fill" as const },
    completed: { color: "#2ECC71", label: "Completed", icon: "checkmark.circle.fill" as const },
    failed: { color: "#E74C3C", label: "Failed", icon: "xmark.circle.fill" as const },
};

interface ChallengeCardProps {
    challenge: Challenge;
    isPremium: boolean;
    onStart: (id: string) => void;
    onComplete: (id: string) => void;
    onFail: (id: string) => void;
    onCoinToss: (id: string) => void;
}

function ChallengeCard({ challenge, isPremium, onStart, onComplete, onFail, onCoinToss }: ChallengeCardProps) {
    const config = STATUS_CONFIG[challenge.status];

    return (
        <View style={[cardStyles.card, challenge.status === "completed" && cardStyles.cardCompleted, challenge.status === "failed" && cardStyles.cardFailed]}>
            <View style={cardStyles.header}>
                <View style={[cardStyles.statusIcon, { backgroundColor: config.color + "22" }]}>
                    <IconSymbol name={config.icon} size={20} color={config.color} />
                </View>
                <View style={cardStyles.info}>
                    <Text style={cardStyles.title}>{challenge.title}</Text>
                    <View style={cardStyles.meta}>
                        <View style={[cardStyles.statusBadge, { backgroundColor: config.color + "22" }]}>
                            <Text style={[cardStyles.statusText, { color: config.color }]}>{config.label}</Text>
                        </View>
                        <View style={cardStyles.pointsBadge}>
                            <IconSymbol name="sparkles" size={12} color="#C9A84C" />
                            <Text style={cardStyles.pointsText}>{challenge.points} pts</Text>
                        </View>
                    </View>
                </View>
            </View>

            <Text style={cardStyles.desc}>{challenge.description}</Text>

            <View style={cardStyles.footer}>
                <View style={cardStyles.durationRow}>
                    <IconSymbol name="calendar" size={14} color="#8A8A9A" />
                    <Text style={cardStyles.durationText}>{challenge.durationDays} days</Text>
                </View>

                {challenge.status === "available" && (
                    <TouchableOpacity
                        style={cardStyles.actionBtn}
                        onPress={() => onStart(challenge.id)}
                    >
                        <LinearGradient
                            colors={["#3498DB22", "#3498DB44"]}
                            style={cardStyles.actionBtnGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={[cardStyles.actionBtnText, { color: "#3498DB" }]}>Start</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {challenge.status === "active" && (
                    <View style={cardStyles.activeActions}>
                        <TouchableOpacity
                            style={[cardStyles.smallBtn, cardStyles.failBtn]}
                            onPress={() => onFail(challenge.id)}
                        >
                            <Text style={cardStyles.failBtnText}>Give up</Text>
                        </TouchableOpacity>
                        {!challenge.coinTossUsed && (
                            <TouchableOpacity
                                style={[cardStyles.smallBtn, cardStyles.coinBtn, !isPremium && cardStyles.coinBtnLocked]}
                                onPress={() => isPremium ? onCoinToss(challenge.id) : Alert.alert("Premium", "The coin toss is only available for Premium subscribers.")}
                            >
                                <Text style={cardStyles.coinBtnIcon}>🪙</Text>
                                {!isPremium && <IconSymbol name="lock.fill" size={12} color="#4A4A6A" />}
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[cardStyles.smallBtn, cardStyles.completeBtn]}
                            onPress={() => onComplete(challenge.id)}
                        >
                            <Text style={cardStyles.completeBtnText}>Completed!</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    cardCompleted: { borderColor: "#2ECC7144", opacity: 0.8 },
    cardFailed: { borderColor: "#E74C3C44", opacity: 0.6 },
    header: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 10 },
    statusIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    info: { flex: 1 },
    title: { fontSize: 15, fontWeight: "700", color: "#F5F0E8", marginBottom: 6 },
    meta: { flexDirection: "row", gap: 8, alignItems: "center" },
    statusBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
    statusText: { fontSize: 11, fontWeight: "700" },
    pointsBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
    pointsText: { fontSize: 12, color: "#C9A84C", fontWeight: "600" },
    desc: { fontSize: 13, color: "#8A8A9A", lineHeight: 20, marginBottom: 12 },
    footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    durationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
    durationText: { fontSize: 12, color: "#8A8A9A" },
    actionBtn: { borderRadius: 10, overflow: "hidden" },
    actionBtnGradient: { paddingVertical: 8, paddingHorizontal: 20 },
    actionBtnText: { fontSize: 13, fontWeight: "700" },
    activeActions: { flexDirection: "row", gap: 8, alignItems: "center" },
    smallBtn: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
    failBtn: { backgroundColor: "#E74C3C22", borderWidth: 1, borderColor: "#E74C3C44" },
    failBtnText: { fontSize: 12, color: "#E74C3C", fontWeight: "600" },
    coinBtn: {
        backgroundColor: "#C9A84C22",
        borderWidth: 1,
        borderColor: "#C9A84C44",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    coinBtnLocked: { backgroundColor: "#2E2E4A22", borderColor: "#2E2E4A" },
    coinBtnIcon: { fontSize: 16 },
    completeBtn: { backgroundColor: "#2ECC7122", borderWidth: 1, borderColor: "#2ECC7144" },
    completeBtnText: { fontSize: 12, color: "#2ECC71", fontWeight: "600" },
});


export default function ChallengesScreen() {
    const { state, dispatch } = useFinance();
    const [coinTossChallengeId, setCoinTossChallengeId] = useState<string | null>(null);

    const coinTossChallenge = coinTossChallengeId
        ? state.challenges.find((c) => c.id === coinTossChallengeId)
        : null;

    const activeChallenges = state.challenges.filter((c) => c.status === "active");
    const availableChallenges = state.challenges.filter((c) => c.status === "available");
    const completedChallenges = state.challenges.filter((c) => c.status === "completed");
    const failedChallenges = state.challenges.filter((c) => c.status === "failed");

    const handleStart = (id: string) => {
        dispatch({ type: "START_CHALLENGE", payload: id });
        dispatch({ type: "ADD_POINTS", payload: 5 });
    };

    const handleComplete = (id: string) => {
        dispatch({ type: "COMPLETE_CHALLENGE", payload: { id } });
        dispatch({ type: "EARN_BADGE", payload: "b3" });
        Alert.alert("Congrats!", "You completed the challenge and earned points!");
    };

    const handleFail = (id: string) => {
        Alert.alert(
            "Give up on this challenge?",
            "You will lose your progress for this challenge.",
            [
                { text: "Keep Going", style: "cancel" },
                { text: "Give Up", style: "destructive", onPress: () => dispatch({ type: "FAIL_CHALLENGE", payload: id }) },
            ]
        );
    };

    const handleCoinTossResult = (won: boolean) => {
        if (!coinTossChallengeId) return;
        dispatch({ type: "USE_CHALLENGE_COIN_TOSS", payload: coinTossChallengeId });
        if (won) {
            dispatch({ type: "COMPLETE_CHALLENGE", payload: { id: coinTossChallengeId, halfPoints: true } });
            Alert.alert("You won!", "The challenge was marked as completed with half the points!");
        } else {
            Alert.alert("Next time!", "You did not win. Keep going to complete the challenge for full points!");
        }
        setCoinTossChallengeId(null);
    };

    const renderSection = (title: string, challenges: Challenge[], color: string) => {
        if (challenges.length === 0) return null;
        return (
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color }]}>{title} ({challenges.length})</Text>
                <FlatList
                    data={challenges}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ChallengeCard
                            challenge={item}
                            isPremium={state.profile.isPremium}
                            onStart={handleStart}
                            onComplete={handleComplete}
                            onFail={handleFail}
                            onCoinToss={(id) => setCoinTossChallengeId(id)}
                        />
                    )}
                    scrollEnabled={false}
                />
            </View>
        );
    };

    return (
        <ScreenContainer containerClassName="bg-background">
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <Text style={styles.title}>Challenges</Text>
                    <View style={styles.pointsBadge}>
                        <IconSymbol name="sparkles" size={16} color="#C9A84C" />
                        <Text style={styles.pointsValue}>{state.profile.points} pts</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={[styles.statValue, { color: "#F39C12" }]}>{activeChallenges.length}</Text>
                        <Text style={styles.statLabel}>Active</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statValue, { color: "#2ECC71" }]}>{completedChallenges.length}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={[styles.statValue, { color: "#3498DB" }]}>{availableChallenges.length}</Text>
                        <Text style={styles.statLabel}>Available</Text>
                    </View>
                </View>

                <View style={styles.infoBanner}>
                    <IconSymbol name="lightbulb.fill" size={16} color="#C9A84C" />
                    <Text style={styles.infoText}>
                        Complete challenges to earn points and badges. Premium Coin Toss lets you finish an active challenge with half the points.
                    </Text>
                </View>

                {renderSection("In Progress", activeChallenges, "#F39C12")}
                {renderSection("Available", availableChallenges, "#3498DB")}
                {renderSection("Completed", completedChallenges, "#2ECC71")}
                {renderSection("Failed", failedChallenges, "#E74C3C")}

                {!state.profile.isPremium && (
                    <View style={styles.premiumHint}>
                        <IconSymbol name="crown.fill" size={16} color="#C9A84C" />
                        <Text style={styles.premiumHintText}>
                            Unlock Coin Toss for challenges with Royal Flush Premium
                        </Text>
                    </View>
                )}
            </ScrollView>

            {coinTossChallenge && (
                <CoinTossModal
                    visible={!!coinTossChallengeId}
                    challengeTitle={coinTossChallenge.title}
                    onResult={handleCoinTossResult}
                    onClose={() => setCoinTossChallengeId(null)}
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
    pointsBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#C9A84C22",
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
        gap: 6,
        borderWidth: 1,
        borderColor: "#C9A84C44",
    },
    pointsValue: { fontSize: 14, color: "#C9A84C", fontWeight: "700" },
    statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
    statCard: {
        flex: 1,
        backgroundColor: "#1A1A2E",
        borderRadius: 14,
        padding: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    statValue: { fontSize: 22, fontWeight: "800" },
    statLabel: { fontSize: 11, color: "#8A8A9A", marginTop: 4 },
    infoBanner: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#C9A84C11",
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        gap: 10,
        borderWidth: 1,
        borderColor: "#C9A84C33",
    },
    infoText: { flex: 1, fontSize: 13, color: "#F5F0E8", lineHeight: 20 },
    section: { marginBottom: 8 },
    sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 10 },
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
