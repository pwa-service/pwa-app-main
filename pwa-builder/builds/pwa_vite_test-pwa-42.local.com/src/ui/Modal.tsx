import { createPortal } from "react-dom";
import { type ReactNode, useEffect } from "react";
import { useIsMounted } from "../hooks/useIsMounted";
import { classNames } from "../utils/classNames";

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, className, children }: IModalProps) => {
  const { isMounted } = useIsMounted();

  useEffect(() => {
    if (!isMounted) return;

    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
    };
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isMounted]);

  if (!isMounted) return null;

  return createPortal(
    isOpen && (
      <div
        onClick={onClose}
        className="fixed inset-0 flex items-center justify-center bg-black/75 z-[50]"
      >
        <div
          key="modal-content"
          onClick={(event) => event.stopPropagation()}
          className={classNames("relative w-full h-full flex", className)}
        >
          {children}
        </div>
      </div>
    ),
    document.body
  );
};

export default Modal;
