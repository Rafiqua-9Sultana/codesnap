import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import { useRef, useState } from "react";

import {
  Code2,
  Download,
  Copy,
  Check,
  Sparkles,
  Palette,
  ChevronDown,
  Image,
  Settings2,
  Terminal,
  GitBranch,
} from "lucide-react";

import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { monokai } from "@uiw/codemirror-theme-monokai";
import { githubLight } from "@uiw/codemirror-theme-github";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";

import { toBlob, toPng } from "html-to-image";

import "./App.css";

function App() {
  const [code, setCode] = useState(
`def greet(name):
    message = f"Hello, {name}!"
    print(message)

greet("Developer")`
  );

  const [theme, setTheme] = useState("Dracula");
  const [language, setLanguage] = useState("Python");
  const [background, setBackground] = useState("purple");
  const [fontSize, setFontSize] = useState(14);
  const [padding, setPadding] = useState(45);
  const [borderRadius, setBorderRadius] = useState(12);
  const [shadow, setShadow] = useState(20);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Copy code
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Unable to copy code.");
    }
  };

  // Language support
  const getLanguageExtension = () => {
    switch (language) {
      case "Python":
        return python();

      case "JavaScript":
        return javascript();

      case "TypeScript":
        return javascript({ typescript: true });

      case "Java":
        return java();

      case "HTML":
        return html();

      case "CSS":
        return css();

      default:
        return javascript();
    }
  };

  // Download PNG
  const downloadImage = async () => {
    if (!previewRef.current) return;

    try {
      setExporting(true);

      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");

      link.download = "codesnap.png";
      link.href = dataUrl;

      link.click();
    } catch (error) {
      console.error("Image export failed:", error);
      alert("Unable to export image. Please try again.");
    } finally {
      setExporting(false);
    }
  };
const copyImage = async () => {
  if (!previewRef.current) return;

  try {
    setExporting(true);

    const blob = await toBlob(previewRef.current, {
      cacheBust: true,
      pixelRatio: 2,
    });

    if (!blob) {
      throw new Error("Unable to generate image.");
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);

    alert("Image copied to clipboard!");
  } catch (error) {
    console.error("Image copy failed:", error);
    alert("Unable to copy image. Please try again.");
  } finally {
    setExporting(false);
  }
};
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <div className="logo">
          <div className="logo-icon">
            <Code2 size={22} />
          </div>

          <span>
            Code<span className="gradient-text">Snap</span>
          </span>
        </div>

        <div className="nav-links">
          <a href="#editor">Editor</a>
          <a href="#features">Features</a>

<a
  href="https://github.com"
  target="_blank"
  rel="noreferrer"
>
  GitHub <GitBranch size={15} />
</a>
        </div>

        <a href="#editor" className="nav-button">
          <Sparkles size={16} />
          Start Creating
        </a>

      </nav>

      {/* Hero */}
      <header className="hero">

        <div className="hero-badge">
          <Sparkles size={14} />
          <span>MADE FOR DEVELOPERS</span>
        </div>

        <h1>
          Turn Your Code
          <br />
          Into <span className="gradient-text">Art.</span>
        </h1>

        <p>
          Beautiful code screenshots, made effortlessly.
          <br />
          Customize, style, and share your code with the world.
        </p>

        <a href="#editor" className="hero-button">
          Create Your First Snap <span>→</span>
        </a>

      </header>

      {/* Main Workspace */}
      <main className="workspace" id="editor">

        <div className="workspace-heading">

          <div>
            <h2>Creative Workspace</h2>
            <p>Design your perfect code screenshot.</p>
          </div>

          <div className="workspace-status">
            <span></span> Live Preview
          </div>

        </div>

        <div className="editor-layout">

          {/* Code Editor */}
          <section className="panel editor-panel">

            <div className="panel-header">

              <div className="panel-title">
                <Terminal size={17} />
                <span>Code Editor</span>
              </div>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option>Python</option>
                <option>JavaScript</option>
                <option>TypeScript</option>
                <option>Java</option>
                <option>HTML</option>
                <option>CSS</option>
              </select>

            </div>

            <CodeMirror
              value={code}
              height="315px"
              theme={
  theme === "Dracula"
    ? dracula
    : theme === "Monokai"
    ? monokai
    : theme === "Midnight"
    ? okaidia
    : githubLight
}
              extensions={[getLanguageExtension()]}
              onChange={(value) => setCode(value)}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                autocompletion: true,
                highlightActiveLine: true,
                bracketMatching: true,
              }}
            />

            <div className="editor-footer">

              <span>{language}</span>

              <button onClick={copyCode}>
                {copied ? (
                  <Check size={15} />
                ) : (
                  <Copy size={15} />
                )}

                {copied ? "Copied!" : "Copy Code"}
              </button>

            </div>

          </section>

          {/* Live Preview */}
          <section className="panel preview-panel">

            <div className="panel-header">

              <div className="panel-title">
                <Image size={17} />
                <span>Live Preview</span>
              </div>

              <span className="preview-label">
                PNG Preview
              </span>

            </div>

     <div
  ref={previewRef}
  className={`preview-background ${background}`}
  style={{ padding: `${padding}px` }}
>

          <div
  className={`code-window ${theme.toLowerCase()}`}
  style={{
  borderRadius: `${borderRadius}px`,
  boxShadow:
    shadow === 0
      ? "none"
      : `0 12px ${shadow}px rgba(0, 0, 0, 0.35)`,
}}
>

                <div className="window-header">

                  <div className="window-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <span>
                    {language.toLowerCase()}-snippet
                  </span>

                  <div className="window-spacer"></div>

      </div>

