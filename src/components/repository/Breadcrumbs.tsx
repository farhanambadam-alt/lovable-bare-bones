import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreadcrumbsProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Breadcrumbs({ currentPath, onNavigate }: BreadcrumbsProps) {
  const pathSegments = currentPath ? currentPath.split('/').filter(Boolean) : [];

  return (
    <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-thin py-3 md:py-2 text-sm scroll-smooth">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate("")}
        className="h-9 md:h-7 px-3 md:px-2 hover:bg-secondary/50 text-muted-foreground hover:text-foreground touch-manipulation active:scale-95 transition-transform flex-shrink-0"
      >
        <Home className="h-4 w-4 md:h-3.5 md:w-3.5 mr-2 md:mr-1.5" />
        <span className="font-medium text-sm md:text-xs">Root</span>
      </Button>

      {pathSegments.map((segment, index) => {
        const path = pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;

        return (
          <div key={path} className="flex items-center gap-0.5 flex-shrink-0">
            <ChevronRight className="h-4 w-4 md:h-3.5 md:w-3.5 text-muted-foreground flex-shrink-0" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(path)}
              className={`h-9 md:h-7 px-3 md:px-2 hover:bg-secondary/50 touch-manipulation active:scale-95 transition-transform ${
                isLast 
                  ? 'text-foreground font-semibold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="truncate max-w-[150px] md:max-w-[120px] text-sm md:text-xs">{segment}</span>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
