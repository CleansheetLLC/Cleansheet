// Lexical Bundle - All rich text editing features
// This file bundles Lexical for browser use without requiring npm/bundler

// Core Lexical
import {
  createEditor,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  CLEAR_EDITOR_COMMAND,
  KEY_ENTER_COMMAND,
} from 'lexical';

// Rich Text
import {
  $createHeadingNode,
  $createQuoteNode,
  registerRichText,
  HeadingNode,
  QuoteNode,
} from '@lexical/rich-text';

// Code
import {
  $createCodeNode,
  CodeNode,
  CodeHighlightNode,
  registerCodeHighlighting,
} from '@lexical/code';

// Link
import {
  $createLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
  LinkNode,
} from '@lexical/link';

// List
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  ListNode,
  ListItemNode,
} from '@lexical/list';

// Table
import {
  TableNode,
  TableCellNode,
  TableRowNode,
  $createTableNode,
  $createTableRowNode,
  $createTableCellNode,
  INSERT_TABLE_COMMAND,
} from '@lexical/table';

// History
import {
  registerHistory,
  createEmptyHistoryState,
} from '@lexical/history';

// Selection utilities
import {
  $setBlocksType,
} from '@lexical/selection';

// Export everything as a global CleansheetLexical object
const CleansheetLexical = {
  // Core
  createEditor,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,

  // Commands
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  CLEAR_EDITOR_COMMAND,
  KEY_ENTER_COMMAND,

  // Rich Text
  $createHeadingNode,
  $createQuoteNode,
  $setBlocksType,
  registerRichText,
  HeadingNode,
  QuoteNode,

  // Code
  $createCodeNode,
  CodeNode,
  CodeHighlightNode,
  registerCodeHighlighting,

  // Link
  $createLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
  LinkNode,

  // List
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  ListNode,
  ListItemNode,

  // Table
  TableNode,
  TableCellNode,
  TableRowNode,
  $createTableNode,
  $createTableRowNode,
  $createTableCellNode,
  INSERT_TABLE_COMMAND,

  // History
  registerHistory,
  createEmptyHistoryState,

  // Selection
  $setBlocksType,
};

// Make it globally available
if (typeof window !== 'undefined') {
  window.CleansheetLexical = CleansheetLexical;
}

export default CleansheetLexical;
