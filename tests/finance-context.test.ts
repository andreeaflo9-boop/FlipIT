import { describe, it, expect } from "vitest";


type TransactionType = "income" | "expense" | "savings" | "investment";
type Category = "food" | "transport" | "rent" | "entertainment" | "health" | "utilities" | "salary" | "freelance" | "investment" | "savings" | "other";

interface Transaction {
    id: string;
    type: TransactionType;
    category: Category;
    amount: number;
    description: string;
    date: string;
}

interface Goal {
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

interface Challenge {
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

interface UserProfile {
    name: string;
    email: string;
    isPremium: boolean;
    premiumExpiresAt?: string;
    points: number;
    darkMode: boolean;
    scenariosEnabled: boolean;
    notificationsEnabled: boolean;
}

interface FinanceState {
    profile: UserProfile;
    transactions: Transaction[];
    goals: Goal[];
    challenges: Challenge[];
    scenarios: any[];
    badges: any[];
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

const INITIAL_STATE: FinanceState = {
    profile: DEFAULT_PROFILE,
    transactions: [],
    goals: [],
    challenges: [],
    scenarios: [],
    badges: [],
    isLoaded: false,
};

type Action =
    | { type: "LOAD_STATE"; payload: Partial<FinanceState> }
    | { type: "ADD_TRANSACTION"; payload: Transaction }
    | { type: "DELETE_TRANSACTION"; payload: string }
    | { type: "ADD_GOAL"; payload: Goal }
    | { type: "DELETE_GOAL"; payload: string }
    | { type: "ALLOCATE_TO_GOAL"; payload: { goalId: string; amount: number } }
    | { type: "START_CHALLENGE"; payload: string }
    | { type: "COMPLETE_CHALLENGE"; payload: { id: string; halfPoints?: boolean } }
    | { type: "EARN_BADGE"; payload: string }
    | { type: "UPDATE_PROFILE"; payload: Partial<UserProfile> }
    | { type: "ADD_POINTS"; payload: number };

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
                    c.id === action.payload ? { ...c, status: "active" as const, startedAt: new Date().toISOString() } : c
                ),
            };
        case "COMPLETE_CHALLENGE": {
            const pts = state.challenges.find((c) => c.id === action.payload.id)?.points ?? 0;
            const earned = action.payload.halfPoints ? Math.floor(pts / 2) : pts;
            return {
                ...state,
                challenges: state.challenges.map((c) =>
                    c.id === action.payload.id ? { ...c, status: "completed" as const } : c
                ),
                profile: { ...state.profile, points: state.profile.points + earned },
            };
        }
        case "EARN_BADGE":
            return {
                ...state,
                badges: state.badges.map((b: any) =>
                    b.id === action.payload && !b.earnedAt ? { ...b, earnedAt: new Date().toISOString() } : b
                ),
            };
        case "UPDATE_PROFILE":
            return { ...state, profile: { ...state.profile, ...action.payload } };
        case "ADD_POINTS":
            return { ...state, profile: { ...state.profile, points: state.profile.points + action.payload } };
        default:
            return state;
    }
}


const makeTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
    id: "t1",
    type: "income",
    category: "salary",
    amount: 1000,
    description: "Salary",
    date: new Date().toISOString(),
    ...overrides,
});

const makeGoal = (overrides: Partial<Goal> = {}): Goal => ({
    id: "g1",
    name: "Emergency fund",
    targetAmount: 1000,
    currentAmount: 0,
    createdAt: new Date().toISOString(),
    coinTossUsed: false,
    ...overrides,
});

const makeChallenge = (overrides: Partial<Challenge> = {}): Challenge => ({
    id: "c1",
    title: "No entertainment",
    description: "Test",
    durationDays: 7,
    status: "available",
    points: 100,
    coinTossUsed: false,
    ...overrides,
});

