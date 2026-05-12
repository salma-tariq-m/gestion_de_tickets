import PropTypes from 'prop-types';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, List, ListOrdered, Link2, Undo2, Redo2,
} from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Barre d'outils de l'éditeur.
 */
function Toolbar({ editor }) {
  if (!editor) return null;

  const btn = (action, Icon, title, isActive = false) => (
    <button
      type="button"
      title={title}
      onClick={action}
      className={cn(
        'p-1.5 rounded hover:bg-gray-200 transition-colors',
        isActive && 'bg-indigo-100 text-indigo-700'
      )}
    >
      <Icon size={14} />
    </button>
  );

  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-200 flex-wrap bg-gray-50 rounded-t-md">
      {btn(() => editor.chain().focus().toggleBold().run(), Bold, 'Gras', editor.isActive('bold'))}
      {btn(() => editor.chain().focus().toggleItalic().run(), Italic, 'Italique', editor.isActive('italic'))}
      <span className="w-px h-4 bg-gray-300 mx-1" />
      {btn(() => editor.chain().focus().toggleBulletList().run(), List, 'Liste à puces', editor.isActive('bulletList'))}
      {btn(() => editor.chain().focus().toggleOrderedList().run(), ListOrdered, 'Liste numérotée', editor.isActive('orderedList'))}
      <span className="w-px h-4 bg-gray-300 mx-1" />
      {btn(
        () => {
          const url = window.prompt('URL du lien');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        },
        Link2,
        'Insérer un lien',
        editor.isActive('link')
      )}
      <span className="w-px h-4 bg-gray-300 mx-1 ml-auto" />
      {btn(() => editor.chain().focus().undo().run(), Undo2, 'Annuler')}
      {btn(() => editor.chain().focus().redo().run(), Redo2, 'Rétablir')}
    </div>
  );
}

/**
 * Éditeur de texte riche basé sur TipTap.
 * @param {{ value?: string, onChange?: (html: string) => void, placeholder?: string, error?: string, label?: string }} props
 */
export function RichEditor({ value = '', onChange, placeholder = 'Écrivez ici…', error, label }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div
        className={cn(
          'rounded-md border bg-white overflow-hidden transition-colors',
          'focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent',
          error ? 'border-red-400' : 'border-gray-300'
        )}
      >
        <Toolbar editor={editor} />
        <EditorContent editor={editor} className="tiptap-editor" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

RichEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string,
};

export default RichEditor;
