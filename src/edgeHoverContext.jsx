import React, { createContext, useContext } from 'react';

const EdgeHoverContext = createContext({ hoveredNodeId: null, setHoveredNodeId: () => {} });

export const EdgeHoverProvider = ({ value, children }) => (
  <EdgeHoverContext.Provider value={value}>{children}</EdgeHoverContext.Provider>
);

export const useEdgeHover = () => useContext(EdgeHoverContext);
