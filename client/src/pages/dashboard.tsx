import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { useWebSocket } from "@/hooks/use-websocket";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, LogOut, CheckCircle2, Sparkles } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TaskAssistantDialog } from "@/components/task-assistant-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const taskVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    x: -100,
    transition: {
      duration: 0.2
    }
  }
};

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const { tasks, isLoading, createTask, updateTask, isCreating } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useWebSocket();

  const form = useForm({
    resolver: zodResolver(insertTaskSchema.omit({ userId: true })),
    defaultValues: {
      title: "",
      description: "",
      dueDate: null,
      reminder: null,
      checkpoints: [],
      status: "pending",
    },
  });

  const onSubmit = async (data: any) => {
    await createTask(data);
    setIsDialogOpen(false);
    form.reset();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#00BCD4]/10 via-[#00E5FF]/10 to-[#2196F3]/10">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin neon-gradient mx-auto mb-4" />
          <p className="text-muted-foreground animate-pulse">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pattern-grid bg-background">
      <header className="border-b glass-bg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold neon-gradient"
          >
            TaskAI
          </motion.h1>
          <div className="flex items-center gap-4">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground"
            >
              Welcome, {user?.username}
            </motion.span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="group hover-glow neon-border hover:bg-primary/10 transition-all"
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-bold mb-2 neon-gradient">
              Your Tasks
            </h2>
            <p className="text-muted-foreground">
              Manage your tasks with AI-powered suggestions
            </p>
          </motion.div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary/90 hover:bg-primary transition-colors neon-border">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-bg">
              <DialogHeader>
                <DialogTitle className="neon-gradient">Create New Task</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="focus-visible:ring-[#00BCD4]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="focus-visible:ring-[#00BCD4]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reminder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reminder</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Set reminder</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="w-full bg-primary/90 hover:bg-primary neon-border"
                  >
                    {isCreating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Create Task
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <AnimatePresence>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                variants={taskVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="transition-all duration-200"
              >
                <Card className="hover-glow hover:shadow-lg transition-all duration-300 border-primary/20 glass-bg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1 flex items-center gap-2">
                          {task.title}
                          {task.completed && (
                            <CheckCircle2 className="h-4 w-4 text-[#00E5FF]" />
                          )}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {task.description}
                        </CardDescription>
                        {task.dueDate && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Due: {format(new Date(task.dueDate), "PPP")}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <TaskAssistantDialog
                          taskId={task.id}
                          taskTitle={task.title}
                          onUpdate={updateTask}
                        />
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={(checked) =>
                            updateTask({
                              id: task.id,
                              updates: { completed: !!checked },
                            })
                          }
                          className="transition-transform hover:scale-110 data-[state=checked]:bg-[#00E5FF] data-[state=checked]:text-primary-foreground"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  {(task.aiSuggestion || task.checkpoints?.length > 0) && (
                    <CardContent>
                      <ScrollArea className="h-[100px] w-full rounded-md border border-primary/20 p-4 glass-bg">
                        <div className="space-y-2">
                          {task.aiSuggestion && JSON.parse(task.aiSuggestion).breakdown.map(
                            (step: string, i: number) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-2"
                              >
                                <Sparkles className="h-4 w-4 text-[#00E5FF] mt-1" />
                                <span>{step}</span>
                              </motion.div>
                            )
                          )}
                          {task.checkpoints?.map((checkpoint: string, i: number) => (
                            <motion.div
                              key={`checkpoint-${i}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-2"
                            >
                              <CheckCircle2 className="h-4 w-4 text-[#00E5FF] mt-1" />
                              <span>{checkpoint}</span>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
}