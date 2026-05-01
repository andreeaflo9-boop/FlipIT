# FlipIT — Design Document

## App Concept
FlipIT is a **casino-themed personal finance manager**. The aesthetic draws from modern casino visuals: rich dark backgrounds, gold accents, red/green for loss/gain, card-like UI elements, and subtle animations that feel premium and exciting — yet the purpose is entirely serious: helping users build financial discipline.

---

## Color Palette

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `background` | `#0D0D0D` | `#0D0D0D` | Deep black (casino floor) |
| `surface` | `#1A1A2E` | `#1A1A2E` | Dark navy card surfaces |
| `primary` | `#C9A84C` | `#C9A84C` | Gold — primary brand accent |
| `foreground` | `#F5F0E8` | `#F5F0E8` | Warm white text |
| `muted` | `#8A8A9A` | `#8A8A9A` | Subdued labels |
| `border` | `#2E2E4A` | `#2E2E4A` | Subtle dark borders |
| `success` | `#2ECC71` | `#2ECC71` | Green — income/gains |
| `error` | `#E74C3C` | `#E74C3C` | Red — expenses/losses |
| `warning` | `#F39C12` | `#F39C12` | Amber — warnings |
| `tint` | `#C9A84C` | `#C9A84C` | Active tab tint |

---

## Screen List

1. **Splash / Onboarding** — Animated logo reveal, tagline
2. **Auth — Login** — Email/password sign-in
3. **Auth — Register** — New account creation
4. **Auth — Forgot Password** — Email reset flow
5. **Home (Tab 1)** — Financial overview dashboard
6. **Budget (Tab 2)** — Income/expense/savings management + pie chart
7. **Scenarios (Tab 3)** — Interactive financial scenario events
8. **Education (Tab 4)** — Financial literacy content
9. **Challenges (Tab 5)** — Financial discipline challenges
10. **Goals** — Financial goal tracking (accessible from Home or nav)
11. **Rewards** — Badges, points, coupons
12. **Settings** — Profile, preferences, dark/light mode
13. **Premium (Royal Flush)** — Subscription upsell screen
14. **Coin Toss Modal** — Animated coin flip overlay

---

## Primary Content & Functionality Per Screen

### Home
- Total balance card (large, prominent)
- Savings & investments summary row
- Income vs. expenses this month
- Recent activity feed (last 5 transactions)
- Active goals with progress bars
- Budget alert banners (e.g., "Overspent on Entertainment by 15%")

### Budget
- Segmented control: Income / Expenses / Savings / Investments
- Add transaction FAB (floating action button)
- Category chips (Food, Transport, Rent, Entertainment, Custom)
- Summary totals row
- Pie chart showing category distribution
- Transaction list with category icons

### Scenarios
- Active scenario card (event description + choices)
- Choice buttons with consequence preview
- Feedback modal after choice
- History of past scenarios

### Education
- Glossary cards (term + definition)
- Tips carousel
- Article-style expandable sections

### Challenges
- Active challenge card with countdown
- Challenge list (available / completed)
- Coin toss option (if premium)
- Points tracker

### Goals
- Goal cards with progress bars
- Add goal FAB
- "I Want It Now" coin toss (premium)
- Allocation modal

### Rewards
- Points balance header
- Badge grid
- Earned and locked achievements
- Progress stats

### Settings
- Profile section
- Dark/Light mode toggle
- Scenario pop-up toggle
- Notification preferences
- Change password
- Premium upgrade CTA

---

## Key User Flows

### Onboarding
App opens → Splash → Login screen → (Register if new) → Home

### Add Expense
Home → Budget tab → Tap "+" FAB → Select category → Enter amount → Confirm → Updated totals + pie chart

### Scenario Event
Notification or pop-up → Scenario modal → Choose response → Feedback → Points awarded

### Goal Progress
Goals tab → Add goal → Set target amount → Allocate from income → Progress bar updates

### Coin Toss (Premium)
Goals tab → Goal card → "I Want It Now" → Confirmation prompt → Coin flip animation → Win/Lose result

### Challenge Coin Toss
Challenges tab → Active challenge → "Use Coin Toss" → Flip → Win: challenge ends + full points / Lose: continue + half points

---

## Navigation Structure

Bottom tab bar with 5 tabs:
1. 🏠 Home
2. 💰 Budget
3. 🎯 Goals
4. 🏆 Challenges
5. ⚙️ More (Settings, Rewards, Education, Scenarios)

Modal screens (presented over tabs):
- Add Transaction
- Scenario Event
- Coin Toss
- Premium Upsell

---

## Typography

- **Headings**: Bold, large (28-32pt), warm white
- **Card titles**: Semibold (18-20pt)
- **Body**: Regular (14-16pt), muted
- **Labels/Captions**: Small (12pt), muted

---

## Visual Style Notes

- Cards use dark navy (`surface`) with gold border accents
- Progress bars: gold fill on dark track
- Income amounts in green, expenses in red
- Tab bar: dark background, gold active icon
- Buttons: gold gradient primary, outlined secondary
- Coin toss: full-screen overlay with 3D flip animation
