# Modal Sidebar Responsiveness Fix

## Problem

Modals (notifications, messages, and task list) were not responsive to sidebar state changes. When the sidebar was collapsed or expanded, the modals maintained static positioning and did not adjust their layout accordingly.

## Root Cause

The modals were using static responsive padding values that didn't react to the sidebar state:

- Static: `paddingLeft: 'clamp(4rem, 8vw, 16rem)'`
- The sidebar state (`isSidebarCollapsed`) was managed at the App level but not accessible to modals

## Solution

### 1. Created Sidebar Context

- **File**: `client/src/core/context/SidebarContext.tsx`
- Provides global state management for sidebar collapse/expand state
- Allows any component to access and modify sidebar state

### 2. Updated App.tsx

- **File**: `client/src/App.tsx`
- Wrapped application with `SidebarProvider`
- Replaced local sidebar state with context-based state

### 3. Updated Modal Components

Updated the following components to use sidebar context:

#### TaskListModal

- **File**: `client/src/domains/dashboard/components/TaskListModal.tsx`
- Added `useSidebar` hook
- Dynamic padding: `paddingLeft: isSidebarCollapsed ? '5rem' : '17rem'`
- Dynamic width: `maxWidth: isSidebarCollapsed ? 'calc(100vw - 6rem)' : 'calc(100vw - 18rem)'`

#### NotificationModal

- **File**: `client/src/domains/users/components/NotificationModal.tsx`
- Added `useSidebar` hook
- Same dynamic positioning as TaskListModal

#### MessageModal

- **File**: `client/src/domains/users/components/MessageModal.tsx`
- Added `useSidebar` hook
- Same dynamic positioning as other modals

## Implementation Details

### Sidebar State Values

- **Collapsed**: `w-16` (64px) → Modal padding: `5rem` (80px)
- **Expanded**: `w-64` (256px) → Modal padding: `17rem` (272px)

### Dynamic Positioning Logic

```typescript
const { isSidebarCollapsed } = useSidebar();

// Modal container positioning
style={{
  paddingLeft: isSidebarCollapsed ? '5rem' : '17rem',
  maxWidth: isSidebarCollapsed ? 'calc(100vw - 6rem)' : 'calc(100vw - 18rem)'
}}
```

## Result

- ✅ Modals now automatically adjust when sidebar collapses/expands
- ✅ Consistent spacing and positioning across all screen sizes
- ✅ No overlap with sidebar in any state
- ✅ Smooth transitions match sidebar animation timing

## Files Modified

1. `client/src/core/context/SidebarContext.tsx` (new)
2. `client/src/App.tsx`
3. `client/src/domains/dashboard/components/TaskListModal.tsx`
4. `client/src/domains/users/components/NotificationModal.tsx`
5. `client/src/domains/users/components/MessageModal.tsx`
