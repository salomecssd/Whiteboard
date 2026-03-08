# Whiteboard Notes - Project Overview

An interactive, minimalist "Whiteboard" web application inspired by Notion and sticky note boards. It allows users to create, drag, resize, and format notes on a large canvas.

## Tech Stack
- **Frontend:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4 (with `@tailwindcss/postcss`)
- **Icons:** Lucide-React
- **Utilities:** `react-draggable` (for D&D), `uuid` (for unique IDs)
- **Persistence:** LocalStorage

## Project Structure
- `src/App.jsx`: Main application logic, state management (notes array), and canvas rendering.
- `src/components/StickyNote.jsx`: Individual note component handling drag-and-drop, rich-text editing via `contentEditable`, resizing, and color customization.
- `src/index.css`: Global styles including Tailwind v4 imports.
- `postcss.config.js`: Configuration for Tailwind v4 and Autoprefixer.

## Key Features
- **Interactive Canvas:** Infinite-feel background with a subtle grid.
- **Draggable Notes:** Notes can be moved freely using a drag handle (visible on hover).
- **Rich Text Editing:** Supports H1, H2, Bold, and Unordered Lists inside notes using `document.execCommand`.
- **Customization:**
    - **Background Colors:** Pastel palette (Blue, Pink, Yellow, Green, Purple, White).
    - **Text Colors:** Matching pastel palette for text formatting.
- **Image Support:** Insert images via URL directly into notes.
- **Auto-save:** State is automatically synchronized with `localStorage` under the key `whiteboard-notes`.

## Development Commands
- **Start Dev Server:** `npm run dev` (usually at http://localhost:5173)
- **Production Build:** `npm run build`
- **Preview Build:** `npm run preview`

## Conventions & Implementation Details
- **Editing:** Uses `contentEditable`. To maintain focus while clicking toolbar buttons, `onMouseDown` with `e.preventDefault()` is used instead of `onClick`.
- **Styling Notes:** Note-specific styles for H1/H2/UL are injected via an inline `<style>` tag within the `StickyNote` component to override Tailwind's CSS reset.
- **Drag & Drop:** `react-draggable` is used with a `nodeRef` for compatibility with React 18+ Strict Mode.
- **Persistence:** Initial state in `App.jsx` is lazily loaded from `localStorage`.

## TODO / Future Improvements
- [ ] Add ability to connect notes with arrows/lines.
- [ ] Implement a "Clear All" board button.
- [ ] Add support for local image uploads (Base64 or Blob storage).
- [ ] Implement a "Bring to Front" logic when a note is clicked.
