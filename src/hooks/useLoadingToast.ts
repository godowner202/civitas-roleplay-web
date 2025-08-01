import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

interface LoadingToastOptions {
  loading: string;
  success: string;
  error: string;
}

export const useLoadingToast = () => {
  const { toast } = useToast();

  const withLoadingToast = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      messages: LoadingToastOptions
    ): Promise<T> => {
      const loadingToast = toast({
        title: messages.loading,
        description: "Even geduld...",
      });

      try {
        const result = await asyncFn();
        
        loadingToast.dismiss();
        toast({
          title: "Gelukt!",
          description: messages.success,
        });
        
        return result;
      } catch (error) {
        loadingToast.dismiss();
        toast({
          title: "Fout",
          description: messages.error,
          variant: "destructive",
        });
        throw error;
      }
    },
    [toast]
  );

  return { withLoadingToast };
};