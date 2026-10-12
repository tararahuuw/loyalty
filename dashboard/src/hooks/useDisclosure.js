import { useCallback, useState } from "react";

/**
 * Handles open and close any openable container
 * @param {boolean} initial
 * @returns {boolean} isOpen
 * @returns {Function} open - setIsOpen = true
 * @returns {Fuction} close - setIsOpen = false
 * @returns {Fuction} toggle - setIsOpen = !isOpen
 */
export const useDisclosure = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((state) => !state), []);

  return { isOpen, open, close, toggle };
};
