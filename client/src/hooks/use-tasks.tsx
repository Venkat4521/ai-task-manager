import { useQuery, useMutation } from "@tanstack/react-query";
import { Task, InsertTask } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./use-auth";

export function useTasks() {
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
    enabled: !!user,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (task: Partial<InsertTask>) => {
      const res = await apiRequest("POST", "/api/tasks", task);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Task> }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
  };
}
