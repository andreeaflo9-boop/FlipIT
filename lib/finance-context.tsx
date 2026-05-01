import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export type TransactionType = "income" | "expense" | "savings" | "investment";

export type Category =
    | "food"
    | "transport"
    | "rent"
    | "entertainment"
    | "health"
    | "utilities"
    | "salary"
    | "freelance"
    | "investment"
    | "savings"
    | "other";

export interface Transaction {
    id: string;
    type: TransactionType;
    category: Category;
    amount: number;
    description: string;
    date: string;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    createdAt: string;
    coinTossUsed: boolean;
    coinTossAvailableAt?: string;
    icon?: string;
    deadline?: string;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    durationDays: number;
    startedAt?: string;
    completedAt?: string;
    status: "available" | "active" | "completed" | "failed";
    points: number;
    coinTossUsed: boolean;
}

export interface Scenario {
    id: string;
    title: string;
    description: string;
    choices: ScenarioChoice[];
    triggeredAt?: string;
    resolvedAt?: string;
    chosenOptionId?: string;
    status: "pending" | "resolved";
}

export interface ScenarioChoice {
    id: string;
    label: string;
    feedback: string;
    impact: "positive" | "neutral" | "negative";
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt?: string;
}

export interface UserProfile {
    name: string;
    email: string;
    isPremium: boolean;
    premiumExpiresAt?: string;
    points: number;
    darkMode: boolean;
    scenariosEnabled: boolean;
    notificationsEnabled: boolean;
}

export interface FinanceState {
    profile: UserProfile;
    transactions: Transaction[];
    goals: Goal[];
    challenges: Challenge[];
    scenarios: Scenario[];
    badges: Badge[];
    isLoaded: boolean;
}



const DEFAULT_PROFILE: UserProfile = {
    name: "Player",
    email: "",
    isPremium: false,
    points: 0,
    darkMode: true,
    scenariosEnabled: true,
    notificationsEnabled: true,
};

const INITIAL_CHALLENGES: Challenge[] = [
    {
        id: "c1",
        title: "Can you survive 7 days on savings?",
        description: "All your income disappears. Can you survive 7 days using only your savings?",
        durationDays: 7,
        status: "available",
        points: 150,
        coinTossUsed: false,
    },
    {
        id: "c2",
        title: "No entertainment spending for one week",
        description: "Do not spend anything on entertainment for one week.",
        durationDays: 7,
        status: "available",
        points: 100,
        coinTossUsed: false,
    },
    {
        id: "c3",
        title: "Save 10% of your income",
        description: "Save at least 10% of your income this month.",
        durationDays: 30,
        status: "available",
        points: 200,
        coinTossUsed: false,
    },
];

const INITIAL_SCENARIOS: Scenario[] = [
    {
        id: "s1",
        title: "Unexpected vet visit",
        description: "Your pet suddenly gets sick. The treatment costs €300. What do you do?",
        choices: [
            { id: "s1c1", label: "Use my savings", feedback: "Good choice. Savings are meant for unexpected situations like this.", impact: "positive" },
            { id: "s1c2", label: "Use my emergency fund", feedback: "Excellent. This is exactly what an emergency fund is for.", impact: "positive" },
            { id: "s1c3", label: "Cut other expenses", feedback: "Solid plan. Temporarily reducing expenses helps you handle the situation.", impact: "neutral" },
        ],
        status: "pending",
    },
    {
        id: "s2",
        title: "Urgent car repair",
        description: "Your car breaks down and the repair costs €500. You need it for work. What do you do?",
        choices: [
            { id: "s2c1", label: "Use my savings", feedback: "Good decision. The car supports your income, so the expense is justified.", impact: "positive" },
            { id: "s2c2", label: "Take a small loan", feedback: "Risky. Loans include interest. Try to avoid borrowing for unexpected expenses.", impact: "negative" },
            { id: "s2c3", label: "Use my emergency fund", feedback: "Perfect. This is exactly why an emergency fund exists.", impact: "positive" },
        ],
        status: "pending",
    },
    {
        id: "s3",
        title: "Temporary income loss",
        description: "You lose an important client and your income drops by 30% this month. What do you do?",
        choices: [
            { id: "s3c1", label: "Cut expenses immediately", feedback: "Excellent. Adjusting fast to lower income is a key financial skill.", impact: "positive" },
            { id: "s3c2", label: "Keep spending normally from savings", feedback: "Risky. Savings should be a backup, not the first option.", impact: "negative" },
            { id: "s3c3", label: "Look for extra income", feedback: "Great move. Diversifying income is a strong long-term strategy.", impact: "positive" },
        ],
        status: "pending",
    },
];

const INITIAL_BADGES: Badge[] = [
    { id: "b1", name: "First Step", description: "You added your first transaction", icon: "star.fill" },
    { id: "b2", name: "Saver", description: "You reached €1000 in savings", icon: "trophy.fill" },
    { id: "b3", name: "Disciplined", description: "You completed your first challenge", icon: "checkmark.seal.fill" },
    { id: "b4", name: "Investor", description: "You made your first investment", icon: "chart.line.uptrend.xyaxis" },
    { id: "b5", name: "Royal Flush", description: "You activated Premium", icon: "crown.fill" },
];

const INITIAL_STATE: FinanceState = {
    profile: DEFAULT_PROFILE,
    transactions: [],
    goals: [],
    challenges: INITIAL_CHALLENGES,
    scenarios: INITIAL_SCENARIOS,
    badges: INITIAL_BADGES,
    isLoaded: false,
};



