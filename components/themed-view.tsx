import { View, type ViewProps } from "react-native";

import { cn } from "@/lib/utils";
export function ThemedView({ className, ...otherProps }: ThemedViewProps) {
    return <View className={cn("bg-background", className)} {...otherProps} />;
}