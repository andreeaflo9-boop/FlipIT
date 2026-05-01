import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface GlossaryTerm {
    id: string;
    term: string;
    definition: string;
    icon: string;
    color: string;
}

interface Tip {
    id: string;
    title: string;
    content: string;
    category: string;
}

const GLOSSARY: GlossaryTerm[] = [
    {
        id: "g1",
        term: "Interest",
        definition: "The cost of borrowing money, shown as a percentage of the borrowed amount. If you borrow €1000 at 5% interest per year, you will pay €50 extra.",
        icon: "💰",
        color: "#C9A84C",
    },
    {
        id: "g2",
        term: "Credit",
        definition: "Money borrowed from a bank or financial institution, which must be repaid with interest over an agreed period.",
        icon: "💳",
        color: "#3498DB",
    },
    {
        id: "g3",
        term: "Emergency Fund",
        definition: "Money set aside for unexpected situations, such as illness, repairs, or job loss. A common recommendation is 3 to 6 months of expenses.",
        icon: "🛡️",
        color: "#2ECC71",
    },
    {
        id: "g4",
        term: "Investment",
        definition: "Putting money into assets, such as stocks, bonds, or real estate, with the goal of earning more over time. Investments involve risk.",
        icon: "📈",
        color: "#9B59B6",
    },
    {
        id: "g5",
        term: "Inflation",
        definition: "The general increase in prices over time. If inflation is 5%, €100 will buy less next year than it does today.",
        icon: "📊",
        color: "#E74C3C",
    },
    {
        id: "g6",
        term: "Budget",
        definition: "A financial plan that estimates income and expenses for a period. A good budget helps you save money and avoid debt.",
        icon: "📋",
        color: "#F39C12",
    },
    {
        id: "g7",
        term: "Liquidity",
        definition: "How easily an asset can be turned into cash. Money in your bank account is highly liquid. A house is less liquid.",
        icon: "💧",
        color: "#1ABC9C",
    },
    {
        id: "g8",
        term: "Diversification",
        definition: "The strategy of spreading money across different assets. This lowers risk because one bad investment does not affect everything.",
        icon: "🎯",
        color: "#E91E63",
    },
];

const TIPS: Tip[] = [
    {
        id: "t1",
        title: "The 50/30/20 rule",
        content: "Use 50% of your income for needs, 30% for wants, and 20% for savings and investments.",
        category: "Savings",
    },
    {
        id: "t2",
        title: "Avoid impulse spending",
        content: "Before a big purchase, wait 24 hours. If you still want it the next day, it may be worth it.",
        category: "Discipline",
    },
    {
        id: "t3",
        title: "Automate your savings",
        content: "Set an automatic transfer on payday. Treat savings like a required bill.",
        category: "Savings",
    },
    {
        id: "t4",
        title: "Build an emergency fund first",
        content: "Before investing, save 3 to 6 months of expenses. This helps you handle unexpected costs.",
        category: "Planning",
    },
    {
        id: "t5",
        title: "Understand compound interest",
        content: "Compound interest means your earnings also earn money over time.",
        category: "Investments",
    },
    {
        id: "t6",
        title: "Avoid high-interest debt",
        content: "Credit cards can have high yearly interest. Pay expensive debt before investing.",
        category: "Debt",
    },
];

const CATEGORY_COLORS: Record<string, string> = {
    Savings: "#2ECC71",
    Discipline: "#E74C3C",
    Planning: "#3498DB",
    Investments: "#C9A84C",
    Debt: "#F39C12",
};

export default function EducationScreen() {
    const router = useRouter();
    const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
    const [expandedTip, setExpandedTip] = useState<string | null>(null);

    const renderGlossaryItem = ({ item }: { item: GlossaryTerm }) => {
        const isExpanded = expandedTerm === item.id;
        return (
            <TouchableOpacity
                style={styles.glossaryCard}
                onPress={() => setExpandedTerm(isExpanded ? null : item.id)}
            >
                <View style={styles.glossaryHeader}>
                    <View style={[styles.glossaryIcon, { backgroundColor: item.color + "22" }]}>
                        <Text style={styles.glossaryEmoji}>{item.icon}</Text>
                    </View>
                    <Text style={styles.glossaryTerm}>{item.term}</Text>
                    <IconSymbol
                        name={isExpanded ? "chevron.up" : "chevron.down"}
                        size={16}
                        color="#8A8A9A"
                    />
                </View>
                {isExpanded && (
                    <Text style={styles.glossaryDef}>{item.definition}</Text>
                )}
            </TouchableOpacity>
        );
    };

    const renderTip = ({ item }: { item: Tip }) => {
        const isExpanded = expandedTip === item.id;
        const color = CATEGORY_COLORS[item.category] ?? "#C9A84C";
        return (
            <TouchableOpacity
                style={styles.tipCard}
                onPress={() => setExpandedTip(isExpanded ? null : item.id)}
            >
                <View style={styles.tipHeader}>
                    <View style={[styles.tipCategoryBadge, { backgroundColor: color + "22" }]}>
                        <Text style={[styles.tipCategory, { color }]}>{item.category}</Text>
                    </View>
                    <IconSymbol
                        name={isExpanded ? "chevron.up" : "chevron.down"}
                        size={16}
                        color="#8A8A9A"
                    />
                </View>
                <Text style={styles.tipTitle}>{item.title}</Text>
                {isExpanded && (
                    <Text style={styles.tipContent}>{item.content}</Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <ScreenContainer containerClassName="bg-background">
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <IconSymbol name="chevron.left" size={24} color="#C9A84C" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Financial Education</Text>
                </View>


                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <IconSymbol name="book.fill" size={18} color="#3498DB" />
                        <Text style={styles.sectionTitle}>Financial Glossary</Text>
                    </View>
                    <Text style={styles.sectionSubtitle}>Tap a term to see its definition</Text>
                    <FlatList
                        data={GLOSSARY}
                        keyExtractor={(item) => item.id}
                        renderItem={renderGlossaryItem}
                        scrollEnabled={false}
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <IconSymbol name="lightbulb.fill" size={18} color="#C9A84C" />
                        <Text style={styles.sectionTitle}>Practical Tips</Text>
                    </View>
                    <Text style={styles.sectionSubtitle}>Tested strategies for financial health</Text>
                    <FlatList
                        data={TIPS}
                        keyExtractor={(item) => item.id}
                        renderItem={renderTip}
                        scrollEnabled={false}
                    />
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
    section: { marginBottom: 32 },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#F5F0E8" },
    sectionSubtitle: { fontSize: 13, color: "#8A8A9A", marginBottom: 16 },
    glossaryCard: {
        backgroundColor: "#1A1A2E",
        borderRadius: 14,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    glossaryHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
    glossaryIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    glossaryEmoji: { fontSize: 20 },
    glossaryTerm: { flex: 1, fontSize: 15, fontWeight: "700", color: "#F5F0E8" },
    glossaryDef: {
        fontSize: 13,
        color: "#8A8A9A",
        lineHeight: 22,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#2E2E4A",
    },
    tipCard: {
        backgroundColor: "#1A1A2E",
        borderRadius: 14,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#2E2E4A",
    },
    tipHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
    tipCategoryBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    tipCategory: { fontSize: 11, fontWeight: "700" },
    tipTitle: { fontSize: 15, fontWeight: "700", color: "#F5F0E8" },
    tipContent: {
        fontSize: 13,
        color: "#8A8A9A",
        lineHeight: 22,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#2E2E4A",
    },
});
