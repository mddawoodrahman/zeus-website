import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Download,
  Copy,
  Settings,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Zap,
  Save,
  Loader2,
  Key,
  Wand2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { ApiKeySetupDialog } from "@/components/ApiKeySetupDialog";
import {
  createDocument,
  getDocument,
  updateDocument,
  startWritingSession,
  endWritingSession,
  type Document as DocType,
  type WritingSession,
} from "@/lib/database";
import {
  enhanceText,
  analyzeText,
  streamCompletion,
  hasAPIKey,
  type Suggestion,
  type EnhancementType,
} from "@/lib/openai";

const Editor = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get("id");

  const [currentDocument, setCurrentDocument] = useState<DocType | null>(null);
  const [title, setTitle] = useState("Untitled Document");
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<WritingSession | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showApiDialog, setShowApiDialog] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const initialWordCount = useRef(0);
  const initialCharCount = useRef(0);
  const textRef = useRef(text);

  // Check for API key on mount
  useEffect(() => {
    setHasKey(hasAPIKey());
  }, []);

  // Update text ref whenever text changes
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // Load document when ID changes
  useEffect(() => {
    if (documentId && user) {
      const loadDoc = async () => {
        try {
          setLoading(true);
          const doc = await getDocument(documentId);
          setCurrentDocument(doc);
          setTitle(doc.title);
          setText(doc.content);
          initialWordCount.current = doc.word_count;
          initialCharCount.current = doc.character_count;
        } catch (error) {
          console.error("Error loading document:", error);
          toast.error("Failed to load document");
        } finally {
          setLoading(false);
        }
      };
      loadDoc();
    }
  }, [documentId, user]);

  // Start session on mount, end on unmount
  useEffect(() => {
    let currentSession: WritingSession | null = null;

    const initSession = async () => {
      if (!user) return;
      try {
        const newSession = await startWritingSession(
          user.id,
          documentId || undefined,
        );
        currentSession = newSession;
        setSession(newSession);
        initialWordCount.current = textRef.current
          .split(/\s+/)
          .filter(Boolean).length;
        initialCharCount.current = textRef.current.length;
      } catch (error) {
        console.error("Error starting session:", error);
      }
    };

    const cleanupSession = async () => {
      if (!currentSession) return;
      try {
        const currentWordCount = textRef.current
          .split(/\s+/)
          .filter(Boolean).length;
        const currentCharCount = textRef.current.length;
        const wordsWritten = Math.max(
          0,
          currentWordCount - initialWordCount.current,
        );
        const charsTyped = Math.max(
          0,
          currentCharCount - initialCharCount.current,
        );
        const durationSeconds = Math.floor(
          (new Date().getTime() -
            new Date(currentSession.session_start).getTime()) /
            1000,
        );

        await endWritingSession(currentSession.id, {
          words_written: wordsWritten,
          characters_typed: charsTyped,
          duration_seconds: durationSeconds,
          suggestions_applied: 0,
        });
      } catch (error) {
        console.error("Error ending session:", error);
      }
    };

    initSession();
    return () => {
      cleanupSession();
    };
  }, [user, documentId]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!currentDocument || !user) return;

    const interval = setInterval(() => {
      // Silent save
      const autoSave = async () => {
        try {
          setSaving(true);
          await updateDocument(currentDocument.id, { title, content: text });
        } catch (error) {
          console.error("Auto-save failed:", error);
        } finally {
          setSaving(false);
        }
      };
      autoSave();
    }, 30000);

    return () => clearInterval(interval);
  }, [currentDocument, user, title, text]);

  const handleSave = async (silent = false) => {
    if (!user) {
      toast.error("You must be logged in to save");
      return;
    }

    try {
      setSaving(true);

      if (currentDocument) {
        // Update existing document
        const updated = await updateDocument(currentDocument.id, {
          title,
          content: text,
        });
        setCurrentDocument(updated);
        if (!silent) toast.success("Document saved!");
      } else {
        // Create new document
        const newDoc = await createDocument(user.id, title, text);
        setCurrentDocument(newDoc);
        // Update URL with document ID without reloading
        window.history.replaceState({}, "", `/editor?id=${newDoc.id}`);
        if (!silent) toast.success("Document created!");
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Analyzes the current text using OpenAI API
   * Provides grammar, style, tone, and clarity suggestions
   */
  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    if (!hasAPIKey()) {
      toast.error("Please configure your OpenAI API key");
      setShowApiDialog(true);
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeText(text);
      setSuggestions(result);
      toast.success(`Analysis complete! Found ${result.length} suggestions.`);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to analyze text",
      );

      // If it's an API key error, show the dialog
      if (error instanceof Error && error.message.includes("API key")) {
        setShowApiDialog(true);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  /**
   * Enhances text using AI based on selected enhancement type
   */
  const handleEnhance = async (type: EnhancementType) => {
    if (!text.trim()) {
      toast.error("Please enter some text to enhance");
      return;
    }

    if (!hasAPIKey()) {
      toast.error("Please configure your OpenAI API key");
      setShowApiDialog(true);
      return;
    }

    setEnhancing(true);
    const enhanceToast = toast.loading(`Enhancing text (${type})...`);

    try {
      const result = await enhanceText(text, {
        type,
        preserveFormatting: true,
      });

      setText(result.enhanced);
      setSuggestions(result.suggestions);

      toast.success(`Text enhanced! Used ${result.usage.totalTokens} tokens.`, {
        id: enhanceToast,
      });
    } catch (error) {
      console.error("Enhancement error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to enhance text",
        { id: enhanceToast },
      );

      if (error instanceof Error && error.message.includes("API key")) {
        setShowApiDialog(true);
      }
    } finally {
      setEnhancing(false);
    }
  };

  /**
   * Applies a specific suggestion to the text
   */
  const applySuggestion = (suggestion: Suggestion) => {
    if (!suggestion.original || !suggestion.suggestion) {
      toast.error("Cannot apply this suggestion");
      return;
    }

    const newText = text.replace(suggestion.original, suggestion.suggestion);
    setText(newText);

    // Remove applied suggestion
    setSuggestions((prev) => prev.filter((s) => s !== suggestion));
    toast.success("Suggestion applied!");
  };

  /**
   * Dismisses a suggestion
   */
  const dismissSuggestion = (suggestion: Suggestion) => {
    setSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleExport = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = window.document.createElement("a");
    anchor.href = url;
    anchor.download = `${title}.txt`;
    anchor.click();
    toast.success("Document exported!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Header */}
      <Header />

      {/* API Key Setup Dialog */}
      <ApiKeySetupDialog
        open={showApiDialog}
        onOpenChange={setShowApiDialog}
        onSuccess={() => setHasKey(true)}
      />

      {/* Document Toolbar - Below Header */}
      <div className="fixed top-16 left-0 right-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none focus-visible:ring-1 h-8 font-medium bg-transparent"
              placeholder="Document title..."
            />
          </div>

          <div className="flex items-center gap-2">
            {saving && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSave()}
              disabled={saving || !user}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowApiDialog(true)}
            >
              <Key className="h-4 w-4 mr-2" />
              {hasKey ? "API Key ✓" : "API Key"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content  */}
      <div className="container mx-auto px-4 py-6 pt-32">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-semibold">Your Text</h2>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!text || analyzing || enhancing}
                    variant="outline"
                  >
                    {analyzing && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    <Sparkles className="h-4 w-4 mr-2" />
                    {analyzing ? "Analyzing..." : "Analyze"}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        disabled={!text || analyzing || enhancing}
                        className="shadow-glow"
                      >
                        {enhancing && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        <Wand2 className="h-4 w-4 mr-2" />
                        {enhancing ? "Enhancing..." : "Enhance Text"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Enhancement Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleEnhance("grammar")}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Fix Grammar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEnhance("clarity")}
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Improve Clarity
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEnhance("professional")}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Make Professional
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEnhance("casual")}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Make Casual
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEnhance("concise")}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Make Concise
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEnhance("expand")}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Expand Text
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEnhance("creative")}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Make Creative
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Textarea
                placeholder="Start writing or paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[500px] text-base leading-relaxed resize-none focus-visible:ring-2 focus-visible:ring-primary"
              />

              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>{text.length} characters</span>
                  <span>{text.split(/\s+/).filter(Boolean).length} words</span>
                </div>
                {text && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Ready to analyze
                  </Badge>
                )}
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Grammar</span>
                </div>
                <p className="text-2xl font-bold">98%</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span className="text-sm font-medium">Clarity</span>
                </div>
                <p className="text-2xl font-bold">92%</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Tone</span>
                </div>
                <p className="text-2xl font-bold">Professional</p>
              </Card>
            </div>
          </div>

          {/* Suggestions Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-32">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Suggestions
                </h3>
                {suggestions.length > 0 && (
                  <Badge variant="secondary">{suggestions.length}</Badge>
                )}
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        {suggestion.severity === "error" && (
                          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        )}
                        {suggestion.severity === "warning" && (
                          <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        )}
                        {suggestion.severity === "info" && (
                          <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium mb-1 capitalize">
                            {suggestion.type}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {suggestion.message}
                          </p>
                          {suggestion.original && suggestion.suggestion && (
                            <div className="space-y-1 text-xs">
                              <div className="p-2 bg-destructive/10 rounded border border-destructive/20">
                                <span className="font-medium text-destructive">
                                  Original:{" "}
                                </span>
                                <span className="text-muted-foreground">
                                  {suggestion.original}
                                </span>
                              </div>
                              <div className="p-2 bg-green-500/10 rounded border border-green-500/20">
                                <span className="font-medium text-green-600 dark:text-green-400">
                                  Suggested:{" "}
                                </span>
                                <span className="text-muted-foreground">
                                  {suggestion.suggestion}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {suggestion.original && suggestion.suggestion && (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-xs"
                            onClick={() => applySuggestion(suggestion)}
                          >
                            Apply
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => dismissSuggestion(suggestion)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))
                ) : text ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground mb-2">
                      No suggestions yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click "Analyze" to get AI-powered suggestions
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">
                      Start typing to see suggestions
                    </p>
                  </div>
                )}
              </div>

              {!hasKey && (
                <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1 text-yellow-700 dark:text-yellow-300">
                        API Key Required
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Configure your OpenAI API key to enable AI features
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setShowApiDialog(true)}
                      >
                        <Key className="h-3 w-3 mr-1" />
                        Setup API Key
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {text && hasKey && (
                <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium mb-1">Pro Tip</p>
                      <p className="text-xs text-muted-foreground">
                        Use "Enhance Text" for different styles: professional,
                        casual, concise, or creative.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
