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

export default function RegisterScreen() {
    const router = useRouter();
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
        setLoading(true);
        const result = await register(name, email, password);
        setLoading(false);
        if (result.success) {
            router.replace("/(tabs)");
        } else {
            Alert.alert("Error", result.error ?? "Registration failed.");
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

                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color="#C9A84C" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Create account</Text>
                    <Text style={styles.subtitle}>Join the financial game</Text>
                </View>


                <View style={styles.card}>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <View style={styles.inputWrapper}>
                            <IconSymbol name="person.fill" size={18} color="#8A8A9A" />
                            <TextInput
                                style={styles.input}
                                placeholder="Your name"
                                placeholderTextColor="#8A8A9A"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>
                    </View>

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
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <IconSymbol name="lock.fill" size={18} color="#8A8A9A" />
                            <TextInput
                                style={styles.input}
                                placeholder="At least 6 characters"
                                placeholderTextColor="#8A8A9A"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm password</Text>
                        <View style={styles.inputWrapper}>
                            <IconSymbol name="lock.fill" size={18} color="#8A8A9A" />
                            <TextInput
                                style={styles.input}
                                placeholder="Repeat password"
                                placeholderTextColor="#8A8A9A"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.registerBtn, loading && styles.btnDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <LinearGradient
                            colors={["#E8C96D", "#C9A84C", "#A8872E"]}
                            style={styles.btnGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.btnText}>
                                {loading ? "Creating account..." : "Create account"}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.loginRow}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.loginLink}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0D0D0D" },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
    backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 24, gap: 4 },
    backText: { color: "#C9A84C", fontSize: 16 },
    header: { marginBottom: 28 },
    title: { fontSize: 30, fontWeight: "800", color: "#F5F0E8" },
    subtitle: { fontSize: 14, color: "#8A8A9A", marginTop: 4 },
    card: {
        backgroundColor: "#1A1A2E",
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
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
    registerBtn: { borderRadius: 14, overflow: "hidden", marginTop: 8 },
    btnDisabled: { opacity: 0.6 },
    btnGradient: { paddingVertical: 16, alignItems: "center" },
    btnText: { color: "#0D0D0D", fontSize: 16, fontWeight: "700" },
    loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
    loginText: { color: "#8A8A9A", fontSize: 14 },
    loginLink: { color: "#C9A84C", fontSize: 14, fontWeight: "600" },
});
