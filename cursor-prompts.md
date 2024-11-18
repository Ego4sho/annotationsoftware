# Cursor AI Prompting Guide

## Core Rules
- Never modify v0-generated UI code
- Use composition over modification
- Separate UI, logic, and container layers
- Maintain type safety
- Keep business logic in hooks

## Standard Component Structure
```typescript
// 1. Types & Interfaces
interface ComponentProps {
  // Props interface
}

interface ComponentState {
  // State interface
}

// 2. UI Layer (v0 code)
const ComponentUI: React.FC<ComponentProps> = (props) => {
  // Original v0 JSX
};

// 3. Logic Layer
const useComponentLogic = (): ComponentState => {
  // Hooks and business logic
};

// 4. Container Layer
const ComponentContainer = () => {
  const logic = useComponentLogic();
  return <ComponentUI {...logic} />;
};
```

## Cursor Prompts

### Initial Separation
```
Separate this v0 component into UI/logic layers following composition pattern:
1. Create interfaces for props/state
2. Preserve UI layer exactly as generated
3. Move business logic to custom hooks
4. Create container component for composition
```

### Adding Features
```
Add [feature] to component following rules:
1. Define new prop types
2. Add props to UI without modifying markup
3. Implement logic in hooks
4. Connect through container
```

### Type Safety
```
Ensure type safety across layers:
1. Props interface for UI component
2. State interface for hooks
3. Event handler types
4. API response types
```

### Testing UI Changes
```
Verify composition rules:
1. Original v0 JSX unchanged
2. Features added via props
3. Logic isolated in hooks
4. Clean container composition
5. Complete type coverage
```