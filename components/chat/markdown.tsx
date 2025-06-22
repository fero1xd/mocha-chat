import { Check, Copy } from "lucide-react";
import { marked } from "marked";
import type { ComponentProps } from "react";
import { memo, useMemo, useState } from "react";
import type { ExtraProps } from "react-markdown";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import ShikiHighlighter, {
  createHighlighterCore,
  createOnigurumaEngine,
} from "react-shiki/core";
import { cn } from "@/lib/utils";

const highlighter = await createHighlighterCore({
  themes: [import("@shikijs/themes/kanagawa-dragon")],
  langs: [import("@shikijs/langs/typescript")],
  engine: createOnigurumaEngine(import("shiki/wasm")),
});

type CodeComponentProps = ComponentProps<"code"> & ExtraProps;
type MarkdownSize = "default" | "small";

const components: Components = {
  code: CodeBlock as Components["code"],
  pre: ({ children }) => <>{children}</>,
};

function CodeBlock({ children, className, ...props }: CodeComponentProps) {
  const match = /language-(\w+)/.exec(className || "");

  if (match) {
    const lang = match[1];
    return (
      <div className="rounded-none py-4">
        <Codebar lang={lang} codeString={String(children)} />
        <ShikiHighlighter
          highlighter={highlighter}
          language="typescript"
          theme={"kanagawa-dragon"}
          className="text-sm font-mono rounded-full"
          showLanguage={false}
        >
          {String(children)}
        </ShikiHighlighter>
      </div>
    );
  }

  const inlineCodeClasses =
    "mx-0.5 overflow-auto rounded-md bg-secondary/50 px-2 py-1 group-[:is(pre)]:flex group-[:is(pre)]:w-full font-mono font-medium";

  return (
    <code className={inlineCodeClasses} {...props}>
      {String(children).replace(/`/g, "")}
    </code>
  );
}

function Codebar({ lang, codeString }: { lang: string; codeString: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy code to clipboard:", error);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-secondary text-foreground rounded-t-md">
      <span className="text-sm font-mono">{lang}</span>
      <button onClick={copyToClipboard} className="text-sm cursor-pointer">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

function PureMarkdownRendererBlock({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, [remarkMath]]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}

const MarkdownRendererBlock = memo(
  PureMarkdownRendererBlock,
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  }
);

MarkdownRendererBlock.displayName = "MarkdownRendererBlock";

const MemoizedMarkdown = memo(
  ({ content, id }: { content: string; id: string; size?: MarkdownSize }) => {
    const blocks = useMemo(() => parseMarkdownIntoBlocks(content), [content]);

    const proseClasses =
      "prose max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0 prose-code:before:content-none prose-code:after:content-none";

    return (
      <div
        className={cn(proseClasses, "whitespace-pre-line marker:text-white")}
      >
        {blocks.map((block, index) => (
          <MarkdownRendererBlock content={block} key={`${id}-block-${index}`} />
        ))}
      </div>
    );
  }
);

MemoizedMarkdown.displayName = "MemoizedMarkdown";

export default MemoizedMarkdown;
