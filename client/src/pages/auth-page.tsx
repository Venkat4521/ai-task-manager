import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Redirect } from "wouter";
import { Loader2, Brain, Sparkles } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#00BCD4]/10 via-[#00E5FF]/10 to-[#2196F3]/10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 p-8 flex items-center justify-center"
      >
        <Card className="w-[400px] border-[#00BCD4]/20 glass-bg">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <Brain className="h-6 w-6 text-[#00BCD4]" />
              <CardTitle className="text-2xl neon-gradient">
                Welcome to TaskAI
              </CardTitle>
            </motion.div>
            <CardDescription className="text-muted-foreground">
              Manage your tasks with AI-powered suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 neon-border">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form
                    onSubmit={loginForm.handleSubmit((data) =>
                      loginMutation.mutate(data)
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="focus-visible:ring-[#00BCD4]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              {...field} 
                              className="focus-visible:ring-[#00BCD4]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-primary/90 hover:bg-primary neon-border"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Login
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit((data) =>
                      registerMutation.mutate(data)
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="focus-visible:ring-[#00BCD4]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              {...field}
                              className="focus-visible:ring-[#00BCD4]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-primary/90 hover:bg-primary neon-border"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Register
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 bg-gradient-to-br from-[#00BCD4]/20 via-[#00E5FF]/20 to-[#2196F3]/20 p-8 hidden lg:flex items-center justify-center"
      >
        <div className="max-w-md space-y-6">
          <h1 className="text-5xl font-bold neon-gradient">
            Supercharge Your Productivity
          </h1>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <Sparkles className="h-5 w-5 text-[#00E5FF]" />
              <p className="text-lg text-muted-foreground">
                AI-powered task suggestions help you break down complex tasks
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <Sparkles className="h-5 w-5 text-[#00E5FF]" />
              <p className="text-lg text-muted-foreground">
                Real-time updates keep you and your team in sync
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}