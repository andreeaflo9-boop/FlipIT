import { View, type ViewProps } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";
export interface ScreenContainerProps extends ViewProps {
    edges?: Edge[];
    className?: string;
    containerClassName?: string;
    safeAreaClassName?: string;
}