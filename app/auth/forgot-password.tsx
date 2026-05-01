import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/lib/auth-context";

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleReset = async () => {
        setLoading(true);
        const result = await resetPassword(email);
        setLoading(false);
        if (result.success) {
            setSent(true);
        } else {
            Alert.alert("Error", result.error ?? "Something went wrong.");
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#0D0D0D", "#1A1A2E", "#0D0D0D"]}
                style={StyleSheet.absoluteFillObject}
            />

            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <IconSymbol name="chevron.left" size={24} color="#C9A84C" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.content}>

                <View style={styles.iconContainer}>
                    <IconSymbol name="lock.fill" size={40} color="#C9A84C" />
                </View>

                <Text style={styles.title}>Reset password</Text>
                <Text style={styles.subtitle}>
                    Enter your email address and we will send you reset instructions.
                </Text>

                {sent ? (
                    <View style={styles.successCard}>
                        <IconSymbol name="checkmark.circle.fill" size={48} color="#2ECC71" />
                        <Text style={styles.successTitle}>Email sent!</Text>
                        <Text style={styles.successText}>
                            Check your inbox for password reset instructions.
                        </Text>
                        <TouchableOpacity style={styles.backToLoginBtn} onPress={() => router.back()}>
                            <Text style={styles.backToLoginText}>Back to login</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputWrapper}>
                                <IconSymbol name="envelope.fill" size={18} color="#8A8A9A" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="email@example.com"
                                    placeholderTextColor="#8A8A9A"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.resetBtn, loading && styles.btnDisabled]}
                            onPress={handleReset}
                            disabled={loading}
                        >
                            <LinearGradient
                                colors={["#E8C96D", "#C9A84C", "#A8872E"]}
                                style={styles.btnGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.btnText}>
                                    {loading ? "Sending..." : "Send email"}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0D0D0D" },
    backBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 60,
        paddingHorizontal: 24,
        gap: 4,
    },
    backText: { color: "#C9A84C", fontSize: 16 },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 40 },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: "#1A1A2E",
        borderWidth: 1,
        borderColor: "#2E2E4A",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    title: { fontSize: 28, fontWeight: "800", color: "#F5F0E8", marginBottom: 8 },
    subtitle: { fontSize: 14, color: "#8A8A9A", lineHeight: 22, marginBottom: 32 },
    card: {
        backgroundColor: "#1A1A2E",
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    inputGroup: { marginBottom: 20 },
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
    resetBtn: { borderRadius: 14, overflow: "hidden" },
    btnDisabled: { opacity: 0.6 },
    btnGradient: { paddingVertical: 16, alignItems: "center" },
    btnText: { color: "#0D0D0D", fontSize: 16, fontWeight: "700" },
    successCard: {
        backgroundColor: "#1A1A2E",
        borderRadius: 24,
        padding: 32,
        borderWidth: 1,
        borderColor: "#2E2E4A",
        alignItems: "center",
    },
    successTitle: { fontSize: 22, fontWeight: "700", color: "#F5F0E8", marginTop: 16, marginBottom: 8 },
    successText: { fontSize: 14, color: "#8A8A9A", textAlign: "center", lineHeight: 22, marginBottom: 24 },
    backToLoginBtn: {
        backgroundColor: "#2E2E4A",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 32,
    },
    backToLoginText: { color: "#C9A84C", fontSize: 15, fontWeight: "600" },
});
