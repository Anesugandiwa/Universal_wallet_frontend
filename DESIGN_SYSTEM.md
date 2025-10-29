# Universal Wallet - Design System

## Color Palette

### Primary Colors
- **Primary Green**: `#058f1f` - Main brand color (headers, primary buttons, accents)
- **Secondary Green**: `#81bf06` - Secondary actions, highlights, badges

### Neutral Colors
- **White**: `#FFFFFF` - Main background
- **Light Gray**: `#F5F5F5` - Card backgrounds, subtle sections
- **Medium Gray**: `#E0E0E0` - Borders, dividers
- **Dark Gray**: `#333333` - Primary text
- **Light Text**: `#666666` - Secondary text, labels

### Status Colors
- **Success**: `#058f1f` - Success states, completed transactions
- **Error**: `#DC2626` - Error states, failed transactions
- **Warning**: `#F59E0B` - Pending states, warnings
- **Info**: `#3B82F6` - Information, links

---

## Typography

### Font Family
- Primary: System fonts (sans-serif)
- `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`

### Font Sizes
- **Heading 1**: 2rem (32px) - Page titles
- **Heading 2**: 1.5rem (24px) - Section titles
- **Heading 3**: 1.25rem (20px) - Card titles
- **Body**: 1rem (16px) - Regular text
- **Small**: 0.875rem (14px) - Labels, captions
- **Tiny**: 0.75rem (12px) - Timestamps, meta info

### Font Weights
- **Bold**: 700 - Headings, important text
- **Semibold**: 600 - Subheadings, labels
- **Regular**: 400 - Body text

---

## Layout Components

### Cards
- **Background**: White (`#FFFFFF`)
- **Border Radius**: 12px - 16px (rounded corners)
- **Shadow**: `0 2px 8px rgba(0, 0, 0, 0.1)`
- **Padding**: 20px - 24px
- **Margin**: 16px between cards

### Navigation
- **Header Background**: `#058f1f` (primary green)
- **Header Text**: White
- **Tab Navigation**: Pill-shaped container with rounded tabs
- **Tab Active State**: Slightly lighter green or white background
- **Tab Border Radius**: 24px (full rounded)

### Buttons

#### Primary Button
- **Background**: `#058f1f`
- **Text**: White
- **Border Radius**: 8px
- **Padding**: 12px 24px
- **Hover**: Darken by 10%

#### Secondary Button (Outlined)
- **Background**: Transparent/White
- **Border**: 1px solid `#058f1f`
- **Text**: `#058f1f`
- **Border Radius**: 8px
- **Padding**: 12px 24px
- **Hover**: Light green background

#### Accent Button
- **Background**: `#81bf06`
- **Text**: White or Dark
- **Border Radius**: 8px
- **Padding**: 12px 24px

---

## Design Patterns (Mobile to Web Adaptation)

### Header
- **Mobile**: Full-width green header with hamburger menu
- **Web**: Sticky top navigation with logo, main nav items, and user profile
- Height: 64px

### Navigation
- **Mobile**: Horizontal scrollable tabs below header
- **Web**:
  - Option 1: Left sidebar (240px) with vertical navigation
  - Option 2: Horizontal tabs below header (adapt from mobile)
  - Recommended: Combination - Top nav + sidebar for sub-navigation

### Main Content Area
- **Mobile**: Full-width cards with 16px horizontal padding
- **Web**:
  - Max-width: 1200px - 1400px (centered)
  - Side padding: 32px - 48px
  - Grid layout for multiple cards (2-3 columns on desktop)

### Cards (Wallet Balances, Transaction Info)
- Maintain rounded corners and shadows
- Stack vertically on mobile
- Side-by-side or grid layout on desktop
- Responsive padding (increase on larger screens)

### Forms & Inputs
- **Border**: 1px solid `#E0E0E0`
- **Border Radius**: 8px
- **Focus**: Border color `#058f1f`, add subtle shadow
- **Padding**: 12px 16px
- **Background**: White

---

## Spacing System

- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **2XL**: 48px

---

## Icons
- Use icon library: Heroicons, Lucide, or similar
- Size: 20px - 24px for inline icons
- Color: Match text color or use primary green for accent icons

---

## Key Mobile → Web Adaptations

1. **Responsive Grid**: Cards stack on mobile, 2-3 columns on tablet/desktop
2. **Navigation**: Convert hamburger menu to sidebar or horizontal nav
3. **Wallet Balance Cards**: Expand to show more detail on larger screens
4. **Transaction Lists**: Add more columns on desktop (hidden on mobile)
5. **Charts**: Larger, more detailed on desktop
6. **Buttons**: Can be wider on desktop, maintain minimum touch target on mobile
7. **Modal/Dialogs**: Center on screen on desktop vs. slide-up on mobile

---

## Component Examples

### Transaction Receipt Card
```
- White card with rounded corners
- Transaction amount: Large, bold, centered
- Transaction type badge: Light background with colored text
- Details: Two-column layout (label: value)
- Action buttons at bottom: Save, Close, Share
```

### Wallet Balance Display
```
- Dark green card (#058f1f)
- White text
- Multi-currency support (ZWG$, US$)
- Rounded corners (16px)
- Sections separated by subtle white dividers
- Display: Balance totals, contributions, withdrawals
```

### Poll/Vote Card
```
- White card with shadow
- Icon on left (colored)
- Title in bold
- Metadata in grid (Poll ID, votes)
- Compact, scannable layout
```

---

## Accessibility
- Maintain WCAG AA contrast ratios
- Minimum touch target: 44x44px
- Focus states visible on all interactive elements
- Semantic HTML
- ARIA labels where needed

---

## Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px
