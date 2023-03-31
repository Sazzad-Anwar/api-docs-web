import { useRef, KeyboardEvent, FocusEvent, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

type ModalType = {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    children: ReactNode;
};

export default function Modal({ isOpen, onClose, className, children }: ModalType) {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            debugger;
            onClose();
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Escape') {
            debugger;
            onClose();
        }
    };

    useEffect(() => {
        modalRef?.current?.focus();
    }, []);

    return createPortal(
        <div
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            className={`${isOpen ? '' : 'hidden'} fixed z-10 inset-0 overflow-y-auto`}
        >
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md"></div>
                </div>
                <div
                    className={
                        'rounded-lg overflow-auto shadow-xl transform transition-all min-w-lg mx-auto ' +
                        className
                    }
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                    ref={modalRef}
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body,
    );
}
