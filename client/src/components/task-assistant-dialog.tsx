import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Brain, Clock, Target, Sun, AlertTriangle, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface TaskAssistantDialogProps {
  taskId: number;
  taskTitle: string;
  onUpdate: (taskId: number, updates: any) => void;
}

export function TaskAssistantDialog({ taskId, taskTitle, onUpdate }: TaskAssistantDialogProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleAssistance = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tasks/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, query }),
      });

      if (!res.ok) throw new Error("Failed to get AI assistance");

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("AI assistance error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimizationApply = async (updates: any) => {
    try {
      onUpdate(taskId, updates);
    } catch (error) {
      console.error("Failed to apply optimization:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="group neon-border hover:bg-primary/10">
          <Brain className="h-4 w-4 mr-2 group-hover:text-primary" />
          Get AI Help
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] glass-bg">
        <DialogHeader>
          <DialogTitle className="neon-gradient">AI Task Assistant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="How can I help you with this task?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="focus-visible:ring-primary"
            />
            <Button
              onClick={handleAssistance}
              disabled={isLoading || !query}
              className="bg-primary/90 hover:bg-primary neon-border"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
            </Button>
          </div>

          <AnimatePresence>
            {response && (
              <ScrollArea className="h-[400px] w-full rounded-md border border-primary/20 p-4 glass-bg">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <p className="text-sm">{response.response}</p>
                  </div>

                  {response.optimizationSuggestions && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium neon-gradient">Optimization Suggestions</h4>

                      {response.optimizationSuggestions.timeManagement?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-2"
                        >
                          <h5 className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            Time Management
                          </h5>
                          <ul className="space-y-1">
                            {response.optimizationSuggestions.timeManagement.map((tip: string, i: number) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-sm flex items-start gap-2"
                              >
                                <span className="text-primary">•</span>
                                {tip}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {response.optimizationSuggestions.focusStrategies?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-2"
                        >
                          <h5 className="text-sm font-medium flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            Focus Strategies
                          </h5>
                          <ul className="space-y-1">
                            {response.optimizationSuggestions.focusStrategies.map((strategy: string, i: number) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-sm flex items-start gap-2"
                              >
                                <span className="text-primary">•</span>
                                {strategy}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}

                      {response.optimizationSuggestions.toolsAndTechniques?.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-2"
                        >
                          <h5 className="text-sm font-medium flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            Tools & Techniques
                          </h5>
                          <ul className="space-y-1">
                            {response.optimizationSuggestions.toolsAndTechniques.map((tool: string, i: number) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-sm flex items-start gap-2"
                              >
                                <span className="text-primary">•</span>
                                {tool}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {response.actionItems?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 neon-gradient">Action Items:</h4>
                      <ul className="space-y-2">
                        {response.actionItems.map((item: string, i: number) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-sm flex items-start gap-2"
                          >
                            <span className="text-primary">•</span>
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {response.additionalTips?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 neon-gradient">Tips:</h4>
                      <ul className="space-y-2">
                        {response.additionalTips.map((tip: string, i: number) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-sm flex items-start gap-2"
                          >
                            <span className="text-primary">•</span>
                            {tip}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </ScrollArea>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}