describe("FinanceContext Reducer", () => {
    it("LOAD_STATE sets isLoaded to true", () => {
        const next = reducer(INITIAL_STATE, { type: "LOAD_STATE", payload: {} });
        expect(next.isLoaded).toBe(true);
    });

    it("ADD_TRANSACTION prepends transaction to list", () => {
        const tx = makeTransaction();
        const next = reducer(INITIAL_STATE, { type: "ADD_TRANSACTION", payload: tx });
        expect(next.transactions).toHaveLength(1);
        expect(next.transactions[0].id).toBe("t1");
    });

    it("ADD_TRANSACTION prepends (newest first)", () => {
        const tx1 = makeTransaction({ id: "t1" });
        const tx2 = makeTransaction({ id: "t2" });
        let state = reducer(INITIAL_STATE, { type: "ADD_TRANSACTION", payload: tx1 });
        state = reducer(state, { type: "ADD_TRANSACTION", payload: tx2 });
        expect(state.transactions[0].id).toBe("t2");
    });

    it("DELETE_TRANSACTION removes by id", () => {
        const tx = makeTransaction();
        let state = reducer(INITIAL_STATE, { type: "ADD_TRANSACTION", payload: tx });
        state = reducer(state, { type: "DELETE_TRANSACTION", payload: "t1" });
        expect(state.transactions).toHaveLength(0);
    });

    it("ADD_GOAL adds goal to list", () => {
        const goal = makeGoal();
        const next = reducer(INITIAL_STATE, { type: "ADD_GOAL", payload: goal });
        expect(next.goals).toHaveLength(1);
        expect(next.goals[0].name).toBe("Emergency fund");
    });

    it("DELETE_GOAL removes goal by id", () => {
        const goal = makeGoal();
        let state = reducer(INITIAL_STATE, { type: "ADD_GOAL", payload: goal });
        state = reducer(state, { type: "DELETE_GOAL", payload: "g1" });
        expect(state.goals).toHaveLength(0);
    });

    it("ALLOCATE_TO_GOAL increases currentAmount", () => {
        const goal = makeGoal({ targetAmount: 1000, currentAmount: 0 });
        let state = reducer(INITIAL_STATE, { type: "ADD_GOAL", payload: goal });
        state = reducer(state, { type: "ALLOCATE_TO_GOAL", payload: { goalId: "g1", amount: 300 } });
        expect(state.goals[0].currentAmount).toBe(300);
    });

    it("ALLOCATE_TO_GOAL does not exceed targetAmount", () => {
        const goal = makeGoal({ targetAmount: 500, currentAmount: 400 });
        let state = reducer(INITIAL_STATE, { type: "ADD_GOAL", payload: goal });
        state = reducer(state, { type: "ALLOCATE_TO_GOAL", payload: { goalId: "g1", amount: 300 } });
        expect(state.goals[0].currentAmount).toBe(500);
    });

    it("START_CHALLENGE sets status to active", () => {
        const challenge = makeChallenge();
        let state = { ...INITIAL_STATE, challenges: [challenge] };
        state = reducer(state, { type: "START_CHALLENGE", payload: "c1" });
        expect(state.challenges[0].status).toBe("active");
        expect(state.challenges[0].startedAt).toBeDefined();
    });

    it("COMPLETE_CHALLENGE awards full points", () => {
        const challenge = makeChallenge({ status: "active", points: 100 });
        let state = { ...INITIAL_STATE, challenges: [challenge] };
        state = reducer(state, { type: "COMPLETE_CHALLENGE", payload: { id: "c1" } });
        expect(state.challenges[0].status).toBe("completed");
        expect(state.profile.points).toBe(100);
    });

    it("COMPLETE_CHALLENGE with halfPoints awards half", () => {
        const challenge = makeChallenge({ status: "active", points: 100 });
        let state = { ...INITIAL_STATE, challenges: [challenge] };
        state = reducer(state, { type: "COMPLETE_CHALLENGE", payload: { id: "c1", halfPoints: true } });
        expect(state.profile.points).toBe(50);
    });

    it("ADD_POINTS increases profile points", () => {
        const next = reducer(INITIAL_STATE, { type: "ADD_POINTS", payload: 25 });
        expect(next.profile.points).toBe(25);
    });

    it("UPDATE_PROFILE updates specific fields", () => {
        const next = reducer(INITIAL_STATE, { type: "UPDATE_PROFILE", payload: { isPremium: true } });
        expect(next.profile.isPremium).toBe(true);
        expect(next.profile.name).toBe("Player");
    });

    it("EARN_BADGE sets earnedAt on matching badge", () => {
        const badge = { id: "b1", name: "First Step", description: "Test", icon: "star.fill" };
        let state = { ...INITIAL_STATE, badges: [badge] };
        state = reducer(state, { type: "EARN_BADGE", payload: "b1" });
        expect((state.badges[0] as any).earnedAt).toBeDefined();
    });

    it("EARN_BADGE does not re-earn already earned badge", () => {
        const badge = { id: "b1", name: "First Step", description: "Test", icon: "star.fill", earnedAt: "2024-01-01" };
        let state = { ...INITIAL_STATE, badges: [badge] };
        state = reducer(state, { type: "EARN_BADGE", payload: "b1" });
        expect((state.badges[0] as any).earnedAt).toBe("2024-01-01");
    });
});
