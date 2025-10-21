import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { GitBranch, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BranchSelectorProps {
  owner: string;
  repo: string;
  currentBranch: string;
  onBranchChange: (branch: string) => void;
}

export function BranchSelector({ 
  owner, 
  repo, 
  currentBranch, 
  onBranchChange 
}: BranchSelectorProps) {
  const [branches, setBranches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (repo) {
      fetchBranches();
    }
  }, [owner, repo]);

  const fetchBranches = async () => {
    if (!repo) return;
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('get-repo-branches', {
        body: { 
          repositoryName: repo,
          provider_token: session?.provider_token 
        }
      });

      if (error) {
        console.error('Error fetching branches:', error);
        toast({
          title: "Failed to load branches",
          description: "Could not fetch repository branches.",
          variant: "destructive",
        });
        return;
      }

      if (data?.branches) {
        setBranches(data.branches.map((b: any) => b.name));
      }
    } catch (err) {
      console.error('Exception fetching branches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center min-w-[140px]">
      {isLoading ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-md border border-border">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      ) : (
        <Select value={currentBranch} onValueChange={onBranchChange}>
          <SelectTrigger className="h-8 px-3 bg-secondary hover:bg-muted border-border text-sm font-normal gap-2">
            <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {branches.map((branch) => (
              <SelectItem 
                key={branch} 
                value={branch}
                className="text-sm hover:bg-muted cursor-pointer"
              >
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