<div className="font-controls">
  <span>Font Size</span>

  <button
    onClick={() => setFontSize((prev) => Math.max(10, prev - 2))}
    disabled={fontSize <= 10}
  >
    A−
  </button>

  <span>{fontSize}px</span>

  <button
    onClick={() => setFontSize((prev) => Math.min(24, prev + 2))}
    disabled={fontSize >= 24}
  >
    A+
  </button>
</div>

<div className="preview-code">

                  <div className="line-numbers">
                    {code.split("\n").map((_, index) => (
                      <span key={index}>
                        {index + 1}
                      </span>
                    ))}
                  </div>

<pre>
  <code
    style={{ fontSize: `${fontSize}px` }}
    dangerouslySetInnerHTML={{
      __html: Prism.highlight(
        code,
        Prism.languages[
          language === "HTML" ? "markup" : language.toLowerCase()
        ] || Prism.languages.plain,
        language === "HTML" ? "markup" : language.toLowerCase()
      ),
    }}
  />
</pre>

                </div>

                <div className="window-watermark">
                  <Code2 size={14} />
                  CodeSnap
                </div>

              </div>

            </div>

          </section>

        </div>

        {/* Customization */}
        <section className="customization panel">

          <div className="custom-title">
            <Settings2 size={18} />
            <h3>Customize Your Snap</h3>
          </div>

  <div className="custom-grid">

  {/* Theme */}
  <div className="custom-item">

    <label>
      <Palette size={15} />
      Editor Theme
    </label>

    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <option>Dracula</option>
      <option>Monokai</option>
      <option>Midnight</option>
      <option>Light</option>
    </select>

  </div>

  {/* Background */}
  <div className="custom-item">

    <label>
      <Image size={15} />
      Background
    </label>

    <div className="background-options">

      <button
        className="bg-option purple"
        onClick={() => setBackground("purple")}
        aria-label="Purple background"
      />

      <button
        className="bg-option blue"
        onClick={() => setBackground("blue")}
        aria-label="Blue background"
      />

      <button
        className="bg-option pink"
        onClick={() => setBackground("pink")}
        aria-label="Pink background"
      />

      <button
        className="bg-option dark"
        onClick={() => setBackground("dark")}
        aria-label="Dark background"
      />

      <button
        className="bg-option sunset"
        onClick={() => setBackground("sunset")}
        aria-label="Sunset gradient"
      />

      <button
        className="bg-option ocean"
        onClick={() => setBackground("ocean")}
        aria-label="Ocean gradient"
      />

      <button
        className="bg-option aurora"
        onClick={() => setBackground("aurora")}
        aria-label="Aurora gradient"
      />

    </div>

  </div>

  {/* Preview Padding */}
  <div className="padding-controls">

    <label>Preview Padding</label>

    <button
      onClick={() => setPadding((prev) => Math.max(20, prev - 5))}
      disabled={padding <= 20}
    >
      −
    </button>

    <span>{padding}px</span>

    <button
      onClick={() => setPadding((prev) => Math.min(100, prev + 5))}
      disabled={padding >= 100}
    >
      +
    </button>

  </div>

  {/* Border Radius */}
  <div className="radius-controls">

    <label>Border Radius</label>

    <button
      onClick={() => setBorderRadius((prev) => Math.max(0, prev - 2))}
      disabled={borderRadius <= 0}
    >
      −
    </button>

    <span>{borderRadius}px</span>

    <button
      onClick={() => setBorderRadius((prev) => Math.min(32, prev + 2))}
      disabled={borderRadius >= 32}
    >
      +
    </button>

  </div>

  {/* Shadow Intensity */}
  <div className="shadow-controls">

    <label>Shadow Intensity</label>

    <button
      onClick={() => setShadow((prev) => Math.max(0, prev - 5))}
      disabled={shadow <= 0}
    >
      −
    </button>

    <span>{shadow}px</span>

    <button
      onClick={() => setShadow((prev) => Math.min(40, prev + 5))}
      disabled={shadow >= 40}
    >
      +
    </button>

  </div>

  {/* Export */}
  <div className="custom-item">

    <label>
      <Sparkles size={15} />
      Export
    </label>

    <button
      className="export-button"
      onClick={downloadImage}
      disabled={exporting}
    >
      <Download size={16} />

      {exporting ? "Exporting..." : "Download PNG"}

      <ChevronDown size={15} />
    </button>

    <button
      className="export-button"
      onClick={copyImage}
      disabled={exporting}
    >
      {exporting ? "Copying..." : "Copy Image"}
    </button>

  </div>

</div>

</section>

      </main>

      {/* Features */}
      <section className="features" id="features">

        <div className="section-heading">
          <span>WHY CODESNAP?</span>

          <h2>
            Everything you need to showcase code.
          </h2>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <Code2 size={24} />
            <h3>Beautiful Code</h3>
            <p>
              Turn ordinary code snippets into stunning visuals.
            </p>
          </div>

          <div className="feature-card">
            <Palette size={24} />
            <h3>Custom Styling</h3>
            <p>
              Choose themes and backgrounds that match your style.
            </p>
          </div>

          <div className="feature-card">
            <Download size={24} />
            <h3>Easy Export</h3>
            <p>
              Download your creations and share them anywhere.
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer>

        <div className="logo">
          <Code2 size={19} />

          <span>
            Code<span className="gradient-text">Snap</span>
          </span>
        </div>

        <p>Crafted for developers. Built with creativity.</p>

        <span>© 2026 CodeSnap</span>

      </footer>

    </div>
  );
}

export default App;