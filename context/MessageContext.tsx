import React, { createContext, useContext, useState, useCallback } from 'react';
import MessageModal, { type MessageVariant } from '../components/MessageModal';

export interface ShowMessageOptions {
    variant: MessageVariant;
    title: string;
    message: string;
    buttonLabel?: string;
}

interface MessageContextValue {
    showMessage: (options: ShowMessageOptions) => void;
}

const MessageContext = createContext<MessageContextValue | null>(null);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [variant, setVariant] = useState<MessageVariant>('info');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [buttonLabel, setButtonLabel] = useState<string>('OK');

    const showMessage = useCallback((options: ShowMessageOptions) => {
        setVariant(options.variant);
        setTitle(options.title);
        setMessage(options.message);
        setButtonLabel(options.buttonLabel ?? 'OK');
        setIsOpen(true);
    }, []);

    const hide = useCallback(() => setIsOpen(false), []);

    return (
        <MessageContext.Provider value={{ showMessage }}>
            {children}
            <MessageModal
                isOpen={isOpen}
                onClose={hide}
                variant={variant}
                title={title}
                message={message}
                buttonLabel={buttonLabel}
            />
        </MessageContext.Provider>
    );
};

export function useMessage(): MessageContextValue {
    const ctx = useContext(MessageContext);
    if (!ctx) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return ctx;
}
