import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;


const MAPPING = {

    "house.fill": "home",
    "chart.bar.fill": "bar-chart",
    "target": "track-changes",
    "trophy.fill": "emoji-events",
    "ellipsis": "more-horiz",
    "ellipsis.circle.fill": "more-horiz",
    "play.circle.fill": "play-circle-filled",
    "calendar": "calendar-today",

    "plus.circle.fill": "add-circle",
    "minus.circle.fill": "remove-circle",
    "arrow.up.circle.fill": "arrow-upward",
    "arrow.down.circle.fill": "arrow-downward",
    "dollarsign.circle.fill": "attach-money",
    "creditcard.fill": "credit-card",
    "banknote.fill": "payments",
    "chart.pie.fill": "pie-chart",

    "flag.fill": "flag",
    "star.fill": "star",
    "gift.fill": "card-giftcard",
    "bolt.fill": "bolt",

    "exclamationmark.triangle.fill": "warning",
    "lightbulb.fill": "lightbulb",
    "questionmark.circle.fill": "help",

    "book.fill": "menu-book",
    "graduationcap.fill": "school",
    "doc.text.fill": "description",

    "flame.fill": "local-fire-department",
    "checkmark.seal.fill": "verified",
    "clock.fill": "access-time",

    "rosette": "workspace-premium",
    "ticket.fill": "confirmation-number",
    "crown.fill": "military-tech",

    "gear": "settings",
    "person.fill": "person",
    "bell.fill": "notifications",
    "moon.fill": "dark-mode",
    "sun.max.fill": "light-mode",
    "lock.fill": "lock",
    "shield.fill": "security",
    "arrow.right.circle.fill": "arrow-forward",

    "xmark.circle.fill": "cancel",
    "checkmark.circle.fill": "check-circle",
    "chevron.right": "chevron-right",
    "chevron.left": "chevron-left",
    "chevron.down": "expand-more",
    "chevron.up": "expand-less",
    "paperplane.fill": "send",
    "chevron.left.forwardslash.chevron.right": "code",
    "eye.fill": "visibility",
    "eye.slash.fill": "visibility-off",
    "trash.fill": "delete",
    "pencil": "edit",
    "plus": "add",
    "minus": "remove",
    "info.circle.fill": "info",
    "sparkles": "auto-awesome",
    "coin": "monetization-on",
    "wallet.fill": "account-balance-wallet",
    "chart.line.uptrend.xyaxis": "trending-up",
    "arrow.clockwise": "refresh",
    "bell.badge.fill": "notification-important",
    "person.2.fill": "group",
    "envelope.fill": "email",
    "phone.fill": "phone",
    "globe": "language",
    "heart.fill": "favorite",
    "hand.thumbsup.fill": "thumb-up",
    "hand.thumbsdown.fill": "thumb-down",
} as unknown as IconMapping;

export function IconSymbol({
                               name,
                               size = 24,
                               color,
                               style,
                           }: {
    name: IconSymbolName;
    size?: number;
    color: string | OpaqueColorValue;
    style?: StyleProp<TextStyle>;
    weight?: SymbolWeight;
}) {
    return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
