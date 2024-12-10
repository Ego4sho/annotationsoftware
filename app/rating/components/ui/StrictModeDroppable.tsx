import { useEffect, useState } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

type StrictModeDroppableProps = Omit<DroppableProps, 'children'> & {
  children: (provided: any) => React.ReactNode;
};

export const StrictModeDroppable = ({ children, ...props }: StrictModeDroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Using Promise to ensure we're in the next tick
    Promise.resolve().then(() => {
      setEnabled(true);
    });

    return () => {
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable {...props}>
      {(provided, snapshot) => children(provided, snapshot)}
    </Droppable>
  );
}; 