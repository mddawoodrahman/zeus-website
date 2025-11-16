/**
 * API Key Setup Dialog Component
 *
 * Provides a secure interface for users to configure their OpenAI API key.
 * Features:
 * - Masked input for security
 * - API key validation
 * - Clear instructions and help
 * - Visual feedback on success/error
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Key,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import {
  setOpenAIKey,
  testAPIKey,
  getStoredAPIKey,
  clearOpenAIKey,
} from "@/lib/openai";
import { toast } from "sonner";

interface ApiKeySetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ApiKeySetupDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: ApiKeySetupDialogProps) => {
  const [apiKey, setApiKey] = useState("");
  const [testing, setTesting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const existingKey = getStoredAPIKey();

  const handleSave = async () => {
    setError(null);
    setSuccess(false);

    // Validate input
    if (!apiKey.trim()) {
      setError("Please enter an API key");
      return;
    }

    if (!apiKey.startsWith("sk-")) {
      setError("Invalid API key format. OpenAI API keys start with 'sk-'");
      return;
    }

    setTesting(true);

    try {
      // Store the key temporarily
      setOpenAIKey(apiKey);

      // Test the key
      const isValid = await testAPIKey();

      if (!isValid) {
        setError("Invalid API key. Please check and try again.");
        clearOpenAIKey();
        return;
      }

      // Success!
      setSuccess(true);
      toast.success("API key saved successfully!");

      // Close dialog after short delay
      setTimeout(() => {
        onOpenChange(false);
        onSuccess?.();
      }, 1500);
    } catch (err) {
      console.error("Error saving API key:", err);
      setError(
        err instanceof Error ? err.message : "Failed to validate API key",
      );
      clearOpenAIKey();
    } finally {
      setTesting(false);
    }
  };

  const handleRemove = () => {
    clearOpenAIKey();
    setApiKey("");
    setSuccess(false);
    setError(null);
    toast.success("API key removed");
    onOpenChange(false);
  };

  const handleClose = () => {
    setApiKey("");
    setError(null);
    setSuccess(false);
    setShowKey(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            OpenAI API Configuration
          </DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to enable AI-powered text enhancement
            features. Your key is stored locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError(null);
                  setSuccess(false);
                }}
                className="pr-10"
                disabled={testing || success}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
                disabled={testing || success}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {existingKey && !apiKey && (
              <p className="text-xs text-muted-foreground">
                ✓ API key is already configured
              </p>
            )}
          </div>

          {/* Status Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700 dark:text-green-400">
                API key validated and saved successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Help Information */}
          <div className="space-y-3 pt-2">
            <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                How to get your API key:
              </h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside ml-1">
                <li>Visit the OpenAI Platform</li>
                <li>Sign in or create an account</li>
                <li>Navigate to API Keys section</li>
                <li>Create a new API key</li>
                <li>Copy and paste it here</li>
              </ol>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary"
                onClick={() =>
                  window.open("https://platform.openai.com/api-keys", "_blank")
                }
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open OpenAI Platform
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p className="flex items-start gap-1">
                <span className="text-primary">•</span>
                <span>
                  Your API key is stored securely in your browser's local
                  storage
                </span>
              </p>
              <p className="flex items-start gap-1">
                <span className="text-primary">•</span>
                <span>
                  The key is only used to communicate directly with OpenAI
                </span>
              </p>
              <p className="flex items-start gap-1">
                <span className="text-primary">•</span>
                <span>Standard OpenAI API rates apply to your usage</span>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {existingKey && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              disabled={testing}
            >
              Remove Key
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={testing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={testing || success || !apiKey.trim()}
            >
              {testing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {testing ? "Validating..." : success ? "Saved!" : "Save & Test"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
