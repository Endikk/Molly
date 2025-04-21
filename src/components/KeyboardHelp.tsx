import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { getShortcutDescriptions } from "@/hooks/useKeyboardShortcuts";

interface KeyboardHelpProps {
  shortcuts: Record<string, any>;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function KeyboardHelp({ shortcuts, isOpen: externalIsOpen, onClose }: KeyboardHelpProps) {
  // État interne si aucun état externe n'est fourni
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const { isDark } = useTheme();
  
  // Détermine si le composant est ouvert (contrôlé ou non contrôlé)
  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  
  // Gestionnaire de fermeture
  const handleClose = () => {
    if (isControlled) {
      onClose && onClose();
    } else {
      setInternalIsOpen(false);
    }
  };
  
  const shortcutDescriptions = getShortcutDescriptions(shortcuts);
  
  return (
    <>
      {/* Affiche le bouton seulement si non contrôlé */}
      {!isControlled && (
        <button
          className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-blue-600 dark:bg-blue-800 text-white shadow-lg hover:bg-blue-700 transition-all"
          onClick={() => setInternalIsOpen(true)}
          aria-label="Aide clavier"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-5 h-5"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" 
            />
          </svg>
        </button>
      )}
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Raccourcis clavier</h2>
              <button 
                onClick={handleClose}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {Object.entries(shortcutDescriptions).map(([groupName, descriptions]) => (
              <div key={groupName} className="mb-6">
                <h3 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">{groupName}</h3>
                <ul className="space-y-2">
                  {descriptions.map((desc, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Appuyez sur <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">?</kbd> à tout moment pour afficher cette aide.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
