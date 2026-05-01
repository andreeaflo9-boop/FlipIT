import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/lib/auth-context";

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (result.success) {
            router.replace("/(tabs)");
        } else {
            Alert.alert("Error", result.error ?? "Login failed.");
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#0D0D0D", "#1A1A2E", "#0D0D0D"]}
                style={StyleSheet.absoluteFillObject}
            />
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>♠</Text>
                    </View>
                    <Text style={styles.title}>FlipIT</Text>
                    <Text style={styles.subtitle}>Your personal finance manager</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Welcome back!</Text>
                    <Text style={styles.cardSubtitle}>Log in to continue</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <IconSymbol name="envelope.fill" size={18} color="#8A8A9A" />
                            <TextInput
                                style={styles.input}
                                placeholder="email@exemple.com"
                                placeholderTextColor="#8A8A9A"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <IconSymbol name="lock.fill" size={18} color="#8A8A9A" />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#8A8A9A"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoComplete="password"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <IconSymbol
                                    name={showPassword ? "eye.slash.fill" : "eye.fill"}
                                    size={18}
                                    color="#8A8A9A"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.forgotBtn}
                        onPress={() => router.push("./forgot-password")}
                    >
                        <Text style={styles.forgotText}>Forgot password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={["#E8C96D", "#C9A84C", "#A8872E"]}
                            style={styles.loginGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.loginBtnText}>
                                {loading ? "Logging in..." : "Log in"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>


                </View>

                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push("./register")}>
                        <Text style={styles.registerLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0D0D0D" },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
    header: { alignItems: "center", marginBottom: 40 },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: "#1A1A2E",
        borderWidth: 2,
        borderColor: "#C9A84C",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    logoText: { fontSize: 40, color: "#C9A84C" },
    title: { fontSize: 36, fontWeight: "800", color: "#C9A84C", letterSpacing: 2 },
    subtitle: { fontSize: 14, color: "#8A8A9A", marginTop: 4 },
    card: {
        backgroundColor: "#1A1A2E",
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    cardTitle: { fontSize: 22, fontWeight: "700", color: "#F5F0E8", marginBottom: 4 },
    cardSubtitle: { fontSize: 14, color: "#8A8A9A", marginBottom: 24 },
    inputGroup: { marginBottom: 16 },
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
    forgotBtn: { alignSelf: "flex-end", marginBottom: 20 },
    forgotText: { color: "#C9A84C", fontSize: 13 },
    loginBtn: { borderRadius: 14, overflow: "hidden", marginBottom: 20 },
    loginBtnDisabled: { opacity: 0.6 },
    loginGradient: { paddingVertical: 16, alignItems: "center" },
    loginBtnText: { color: "#0D0D0D", fontSize: 16, fontWeight: "700" },
    divider: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 12 },
    dividerLine: { flex: 1, height: 1, backgroundColor: "#2E2E4A" },
    dividerText: { color: "#8A8A9A", fontSize: 13 },
    socialBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0D0D0D",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2E2E4A",
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginBottom: 12,
        gap: 12,
    },
    socialIcon: { fontSize: 18, color: "#F5F0E8", fontWeight: "700", width: 24, textAlign: "center" },
    socialText: { color: "#F5F0E8", fontSize: 15, fontWeight: "500" },
    registerRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
    registerText: { color: "#8A8A9A", fontSize: 14 },
    registerLink: { color: "#C9A84C", fontSize: 14, fontWeight: "600" },
});
