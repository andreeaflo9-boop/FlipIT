import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Alert,
    TextInput,
    Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ScreenContainer } from "@/components/screen-container";
import { useFinance } from "@/lib/finance-context";
import { useAuth } from "@/lib/auth-context";



function ChangePasswordModal({
                                 visible,
                                 onClose,
                             }: {
    visible: boolean;
    onClose: () => void;
}) {
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleSave = () => {
        if (!current || !next || !confirm) {
            Alert.alert("Error", "Complete all fields.");
            return;
        }
        if (next !== confirm) {
            Alert.alert("Error", "New passwords do not match.");
            return;
        }
        if (next.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters.");
            return;
        }
        Alert.alert("Success", "Password has been changed.");
        setCurrent(""); setNext(""); setConfirm("");
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={pwStyles.overlay}>
                <View style={pwStyles.card}>
                    <View style={pwStyles.header}>
                        <Text style={pwStyles.title}>Change password</Text>
                        <TouchableOpacity onPress={onClose}>
                            <IconSymbol name="xmark.circle.fill" size={26} color="#8A8A9A" />
                        </TouchableOpacity>
                    </View>
                    {[
                        { label: "Current password", value: current, set: setCurrent },
                        { label: "New password", value: next, set: setNext },
                        { label: "Confirm new password", value: confirm, set: setConfirm },
                    ].map(({ label, value, set }) => (
                        <View key={label} style={pwStyles.inputGroup}>
                            <Text style={pwStyles.label}>{label}</Text>
                            <View style={pwStyles.inputWrapper}>
                                <IconSymbol name="lock.fill" size={16} color="#8A8A9A" />
                                <TextInput
                                    style={pwStyles.input}
                                    secureTextEntry
                                    value={value}
                                    onChangeText={set}
                                    placeholderTextColor="#8A8A9A"
                                    placeholder="••••••••"
                                />
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity style={pwStyles.saveBtn} onPress={handleSave}>
                        <LinearGradient
                            colors={["#E8C96D", "#C9A84C"]}
                            style={pwStyles.saveBtnGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={pwStyles.saveBtnText}>Save</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const pwStyles = StyleSheet.create({
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
    inputGroup: { marginBottom: 14 },
    label: { fontSize: 13, color: "#8A8A9A", marginBottom: 8, fontWeight: "600" },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0D0D0D",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2E2E4A",
        paddingHorizontal: 14,
        paddingVertical: 12,
        gap: 10,
    },
    input: { flex: 1, color: "#F5F0E8", fontSize: 15 },
    saveBtn: { borderRadius: 14, overflow: "hidden", marginTop: 8 },
    saveBtnGradient: { paddingVertical: 16, alignItems: "center" },
    saveBtnText: { color: "#0D0D0D", fontSize: 16, fontWeight: "700" },
});


function SettingsRow({
                         icon,
                         iconColor,
                         label,
                         value,
                         onPress,
                         rightElement,
                         danger,
                     }: {
    icon: string;
    iconColor: string;
    label: string;
    value?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    danger?: boolean;
}) {
    return (
        <TouchableOpacity
            style={rowStyles.row}
            onPress={onPress}
            disabled={!onPress && !rightElement}
        >
            <View style={[rowStyles.iconBg, { backgroundColor: iconColor + "22" }]}>
                <IconSymbol name={icon as any} size={18} color={iconColor} />
            </View>
            <Text style={[rowStyles.label, danger && rowStyles.labelDanger]}>{label}</Text>
            <View style={rowStyles.right}>
                {value && <Text style={rowStyles.value}>{value}</Text>}
                {rightElement}
                {onPress && !rightElement && (
                    <IconSymbol name="chevron.right" size={18} color="#4A4A6A" />
                )}
            </View>
        </TouchableOpacity>
    );
}

const rowStyles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 14,
    },
    iconBg: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    label: { flex: 1, fontSize: 15, color: "#F5F0E8" },
    labelDanger: { color: "#E74C3C" },
    right: { flexDirection: "row", alignItems: "center", gap: 8 },
    value: { fontSize: 14, color: "#8A8A9A" },
});


function SectionCard({ children }: { children: React.ReactNode }) {
    return (
        <View style={sectionStyles.card}>
            {children}
        </View>
    );
}

const sectionStyles = StyleSheet.create({
    card: {
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#2E2E4A",
        overflow: "hidden",
        marginBottom: 20,
    },
});


export default function SettingsScreen() {
    const router = useRouter();
    const { state, dispatch } = useFinance();
    const { logout } = useAuth();
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            "Log out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log out",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace("/auth");
                    },
                },
            ]
        );
    };

    const handleResetData = () => {
        Alert.alert(
            "Delete data",
            "This will delete all your transactions, goals, and progress. This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete all",
                    style: "destructive",
                    onPress: () => {
                        dispatch({ type: "LOAD_STATE", payload: { transactions: [], goals: [] } });
                        Alert.alert("Done", "Your data has been deleted.");
                    },
                },
            ]
        );
    };

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
                    <Text style={styles.title}>Settings</Text>
                </View>

                <View style={styles.profileCard}>
                    <View style={styles.avatarBg}>
                        <IconSymbol name="person.fill" size={32} color="#C9A84C" />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{state.profile.name}</Text>
                        <Text style={styles.profileEmail}>{state.profile.email || "user@flipit.app"}</Text>
                        {state.profile.isPremium && (
                            <View style={styles.premiumBadge}>
                                <IconSymbol name="crown.fill" size={12} color="#0D0D0D" />
                                <Text style={styles.premiumBadgeText}>Royal Flush</Text>
                            </View>
                        )}
                    </View>
                </View>

                <Text style={styles.sectionLabel}>Preferences</Text>
                <SectionCard>
                    <SettingsRow
                        icon="moon.fill"
                        iconColor="#9B59B6"
                        label="Dark mode"
                        rightElement={
                            <Switch
                                value={state.profile.darkMode}
                                onValueChange={(v) => dispatch({ type: "UPDATE_PROFILE", payload: { darkMode: v } })}
                                trackColor={{ false: "#2E2E4A", true: "#C9A84C" }}
                                thumbColor="#F5F0E8"
                            />
                        }
                    />
                    <View style={styles.divider} />
                    <SettingsRow
                        icon="bell.fill"
                        iconColor="#E74C3C"
                        label="Notifications"
                        rightElement={
                            <Switch
                                value={state.profile.notificationsEnabled}
                                onValueChange={(v) => dispatch({ type: "UPDATE_PROFILE", payload: { notificationsEnabled: v } })}
                                trackColor={{ false: "#2E2E4A", true: "#C9A84C" }}
                                thumbColor="#F5F0E8"
                            />
                        }
                    />
                    <View style={styles.divider} />
                    <SettingsRow
                        icon="exclamationmark.triangle.fill"
                        iconColor="#F39C12"
                        label="Financial scenarios"
                        rightElement={
                            <Switch
                                value={state.profile.scenariosEnabled}
                                onValueChange={(v) => dispatch({ type: "UPDATE_PROFILE", payload: { scenariosEnabled: v } })}
                                trackColor={{ false: "#2E2E4A", true: "#C9A84C" }}
                                thumbColor="#F5F0E8"
                            />
                        }
                    />
                </SectionCard>

                <Text style={styles.sectionLabel}>Account</Text>
                <SectionCard>
                    <SettingsRow
                        icon="lock.fill"
                        iconColor="#3498DB"
                        label="Change password"
                        onPress={() => setShowPasswordModal(true)}
                    />
                    <View style={styles.divider} />
                    <SettingsRow
                        icon="crown.fill"
                        iconColor="#C9A84C"
                        label="Royal Flush Premium"
                        value={state.profile.isPremium ? "Active" : "Inactive"}
                        onPress={() => router.push("/premium")}
                    />
                </SectionCard>

                <Text style={styles.sectionLabel}>Danger zone</Text>
                <SectionCard>
                    <SettingsRow
                        icon="trash.fill"
                        iconColor="#E74C3C"
                        label="Delete my data"
                        onPress={handleResetData}
                        danger
                    />
                    <View style={styles.divider} />
                    <SettingsRow
                        icon="arrow.right.circle.fill"
                        iconColor="#E74C3C"
                        label="Log out"
                        onPress={handleLogout}
                        danger
                    />
                </SectionCard>

                <View style={styles.appInfo}>
                    <Text style={styles.appInfoText}>FlipIT v6.0.0</Text>
                    <Text style={styles.appInfoText}>Your personal finance manager</Text>
                </View>
            </ScrollView>

            <ChangePasswordModal
                visible={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />
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
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1A1A2E",
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#2E2E4A",
        gap: 14,
    },
    avatarBg: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: "#C9A84C22",
        borderWidth: 1,
        borderColor: "#C9A84C44",
        alignItems: "center",
        justifyContent: "center",
    },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 18, fontWeight: "700", color: "#F5F0E8" },
    profileEmail: { fontSize: 13, color: "#8A8A9A", marginTop: 2 },
    premiumBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#C9A84C",
        borderRadius: 8,
        paddingVertical: 3,
        paddingHorizontal: 8,
        gap: 4,
        alignSelf: "flex-start",
        marginTop: 6,
    },
    premiumBadgeText: { fontSize: 11, color: "#0D0D0D", fontWeight: "700" },
    sectionLabel: { fontSize: 12, color: "#8A8A9A", fontWeight: "700", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 },
    divider: { height: 1, backgroundColor: "#2E2E4A", marginLeft: 66 },
    appInfo: { alignItems: "center", paddingVertical: 20, gap: 4 },
    appInfoText: { fontSize: 12, color: "#4A4A6A" },
});