type Action =
    | { type: "LOAD_STATE"; payload: Partial<FinanceState> }
    | { type: "ADD_TRANSACTION"; payload: Transaction }
    | { type: "DELETE_TRANSACTION"; payload: string }
    | { type: "ADD_GOAL"; payload: Goal }
    | { type: "UPDATE_GOAL"; payload: Goal }
    | { type: "DELETE_GOAL"; payload: string }
    | { type: "ALLOCATE_TO_GOAL"; payload: { goalId: string; amount: number } }
    | { type: "START_CHALLENGE"; payload: string }
    | { type: "COMPLETE_CHALLENGE"; payload: { id: string; halfPoints?: boolean } }
    | { type: "FAIL_CHALLENGE"; payload: string }
    | { type: "USE_CHALLENGE_COIN_TOSS"; payload: string }
    | { type: "RESOLVE_SCENARIO"; payload: { id: string; choiceId: string } }
    | { type: "EARN_BADGE"; payload: string }
    | { type: "UPDATE_PROFILE"; payload: Partial<UserProfile> }
    | { type: "ADD_POINTS"; payload: number }
    | { type: "SET_GOAL_COIN_TOSS_USED"; payload: { goalId: string; availableAt: string } };



function reducer(state: FinanceState, action: Action): FinanceState {
    switch (action.type) {
        case "LOAD_STATE":
            return { ...state, ...action.payload, isLoaded: true };

        case "ADD_TRANSACTION":
            return { ...state, transactions: [action.payload, ...state.transactions] };

        case "DELETE_TRANSACTION":
            return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };

        case "ADD_GOAL":
            return { ...state, goals: [...state.goals, action.payload] };

        case "UPDATE_GOAL":
            return { ...state, goals: state.goals.map((g) => (g.id === action.payload.id ? action.payload : g)) };

        case "DELETE_GOAL":
            return { ...state, goals: state.goals.filter((g) => g.id !== action.payload) };

        case "ALLOCATE_TO_GOAL":
            return {
                ...state,
                goals: state.goals.map((g) =>
                    g.id === action.payload.goalId
                        ? { ...g, currentAmount: Math.min(g.currentAmount + action.payload.amount, g.targetAmount) }
                        : g
                ),
            };

        case "START_CHALLENGE":
            return {
                ...state,
                challenges: state.challenges.map((c) =>
                    c.id === action.payload
                        ? { ...c, status: "active", startedAt: new Date().toISOString() }
                        : c
                ),
            };

        case "COMPLETE_CHALLENGE": {
            const pts = state.challenges.find((c) => c.id === action.payload.id)?.points ?? 0;
            const earned = action.payload.halfPoints ? Math.floor(pts / 2) : pts;
            return {
                ...state,
                challenges: state.challenges.map((c) =>
                    c.id === action.payload.id
                        ? { ...c, status: "completed", completedAt: new Date().toISOString() }
                        : c
                ),
                profile: { ...state.profile, points: state.profile.points + earned },
            };
        }

        case "FAIL_CHALLENGE":
            return {
                ...state,
                challenges: state.challenges.map((c) =>
                    c.id === action.payload ? { ...c, status: "failed" } : c
                ),
            };

        case "USE_CHALLENGE_COIN_TOSS":
            return {
                ...state,
                challenges: state.challenges.map((c) =>
                    c.id === action.payload ? { ...c, coinTossUsed: true } : c
                ),
            };

        case "RESOLVE_SCENARIO":
            return {
                ...state,
                scenarios: state.scenarios.map((s) =>
                    s.id === action.payload.id
                        ? { ...s, status: "resolved", chosenOptionId: action.payload.choiceId, resolvedAt: new Date().toISOString() }
                        : s
                ),
            };

        case "EARN_BADGE":
            return {
                ...state,
                badges: state.badges.map((b) =>
                    b.id === action.payload && !b.earnedAt ? { ...b, earnedAt: new Date().toISOString() } : b
                ),
            };

        case "UPDATE_PROFILE":
            return { ...state, profile: { ...state.profile, ...action.payload } };

        case "ADD_POINTS":
            return { ...state, profile: { ...state.profile, points: state.profile.points + action.payload } };

        case "SET_GOAL_COIN_TOSS_USED":
            return {
                ...state,
                goals: state.goals.map((g) =>
                    g.id === action.payload.goalId
                        ? { ...g, coinTossUsed: true, coinTossAvailableAt: action.payload.availableAt }
                        : g
                ),
            };

        default:
            return state;
    }
}



interface FinanceContextValue {
    state: FinanceState;
    dispatch: React.Dispatch<Action>;
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
    totalInvestments: number;
    recentTransactions: Transaction[];
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

const STORAGE_KEY = "flipit_finance_state";

export function FinanceProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);


    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
            if (raw) {
                try {
                    const saved = JSON.parse(raw);
                    dispatch({ type: "LOAD_STATE", payload: saved });
                } catch {
                    dispatch({ type: "LOAD_STATE", payload: {} });
                }
            } else {
                dispatch({ type: "LOAD_STATE", payload: {} });
            }
        });
    }, []);


    useEffect(() => {
        if (!state.isLoaded) return;
        const { isLoaded: _, ...toSave } = state;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }, [state]);


    const totalIncome = state.transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = state.transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalSavings = state.transactions
        .filter((t) => t.type === "savings")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalInvestments = state.transactions
        .filter((t) => t.type === "investment")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpenses;

    const recentTransactions = state.transactions.slice(0, 10);

    return (
        <FinanceContext.Provider
            value={{
                state,
                dispatch,
                totalBalance,
                totalIncome,
                totalExpenses,
                totalSavings,
                totalInvestments,
                recentTransactions,
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
}

export function useFinance() {
    const ctx = useContext(FinanceContext);
    if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
    return ctx;
}
