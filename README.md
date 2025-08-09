# Prompt Library - Firefox Extension

Une extension Firefox minimaliste pour gérer et insérer des prompts dans les interfaces de chat IA.

## Fonctionnalités

- **Gestion de prompts** : Créer, modifier, supprimer et organiser vos prompts
- **Tags** : Organiser vos prompts avec des tags et filtrer par tag
- **Insertion universelle** : Insérer automatiquement dans ChatGPT, Claude, Gemini, Mistral, Grok, Perplexity, DeepSeek et autres
- **Import/Export** : Sauvegarder et partager votre collection de prompts en JSON
- **Fallback clipboard** : Copie automatique si l'insertion DOM échoue

## Installation

### Installation manuelle (développement)

1. Clonez ou téléchargez ce projet
2. Ouvrez Firefox et allez à `about:debugging`
3. Cliquez sur "Ce Firefox" dans le menu de gauche
4. Cliquez sur "Charger un module complémentaire temporaire..."
5. Sélectionnez le fichier `manifest.json` dans le dossier du projet
6. L'extension apparaît dans la barre d'outils Firefox

**Important** : Après installation, rafraîchissez les pages web ouvertes pour que le content script soit chargé.

### Utilisation

1. Cliquez sur l'icône "Prompt Library" dans la barre d'outils
2. Créez vos premiers prompts avec "New Prompt"
3. Organisez avec des tags (séparés par des virgules)
4. Sur une page de chat IA, cliquez sur "Insert" pour insérer le prompt
5. Utilisez le bouton "Debug" pour diagnostiquer les problèmes d'insertion
6. Utilisez Import/Export pour sauvegarder votre collection

### Dépannage

Si l'insertion ne fonctionne pas :

1. **Rafraîchir la page** : Le content script doit être chargé
2. **Utiliser le bouton "Debug"** : Vérifier si un champ d'entrée est détecté
3. **Vérifier les permissions** : L'extension nécessite l'autorisation sur tous les sites
4. **Consulter la console** : Ouvrir les outils développeur (F12) pour voir les erreurs

## Structure des fichiers

```
├── manifest.json          # Configuration de l'extension
├── popup.html             # Interface utilisateur
├── popup.css              # Styles
├── popup.js               # Logique de l'interface
├── storage.js             # Gestion du stockage
├── content.js             # Script d'injection dans les pages
├── browser-polyfill.js    # Compatibilité API Firefox/Chrome
├── background.js          # Script d'arrière-plan
└── README.md              # Documentation
```

## Format des données

Les prompts sont stockés au format JSON :

```json
{
  "id": "prompt_123456789_abc",
  "label": "Titre du prompt",
  "template": "Contenu du prompt",
  "tags": ["tag1", "tag2"]
}
```

## Compatibilité

- Firefox MV3
- Sites supportés par défaut :
  - ChatGPT (chat.openai.com)
  - Claude (claude.ai)
  - Gemini (gemini.google.com)
  - Mistral (chat.mistral.ai)
  - Grok (grok.x.ai)
  - Perplexity (www.perplexity.ai)
  - DeepSeek (chat.deepseek.com)
  - Et tous autres sites avec textarea ou contenteditable

## Permissions

- `activeTab` : Accès à l'onglet actif pour l'insertion
- `storage` : Stockage local des prompts
- `scripting` : Injection de script pour l'insertion DOM
- `clipboardWrite` : Copie de secours si insertion impossible

## Développement

L'extension utilise l'API WebExtensions standard, compatible Firefox MV3. Aucune dépendance externe requise.

Pour modifier les sélecteurs DOM par site, éditez la méthode `getDefaultSelectors()` dans `storage.js`.