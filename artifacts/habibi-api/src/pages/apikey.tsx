import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGenerateApikey, useCheckApikey, getCheckApikeyQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Copy, Key, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const generateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

export function ApikeyPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [generatedKey, setGeneratedKey] = useState<any>(null);
  
  const [checkKeyInput, setCheckKeyInput] = useState("");
  const [activeCheckKey, setActiveCheckKey] = useState("");

  const generateForm = useForm<z.infer<typeof generateSchema>>({
    resolver: zodResolver(generateSchema),
    defaultValues: { name: "", email: "" },
  });

  const { mutate: generateKey, isPending: isGenerating } = useGenerateApikey({
    mutation: {
      onSuccess: (data) => {
        setGeneratedKey(data);
        toast({
          title: "API Key Generated",
          description: "Your key has been created successfully.",
        });
        generateForm.reset();
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to generate API key",
        });
      }
    }
  });

  const { data: keyInfo, isFetching: isChecking, error: checkError } = useCheckApikey(
    { apikey: activeCheckKey },
    { query: { enabled: !!activeCheckKey, retry: false } }
  );

  const onSubmitGenerate = (values: z.infer<typeof generateSchema>) => {
    generateKey({ data: values });
  };

  const handleCheck = () => {
    if (!checkKeyInput) return;
    setActiveCheckKey(checkKeyInput);
    queryClient.invalidateQueries({ queryKey: getCheckApikeyQueryKey({ apikey: checkKeyInput }) });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard.",
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Key className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">API Key Management</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Generate a free API key to access all Habibi API endpoints, or check the status of your existing key.
        </p>
      </div>

      <Tabs defaultValue="generate" className="w-full max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="generate">Generate Key</TabsTrigger>
          <TabsTrigger value="check">Check Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate">
          <Card className="border-border/50 shadow-md">
            <CardHeader>
              <CardTitle>Create New API Key</CardTitle>
              <CardDescription>
                Fill in your details below. We use your email to notify you about important API changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedKey ? (
                <div className="space-y-6">
                  <Alert className="bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Your API key has been generated. Please copy it now, it won't be shown again fully.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="bg-muted p-4 rounded-lg border flex items-center justify-between">
                    <code className="font-mono text-lg break-all">{generatedKey.apikey}</code>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(generatedKey.apikey)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={() => setGeneratedKey(null)}>
                    Generate Another Key
                  </Button>
                </div>
              ) : (
                <Form {...generateForm}>
                  <form onSubmit={generateForm.handleSubmit(onSubmitGenerate)} className="space-y-6">
                    <FormField
                      control={generateForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name / Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. John Doe or My Awesome App" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generateForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isGenerating}>
                      {isGenerating ? "Generating..." : "Generate Free API Key"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="check">
          <Card className="border-border/50 shadow-md">
            <CardHeader>
              <CardTitle>Check Key Status</CardTitle>
              <CardDescription>
                View your request limits, total usage, and validity status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter your API key..."
                  value={checkKeyInput}
                  onChange={(e) => setCheckKeyInput(e.target.value)}
                  className="font-mono"
                  onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                />
                <Button onClick={handleCheck} disabled={!checkKeyInput || isChecking}>
                  {isChecking ? "Checking..." : <><Search className="h-4 w-4 mr-2" /> Check</>}
                </Button>
              </div>

              {checkError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Invalid Key</AlertTitle>
                  <AlertDescription>
                    The API key provided does not exist or has been disabled.
                  </AlertDescription>
                </Alert>
              )}

              {keyInfo && !checkError && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-3 border-b flex justify-between items-center">
                    <span className="font-semibold">Key Information</span>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${keyInfo.isValid ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-destructive/20 text-destructive'}`}>
                      {keyInfo.isValid ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Owner</div>
                        <div className="font-medium">{keyInfo.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Email</div>
                        <div className="font-medium">{keyInfo.email}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Created At</div>
                        <div className="font-medium">{new Date(keyInfo.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Total Requests</div>
                        <div className="font-medium text-primary text-xl">{new Intl.NumberFormat().format(keyInfo.requestCount)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
