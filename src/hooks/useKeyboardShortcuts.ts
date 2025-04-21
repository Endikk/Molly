import { useEffect } from 'react';

type KeyCombination = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
};

type ShortcutHandler = () => void;

type ShortcutConfig = {
  [key: string]: {
    handler: ShortcutHandler;
    description: string;
  };
};

const combineKeys = (combo: KeyCombination): string => {
  let result = '';
  if (combo.ctrl) result += 'ctrl+';
  if (combo.alt) result += 'alt+';
  if (combo.shift) result += 'shift+';
  result += combo.key.toLowerCase();
  return result;
};

/**
 * Hook pour gérer les raccourcis clavier
 */
export function useKeyboardShortcuts(shortcuts: Record<string, ShortcutConfig>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, altKey, shiftKey } = event;
      
      // Ne pas déclencher de raccourcis dans les zones de texte
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      const combo = combineKeys({
        key,
        ctrl: ctrlKey,
        alt: altKey,
        shift: shiftKey
      });
      
      // Vérifier tous les groupes de raccourcis
      Object.values(shortcuts).forEach(group => {
        // Vérifier si ce raccourci existe dans ce groupe
        Object.entries(group).forEach(([shortcutKey, { handler }]) => {
          if (shortcutKey === combo) {
            event.preventDefault();
            handler();
          }
        });
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

/**
 * Retourne une description formatée des raccourcis clavier disponibles
 */
export function getShortcutDescriptions(shortcuts: Record<string, ShortcutConfig>): Record<string, string[]> {
  const descriptions: Record<string, string[]> = {};
  
  Object.entries(shortcuts).forEach(([groupName, group]) => {
    descriptions[groupName] = [];
    
    Object.entries(group).forEach(([shortcut, { description }]) => {
      const formattedShortcut = shortcut
        .split('+')
        .map(key => key.charAt(0).toUpperCase() + key.slice(1))
        .join(' + ');
      
      descriptions[groupName].push(`${formattedShortcut}: ${description}`);
    });
  });
  
  return descriptions;
}
